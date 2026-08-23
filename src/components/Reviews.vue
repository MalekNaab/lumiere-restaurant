<script setup>
const reviews = [
  {
    name: "Amelia R.",
    role: "London",
    text: "One of the best dining experiences we’ve had in a long time. The food was beautifully presented and the service felt effortless.",
    rating: 5,
  },
  {
    name: "Daniel M.",
    role: "Manchester",
    text: "The atmosphere was incredible. Perfect for a date night and the lamb was outstanding. We’ll definitely be coming back.",
    rating: 5,
  },
  {
    name: "Sophie T.",
    role: "London",
    text: "Stylish, intimate and genuinely memorable. The staff were attentive without being overbearing and every course was excellent.",
    rating: 5,
  },
];
</script>

<template>
  <section id="reviews" class="section-padding reviews-section">
    <div class="container">
      <div class="section-heading text-center">
        <p class="section-label">
          Guest Experiences
        </p>

        <h2>
          What Our Guests Say
        </h2>

        <div class="gold-line centered"></div>

        <p class="section-description mx-auto">
          Memorable evenings, thoughtful service and dishes designed to leave a
          lasting impression.
        </p>
      </div>

      <div class="row g-4">
        <div
          v-for="review in reviews"
          :key="review.name"
          class="col-lg-4"
        >
          <article class="review-card">
            <div class="review-quote">
              <i class="bi bi-quote"></i>
            </div>

            <div class="review-stars">
              <i
                v-for="star in review.rating"
                :key="star"
                class="bi bi-star-fill"
              ></i>
            </div>

            <p class="review-text">
              “{{ review.text }}”
            </p>

            <div class="review-footer">
              <div class="review-avatar">
                {{ review.name.charAt(0) }}
              </div>

              <div>
                <h3>{{ review.name }}</h3>
                <span>{{ review.role }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>