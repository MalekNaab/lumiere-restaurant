<script setup>
import { computed, ref } from "vue";

const activeCategory = ref("Starters");

const categories = [
  "Starters",
  "Mains",
  "Grill",
  "Desserts",
  "Cocktails",
];

const menuItems = [
  {
    category: "Starters",
    name: "Seared Scallops",
    description: "Cauliflower purée, apple, hazelnut and herb oil.",
    price: "£16",
  },
  {
    category: "Starters",
    name: "Burrata",
    description: "Heirloom tomato, basil oil, balsamic and sourdough.",
    price: "£14",
  },
  {
    category: "Starters",
    name: "Beef Tartare",
    description: "Capers, shallot, Dijon mustard and toasted brioche.",
    price: "£17",
  },
  {
    category: "Starters",
    name: "Crispy Calamari",
    description: "Lemon, chilli, herbs and smoked garlic aioli.",
    price: "£13",
  },

  {
    category: "Mains",
    name: "Herb-Crusted Lamb",
    description: "Fondant potato, seasonal greens and red wine jus.",
    price: "£28",
  },
  {
    category: "Mains",
    name: "Pan-Roasted Sea Bass",
    description: "Asparagus, crushed potatoes and lemon beurre blanc.",
    price: "£27",
  },
  {
    category: "Mains",
    name: "Wild Mushroom Risotto",
    description: "Parmesan, truffle, herbs and aged balsamic.",
    price: "£22",
  },
  {
    category: "Mains",
    name: "Roasted Chicken Supreme",
    description: "Potato terrine, charred leek and thyme jus.",
    price: "£24",
  },

  {
    category: "Grill",
    name: "Fillet Steak",
    description: "8oz fillet, fries, watercress and peppercorn sauce.",
    price: "£38",
  },
  {
    category: "Grill",
    name: "Ribeye Steak",
    description: "10oz ribeye, truffle fries and red wine jus.",
    price: "£34",
  },
  {
    category: "Grill",
    name: "Grilled Lamb Cutlets",
    description: "Rosemary, garlic, roasted vegetables and jus.",
    price: "£32",
  },
  {
    category: "Grill",
    name: "Charred King Prawns",
    description: "Garlic butter, lemon, chilli and grilled sourdough.",
    price: "£29",
  },

  {
    category: "Desserts",
    name: "Dark Chocolate Delice",
    description: "Salted caramel, praline crumb and vanilla.",
    price: "£9",
  },
  {
    category: "Desserts",
    name: "Crème Brûlée",
    description: "Madagascan vanilla and almond biscuit.",
    price: "£8",
  },
  {
    category: "Desserts",
    name: "Sticky Toffee Pudding",
    description: "Toffee sauce and vanilla bean ice cream.",
    price: "£9",
  },
  {
    category: "Desserts",
    name: "Lemon Tart",
    description: "Italian meringue and raspberry sorbet.",
    price: "£8",
  },

  {
    category: "Cocktails",
    name: "Lumière Martini",
    description: "Vodka, passion fruit, vanilla and sparkling wine.",
    price: "£14",
  },
  {
    category: "Cocktails",
    name: "Smoked Old Fashioned",
    description: "Bourbon, bitters, brown sugar and orange.",
    price: "£15",
  },
  {
    category: "Cocktails",
    name: "Golden Hour",
    description: "Gin, elderflower, citrus and prosecco.",
    price: "£13",
  },
  {
    category: "Cocktails",
    name: "Midnight Espresso",
    description: "Vodka, coffee liqueur and fresh espresso.",
    price: "£13",
  },
];

const filteredItems = computed(() =>
  menuItems.filter((item) => item.category === activeCategory.value)
);

const featuredDishes = [
  {
    name: "Seared Scallops",
    description: "Cauliflower purée, apple, hazelnut and herb oil.",
    price: "£16",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Herb-Crusted Lamb",
    description: "Fondant potato, seasonal greens and red wine jus.",
    price: "£28",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Dark Chocolate Delice",
    description: "Salted caramel, praline crumb and vanilla.",
    price: "£9",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85",
  },
];
</script>

<template>
  <section id="menu" class="section-padding menu-section">
    <div class="container">
      <div class="section-heading text-center">
        <p class="section-label">
          Chef's Favourites
        </p>

        <h2>
          Featured Dishes
        </h2>

        <div class="gold-line centered"></div>
      </div>

      <div class="row g-4 featured-dishes-grid">
        <div
          v-for="dish in featuredDishes"
          :key="dish.name"
          class="col-lg-4 col-md-6"
        >
          <article class="dish-card">
            <div class="dish-image-wrapper">
              <img
                :src="dish.image"
                :alt="dish.name"
                class="dish-image"
              />
            </div>

            <div class="dish-content">
              <div class="dish-title-row">
                <h3>{{ dish.name }}</h3>
                <span>{{ dish.price }}</span>
              </div>

              <p>
                {{ dish.description }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <div class="full-menu-wrapper">
        <div class="full-menu-heading text-center">
          <p class="section-label">
            Explore the Menu
          </p>

          <h2>
            The Lumière Menu
          </h2>

          <p class="section-description mx-auto">
            Seasonal dishes inspired by modern European cuisine and crafted
            with carefully selected ingredients.
          </p>
        </div>

        <div class="menu-tabs">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="menu-tab"
            :class="{ active: activeCategory === category }"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="menu-list">
          <article
            v-for="item in filteredItems"
            :key="item.name"
            class="menu-list-item"
          >
            <div class="menu-item-main">
              <div class="menu-item-heading">
                <h3>{{ item.name }}</h3>

                <div class="menu-dots"></div>

                <span>{{ item.price }}</span>
              </div>

              <p>
                {{ item.description }}
              </p>
            </div>
          </article>
        </div>

        <div class="menu-bottom-note text-center">
          <p>
            Please let our team know about any allergies or dietary
            requirements when booking.
          </p>

          <a href="#booking" class="btn btn-gold">
            Book a Table
          </a>
        </div>
      </div>
    </div>
  </section>
</template>