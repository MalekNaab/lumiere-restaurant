<script setup>
import { onMounted } from "vue";

import Navbar from "./components/Navbar.vue";
import Hero from "./components/Hero.vue";
import About from "./components/About.vue";
import FeaturedDishes from "./components/FeaturedDishes.vue";
import Experience from "./components/Experience.vue";
import Reviews from "./components/Reviews.vue";
import Location from "./components/Location.vue";
import BookingForm from "./components/BookingForm.vue";
import Footer from "./components/Footer.vue";

onMounted(() => {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
});
</script>

<template>
  <div class="app-wrapper">
    <Navbar />

    <main>
      <Hero />

      <div class="reveal">
        <About />
      </div>

      <div class="reveal">
        <FeaturedDishes />
      </div>

      <div class="reveal">
        <Experience />
      </div>

      <div class="reveal">
        <Reviews />
      </div>

      <div class="reveal">
        <Location />
      </div>

      <div class="reveal">
        <BookingForm />
      </div>
    </main>

    <div class="reveal">
      <Footer />
    </div>
  </div>
</template>