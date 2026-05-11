/* ═══════════════════════════════════════════
   Jyothilal Reji — Developer Portfolio
   Static JS
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  // ─── Dynamic Dates ───
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const privacyDateEl = document.getElementById("privacyDate");
  if (privacyDateEl) {
    privacyDateEl.textContent = "Last updated: " + formattedDate;
  }

  const footerYearEl = document.getElementById("footerYear");
  if (footerYearEl) {
    footerYearEl.textContent = now.getFullYear();
  }

  // ─── Mobile Menu Toggle ───
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function openMenu() {
    menuToggle.classList.add("open");
    mobileMenu.classList.add("open");
  }

  function closeMenu() {
    menuToggle.classList.remove("open");
    mobileMenu.classList.remove("open");
  }

  menuToggle.addEventListener("click", function () {
    if (mobileMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // ─── Smooth Scroll & Close Mobile Menu ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        closeMenu();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ─── Active Section Tracking ───
  var sections = ["home", "about", "app", "privacy", "contact"];
  var allNavLinks = document.querySelectorAll(".nav-link");

  function updateActiveLink(sectionId) {
    allNavLinks.forEach(function (link) {
      var linkSection = link.getAttribute("data-section");
      if (linkSection === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function onScroll() {
    for (var i = sections.length - 1; i >= 0; i--) {
      var el = document.getElementById(sections[i]);
      if (el && el.getBoundingClientRect().top <= 120) {
        updateActiveLink(sections[i]);
        break;
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // ─── Scroll Animations (Intersection Observer) ───
  var animateElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-80px 0px",
      }
    );

    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    animateElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }
})();
