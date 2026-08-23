<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const mobileOpen = ref(false);
const scrolled = ref(false);
const activeSection = ref("home");

const sections = [
  "home",
  "about",
  "menu",
  "experience",
  "reviews",
  "location",
  "booking",
];

const closeMenu = () => {
  mobileOpen.value = false;
};

const toggleMenu = () => {
  mobileOpen.value = !mobileOpen.value;
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;

  const scrollPosition = window.scrollY + 180;

  let currentSection = "home";

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);

    if (section && section.offsetTop <= scrollPosition) {
      currentSection = sectionId;
    }
  });

  activeSection.value = currentSection;
};

const handleResize = () => {
  if (window.innerWidth > 992) {
    mobileOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);

  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <nav
    class="main-navbar"
    :class="{
      scrolled: scrolled,
      'menu-open': mobileOpen
    }"
  >
    <div class="container navbar-inner">

      <!-- LOGO -->
      <a
        href="#home"
        class="restaurant-logo"
        @click="closeMenu"
      >
        LUMIÈRE
        <small>RESTAURANT</small>
      </a>

      <!-- DESKTOP NAV -->
      <div class="nav-links">

        <a
          href="#home"
          :class="{ active: activeSection === 'home' }"
        >
          Home
        </a>

        <a
          href="#about"
          :class="{ active: activeSection === 'about' }"
        >
          About
        </a>

        <a
          href="#menu"
          :class="{ active: activeSection === 'menu' }"
        >
          Menu
        </a>

        <a
          href="#experience"
          :class="{ active: activeSection === 'experience' }"
        >
          Gallery
        </a>

        <a
          href="#reviews"
          :class="{ active: activeSection === 'reviews' }"
        >
          Reviews
        </a>

        <a
          href="#location"
          :class="{ active: activeSection === 'location' }"
        >
          Location
        </a>

        <a
          href="#booking"
          :class="{ active: activeSection === 'booking' }"
        >
          Reservations
        </a>

      </div>

      <!-- BOOK BUTTON -->
      <a
        href="#booking"
        class="nav-book-btn"
      >
        Book a Table
      </a>

      <!-- MOBILE BUTTON -->
      <button
        class="mobile-menu-btn"
        type="button"
        :aria-expanded="mobileOpen"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <i
          :class="
            mobileOpen
              ? 'bi bi-x-lg'
              : 'bi bi-list'
          "
        ></i>
      </button>

    </div>

    <!-- MOBILE NAV -->
    <transition name="mobile-nav">

      <div
        v-if="mobileOpen"
        class="mobile-menu"
      >

        <a
          href="#home"
          :class="{ active: activeSection === 'home' }"
          @click="closeMenu"
        >
          Home
        </a>

        <a
          href="#about"
          :class="{ active: activeSection === 'about' }"
          @click="closeMenu"
        >
          About
        </a>

        <a
          href="#menu"
          :class="{ active: activeSection === 'menu' }"
          @click="closeMenu"
        >
          Menu
        </a>

        <a
          href="#experience"
          :class="{ active: activeSection === 'experience' }"
          @click="closeMenu"
        >
          Gallery
        </a>

        <a
          href="#reviews"
          :class="{ active: activeSection === 'reviews' }"
          @click="closeMenu"
        >
          Reviews
        </a>

        <a
          href="#location"
          :class="{ active: activeSection === 'location' }"
          @click="closeMenu"
        >
          Location
        </a>

        <a
          href="#booking"
          :class="{ active: activeSection === 'booking' }"
          @click="closeMenu"
        >
          Reservations
        </a>

        <a
          href="#booking"
          class="mobile-book-button"
          @click="closeMenu"
        >
          Book a Table
        </a>

      </div>

    </transition>
  </nav>
</template>