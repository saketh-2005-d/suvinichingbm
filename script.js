// Enhanced scroll to section function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    updateActiveNavLink(sectionId);
  }
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));

  const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Update nav links on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  if (current) {
    updateActiveNavLink(current);
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Initialize animations and observers
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(
    ".product-card, .skincare-card, .tip-card, .skin-type",
  );

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = `opacity 0.5s ease, transform 0.5s ease ${index * 0.05}s`;
    observer.observe(card);
  });

  // Add image lazy loading support
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger load if not already loaded
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
});

// Product card hover effects
document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(
    ".product-card, .skincare-card",
  );

  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
});

// Smooth link navigation for footer
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
      }
    });
  });
});

// Add filter functionality for products (optional enhancement)
function filterProducts(category) {
  const cards = document.querySelectorAll(".product-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    if (!category || cardCategory === category || category === "all") {
      card.style.display = "block";
      card.style.opacity = "1";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  return visibleCount;
}

// Search functionality
function searchProducts(query) {
  const cards = document.querySelectorAll(".product-card, .skincare-card");
  const lowerQuery = query.toLowerCase();
  let resultCount = 0;

  cards.forEach((card) => {
    const productName =
      card.querySelector("h4")?.textContent.toLowerCase() || "";
    const brandName =
      card.querySelector(".brand-name")?.textContent.toLowerCase() || "";
    const description =
      card.querySelector(".product-desc")?.textContent.toLowerCase() || "";

    if (
      productName.includes(lowerQuery) ||
      brandName.includes(lowerQuery) ||
      description.includes(lowerQuery)
    ) {
      card.style.display = "block";
      card.style.opacity = "1";
      resultCount++;
    } else {
      card.style.display = "none";
    }
  });

  return resultCount;
}

// Handle navigation sticky behavior on mobile
window.addEventListener("resize", () => {
  const navbar = document.querySelector(".navbar");
  if (window.innerWidth < 768) {
    navbar.style.position = "sticky";
  }
});

// Add smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = "smooth";

// Track page scroll progress
window.addEventListener("scroll", () => {
  const scrollPercentage =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;
  // Can be used for progress bar visualization if needed
});

// Preload critical images
window.addEventListener("load", () => {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    // Ensure images are fully loaded
    if (img.complete) {
      img.style.opacity = "1";
    }
  });
});

// Accessibility enhancement - add keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    window.scrollBy({
      top: 100,
      behavior: "smooth",
    });
  }
  if (e.key === "ArrowUp") {
    window.scrollBy({
      top: -100,
      behavior: "smooth",
    });
  }
});

// Add meta tags for better SEO and sharing
document.addEventListener("DOMContentLoaded", () => {
  const metaTags = {
    description:
      "Premium cosmetics and skincare guide with real products from MAC, Maybelline, Urban Decay, and more.",
    keywords: "makeup, skincare, cosmetics, beauty, brands, guide",
    "og:title": "Beauty Pro - Premium Cosmetics & Skincare Guide",
    "og:description":
      "Discover makeup and skincare products with expert guidance for all skin types.",
    "og:type": "website",
  };

  // Meta tags are typically handled by HTML head, but can be updated dynamically if needed
});

// Performance optimization - defer non-critical scripts
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    // Load analytics or other non-critical scripts here
  });
}

// Log page analytics (can be connected to real analytics service)
console.log("Beauty Pro Website Loaded - " + new Date().toLocaleString());
