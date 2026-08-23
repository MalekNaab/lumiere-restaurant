<script setup>
import {
  computed,
  reactive,
  ref,
  watch
} from "vue";

const submitted = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const bookingId = ref("");

const checkingAvailability = ref(false);
const availabilityMessage = ref("");
const slotAvailable = ref(null);

const booking = reactive({
  guests: "2",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
  requests: "",
});

const today = computed(() => {
  const now = new Date();
  return now.toISOString().split("T")[0];
});

const validateName = () => {
  return booking.name.trim().length >= 2;
};

const validateEmail = () => {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(
    booking.email.trim()
  );
};

const validatePhone = () => {
  const cleaned =
    booking.phone.replace(
      /[\s()-]/g,
      ""
    );

  return /^\+?[0-9]{9,15}$/.test(
    cleaned
  );
};

const validateForm = () => {
  if (!validateName()) {
    errorMessage.value =
      "Please enter a valid name.";

    return false;
  }

  if (!validateEmail()) {
    errorMessage.value =
      "Please enter a valid email address.";

    return false;
  }

  if (!validatePhone()) {
    errorMessage.value =
      "Please enter a valid phone number.";

    return false;
  }

  if (!booking.date) {
    errorMessage.value =
      "Please select a booking date.";

    return false;
  }

  if (!booking.time) {
    errorMessage.value =
      "Please select a booking time.";

    return false;
  }

  if (slotAvailable.value === false) {
    errorMessage.value =
      "This time slot is fully booked. Please choose another time.";

    return false;
  }

  return true;
};

const checkAvailability = async () => {
  availabilityMessage.value = "";
  slotAvailable.value = null;

  if (
    !booking.date ||
    !booking.time
  ) {
    return;
  }

  checkingAvailability.value = true;

  try {
    const params =
      new URLSearchParams({
        date: booking.date,
        time: booking.time,
      });

    const response =
      await fetch(
        `http://localhost:3000/api/availability?${params.toString()}`
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Unable to check availability."
      );
    }

    slotAvailable.value =
      data.available;

    if (data.available) {
      availabilityMessage.value =
        data.remainingSlots === 1
          ? "Available - 1 booking slot remaining."
          : `Available - ${data.remainingSlots} booking slots remaining.`;
    } else {
      availabilityMessage.value =
        "Fully booked - please choose another time.";
    }
  } catch (error) {
    console.error(
      "Availability error:",
      error
    );

    slotAvailable.value = null;

    availabilityMessage.value =
      "Unable to check availability right now.";
  } finally {
    checkingAvailability.value = false;
  }
};

watch(
  () => [
    booking.date,
    booking.time
  ],
  () => {
    errorMessage.value = "";
    checkAvailability();
  }
);

const submitBooking = async () => {
  errorMessage.value = "";

  if (!validateForm()) {
    return;
  }

  if (checkingAvailability.value) {
    errorMessage.value =
      "Please wait while we check availability.";

    return;
  }

  loading.value = true;

  try {
    const response =
      await fetch(
        "http://localhost:3000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              booking.name.trim(),

            email:
              booking.email.trim(),

            phone:
              booking.phone.trim(),

            guests:
              Number(
                booking.guests
              ),

            date:
              booking.date,

            time:
              booking.time,

            specialRequests:
              booking.requests.trim(),
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Unable to create booking."
      );
    }

    bookingId.value =
      data.bookingId || "";

    submitted.value = true;

  } catch (error) {
    console.error(
      "Booking error:",
      error
    );

    errorMessage.value =
      error.message ||
      "Something went wrong. Please try again.";

    if (
      error.message
        .toLowerCase()
        .includes("fully booked")
    ) {
      slotAvailable.value =
        false;

      availabilityMessage.value =
        "Fully booked - please choose another time.";
    }
  } finally {
    loading.value = false;
  }
};

const resetBooking = () => {
  booking.guests = "2";
  booking.date = "";
  booking.time = "";
  booking.name = "";
  booking.email = "";
  booking.phone = "";
  booking.requests = "";

  bookingId.value = "";
  errorMessage.value = "";
  availabilityMessage.value = "";
  slotAvailable.value = null;
  submitted.value = false;
};
</script>

