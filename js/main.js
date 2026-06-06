const heroVideo = document.getElementById("hero-video");
const sceneContainer = document.querySelector(".scene-scroll-container");

if (heroVideo && sceneContainer) {
  const setupScrub = () => {
    heroVideo.play().then(() => heroVideo.pause()).catch(() => {});

    const scrub = () => {
      const containerTop =
        sceneContainer.getBoundingClientRect().top + window.scrollY;
      const scrollRange = sceneContainer.offsetHeight - window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - containerTop) / scrollRange),
      );

      heroVideo.currentTime = progress * heroVideo.duration;

      const fadeStart = 0.75;
      heroVideo.style.opacity =
        progress > fadeStart
          ? String(1 - ((progress - fadeStart) / 0.25) * 0.3)
          : "1";
    };

    window.addEventListener("scroll", scrub, { passive: true });
    scrub();
  };

  if (heroVideo.readyState >= 1) {
    setupScrub();
  } else {
    heroVideo.addEventListener("loadedmetadata", setupScrub, { once: true });
  }
}

const menuButton = document.querySelector(".menu-btn");
const primaryNav = document.getElementById("primary-nav");
const pageBody = document.body;

if (menuButton && primaryNav) {
  const closeMobileMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    menuButton.classList.remove("is-open");
    primaryNav.classList.remove("is-open");
    pageBody.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    const nextExpanded = !isExpanded;

    menuButton.setAttribute("aria-expanded", String(nextExpanded));
    menuButton.setAttribute(
      "aria-label",
      nextExpanded ? "Close menu" : "Open menu",
    );
    menuButton.classList.toggle("is-open", nextExpanded);
    primaryNav.classList.toggle("is-open", nextExpanded);
    pageBody.classList.toggle("menu-open", nextExpanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

const serviceMenuToggle = document.querySelector("[data-menu-toggle]");
const serviceMobileNav = document.querySelector("[data-mobile-nav]");

if (serviceMenuToggle && serviceMobileNav) {
  const closeServiceMenu = () => {
    serviceMenuToggle.setAttribute("aria-expanded", "false");
    serviceMenuToggle.setAttribute("aria-label", "Open menu");
    serviceMenuToggle.classList.remove("is-open");
    serviceMobileNav.classList.remove("is-open");
    pageBody.classList.remove("menu-open");
  };

  serviceMenuToggle.addEventListener("click", () => {
    const isExpanded =
      serviceMenuToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !isExpanded;

    serviceMenuToggle.setAttribute("aria-expanded", String(nextExpanded));
    serviceMenuToggle.setAttribute(
      "aria-label",
      nextExpanded ? "Close menu" : "Open menu",
    );
    serviceMenuToggle.classList.toggle("is-open", nextExpanded);
    serviceMobileNav.classList.toggle("is-open", nextExpanded);
    pageBody.classList.toggle("menu-open", nextExpanded);
  });

  serviceMobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeServiceMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      closeServiceMenu();
    }
  });
}

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const formAction = contactForm.getAttribute("action");
    const honey = (formData.get("_honey") || "").toString().trim();

    if (honey) {
      contactStatus.textContent = "Submission blocked.";
      return;
    }

    contactStatus.textContent = "Sending your inquiry...";

    try {
      const response = await fetch(formAction, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      contactStatus.textContent =
        "Thanks. Your inquiry was sent. We will get back to you shortly.";
      contactForm.reset();

      if (window.plausible) {
        window.plausible("lead_form_submit");
      }
    } catch (error) {
      contactStatus.textContent =
        "Could not send right now. Please email hello@eastbrite.com.";
    }
  });
}
