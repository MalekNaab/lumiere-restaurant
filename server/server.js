require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const MAX_BOOKINGS_PER_SLOT = 3;
const BOOKING_DURATION_HOURS = 2;


// =====================================================
// CORS
// =====================================================

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL
      .split(",")
      .map((origin) => origin.trim())
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without an origin,
      // such as local API testing.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    }
  })
);

app.use(express.json());


// =====================================================
// GOOGLE CALENDAR AUTHENTICATION
// =====================================================

let auth;

const credentialsPath = path.join(
  __dirname,
  "credentials",
  "service-account.json"
);


// Production / Render
if (
  process.env.GOOGLE_CLIENT_EMAIL &&
  process.env.GOOGLE_PRIVATE_KEY
) {

  auth = new google.auth.GoogleAuth({
    credentials: {
      client_email:
        process.env.GOOGLE_CLIENT_EMAIL,

      private_key:
        process.env.GOOGLE_PRIVATE_KEY
          .replace(/\\n/g, "\n")
    },

    scopes: [
      "https://www.googleapis.com/auth/calendar"
    ]
  });

  console.log(
    "Google authentication: environment variables"
  );

}

// Local development
else if (fs.existsSync(credentialsPath)) {

  auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,

    scopes: [
      "https://www.googleapis.com/auth/calendar"
    ]
  });

  console.log(
    "Google authentication: local service account JSON"
  );

}

else {

  console.error(
    "Google Calendar credentials are missing."
  );

  process.exit(1);
}


const calendar = google.calendar({
  version: "v3",
  auth
});


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "Lumiere Restaurant Booking API is running."
  });

});


// =====================================================
// BOOKING TIME HELPER
// =====================================================

function buildBookingTimes(date, time) {

  const start = new Date(
    `${date}T${time}:00`
  );

  const end = new Date(
    start.getTime() +
      (
        BOOKING_DURATION_HOURS *
        60 *
        60 *
        1000
      )
  );

  return {
    start,
    end
  };

}


// =====================================================
// AVAILABILITY CHECK
// =====================================================

async function checkAvailability(
  start,
  end
) {

  const response =
    await calendar.events.list({

      calendarId:
        process.env.GOOGLE_CALENDAR_ID,

      timeMin:
        start.toISOString(),

      timeMax:
        end.toISOString(),

      singleEvents:
        true,

      orderBy:
        "startTime"

    });


  const events =
    response.data.items || [];


  const restaurantBookings =
    events.filter((event) => {

      return (
        event.summary &&
        event.summary.startsWith(
          "Restaurant Booking"
        )
      );

    });


  const currentBookings =
    restaurantBookings.length;


  return {

    available:
      currentBookings <
      MAX_BOOKINGS_PER_SLOT,

    currentBookings,

    remainingSlots:
      Math.max(
        0,
        MAX_BOOKINGS_PER_SLOT -
          currentBookings
      )

  };

}


// =====================================================
// AVAILABILITY ENDPOINT
// =====================================================

app.get(
  "/api/availability",
  async (req, res) => {

    try {

      const {
        date,
        time
      } = req.query;


      if (!date || !time) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Date and time are required."

          });

      }


      const {
        start,
        end
      } = buildBookingTimes(
        date,
        time
      );


      const availability =
        await checkAvailability(
          start,
          end
        );


      return res.json({

        success: true,

        ...availability

      });


    } catch (error) {

      console.error(
        "Availability error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to check availability."

        });

    }

  }
);


// =====================================================
// CREATE BOOKING
// =====================================================

app.post(
  "/api/bookings",
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        guests,
        date,
        time,
        specialRequests
      } = req.body;


      if (
        !name ||
        !email ||
        !phone ||
        !guests ||
        !date ||
        !time
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Please complete all required booking fields."

          });

      }


      const {
        start,
        end
      } = buildBookingTimes(
        date,
        time
      );


      const availability =
        await checkAvailability(
          start,
          end
        );


      if (!availability.available) {

        return res
          .status(409)
          .json({

            success: false,

            message:
              "Sorry, this time slot is fully booked. Please choose another time."

          });

      }


      const event = {

        summary:
          `Restaurant Booking - ${name}`,

        description:
`Lumiere Restaurant Reservation

Customer: ${name}
Email: ${email}
Phone: ${phone}
Guests: ${guests}

Special Requests:
${specialRequests || "None"}`,

        start: {

          dateTime:
            start.toISOString(),

          timeZone:
            "Europe/London"

        },

        end: {

          dateTime:
            end.toISOString(),

          timeZone:
            "Europe/London"

        }

      };


      const response =
        await calendar.events.insert({

          calendarId:
            process.env.GOOGLE_CALENDAR_ID,

          resource:
            event

        });


      console.log(
        "Booking created:",
        response.data.id
      );


      return res
        .status(201)
        .json({

          success: true,

          message:
            "Your table has been successfully reserved.",

          bookingId:
            response.data.id,

          remainingSlots:
            Math.max(
              0,
              availability.remainingSlots - 1
            )

        });


    } catch (error) {

      console.error(
        "Booking creation error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to create the reservation. Please try again."

        });

    }

  }
);


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

  console.log("");
  console.log(
    "==================================="
  );
  console.log(
    " Lumiere Restaurant Booking API"
  );
  console.log(
    "==================================="
  );

  console.log(
    `Port: ${PORT}`
  );

  console.log(
    `Maximum bookings: ${MAX_BOOKINGS_PER_SLOT}`
  );

  console.log(
    `Reservation duration: ${BOOKING_DURATION_HOURS} hours`
  );

  console.log("");

});