<template>
  <section
    id="booking"
    class="section-padding booking-section"
  >
    <div class="container">
      <div class="booking-wrapper">

        <div v-if="!submitted">

          <div class="section-heading text-center mb-5">

            <p class="section-label">
              Reservations
            </p>

            <h2>
              Book a Table
            </h2>

            <p class="section-description mx-auto">
              Reserve your table for a memorable
              dining experience at Lumière.
            </p>

          </div>

          <div
            v-if="errorMessage"
            class="booking-error"
          >
            <i class="bi bi-exclamation-circle"></i>

            {{ errorMessage }}
          </div>

          <form @submit.prevent="submitBooking">

            <div class="row g-4">

              <div class="col-lg-4">

                <label class="form-label">
                  Guests
                </label>

                <select
                  v-model="booking.guests"
                  class="form-select"
                  required
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7">7 Guests</option>
                  <option value="8">8 Guests</option>
                </select>

              </div>

              <div class="col-lg-4">

                <label class="form-label">
                  Date
                </label>

                <input
                  v-model="booking.date"
                  :min="today"
                  type="date"
                  class="form-control"
                  required
                />

              </div>

              <div class="col-lg-4">

                <label class="form-label">
                  Time
                </label>

                <select
                  v-model="booking.time"
                  class="form-select"
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select Time
                  </option>

                  <option value="17:00">
                    17:00
                  </option>

                  <option value="17:30">
                    17:30
                  </option>

                  <option value="18:00">
                    18:00
                  </option>

                  <option value="18:30">
                    18:30
                  </option>

                  <option value="19:00">
                    19:00
                  </option>

                  <option value="19:30">
                    19:30
                  </option>

                  <option value="20:00">
                    20:00
                  </option>

                  <option value="20:30">
                    20:30
                  </option>

                  <option value="21:00">
                    21:00
                  </option>

                  <option value="21:30">
                    21:30
                  </option>

                  <option value="22:00">
                    22:00
                  </option>

                </select>

              </div>

              <div
                v-if="
                  booking.date &&
                  booking.time
                "
                class="col-12"
              >

                <div
                  class="availability-box"
                  :class="{
                    available:
                      slotAvailable === true,

                    unavailable:
                      slotAvailable === false
                  }"
                >

                  <span
                    v-if="checkingAvailability"
                  >
                    <span
                      class="spinner-border spinner-border-sm me-2"
                    ></span>

                    Checking availability...
                  </span>

                  <span
                    v-else
                  >
                    <i
                      v-if="
                        slotAvailable === true
                      "
                      class="bi bi-check-circle"
                    ></i>

                    <i
                      v-else-if="
                        slotAvailable === false
                      "
                      class="bi bi-x-circle"
                    ></i>

                    {{ availabilityMessage }}
                  </span>

                </div>

              </div>

              <div class="col-md-6">

                <label class="form-label">
                  Name
                </label>

                <input
                  v-model="booking.name"
                  type="text"
                  class="form-control"
                  placeholder="Your full name"
                  minlength="2"
                  required
                />

              </div>

              <div class="col-md-6">

                <label class="form-label">
                  Email
                </label>

                <input
                  v-model="booking.email"
                  type="email"
                  class="form-control"
                  placeholder="you@example.com"
                  required
                />

              </div>

              <div class="col-12">

                <label class="form-label">
                  Phone
                </label>

                <input
                  v-model="booking.phone"
                  type="tel"
                  class="form-control"
                  placeholder="+44..."
                  required
                />

              </div>

              <div class="col-12">

                <label class="form-label">
                  Special Requests
                </label>

                <textarea
                  v-model="booking.requests"
                  class="form-control"
                  rows="4"
                  maxlength="500"
                  placeholder="Allergies, celebrations or special requests..."
                ></textarea>

              </div>

              <div class="col-12">

                <button
                  class="btn btn-gold booking-submit"
                  type="submit"
                  :disabled="
                    loading ||
                    checkingAvailability ||
                    slotAvailable === false
                  "
                >

                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>

                  {{
                    loading
                      ? "Booking..."
                      : "Confirm Booking"
                  }}

                </button>

              </div>

            </div>

          </form>

          <div class="booking-benefits">

            <div>
              <i class="bi bi-calendar-check"></i>
              <span>Live Availability</span>
            </div>

            <div>
              <i class="bi bi-shield-check"></i>
              <span>Secure Booking</span>
            </div>

            <div>
              <i class="bi bi-clock-history"></i>
              <span>Instant Confirmation</span>
            </div>

          </div>

        </div>

        <div
          v-else
          class="booking-confirmation"
        >

          <i class="bi bi-check-circle"></i>

          <p class="section-label">
            Reservation Confirmed
          </p>

          <h2>
            Thank You,
            {{ booking.name }}
          </h2>

          <p>
            Your table for

            <strong>
              {{ booking.guests }} guests
            </strong>

            has been booked for

            <strong>
              {{ booking.date }}
            </strong>

            at

            <strong>
              {{ booking.time }}
            </strong>.
          </p>

          <p class="confirmation-note">
            Your reservation has been added to the
            Lumière Restaurant booking calendar.
          </p>

          <p
            v-if="bookingId"
            class="booking-reference"
          >
            Booking reference:
            <strong>
              {{ bookingId }}
            </strong>
          </p>

          <button
            type="button"
            class="btn btn-outline-gold"
            @click="resetBooking"
          >
            Make Another Booking
          </button>

        </div>

      </div>
    </div>
  </section>
</template>

