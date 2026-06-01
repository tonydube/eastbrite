const pageBody = document.body;

const initializeMenu = ({ toggle, nav, desktopBreakpoint }) => {
  if (!toggle || !nav) return;

  const menuLinks = Array.from(nav.querySelectorAll("a"));

  const closeMenu = ({ restoreFocus = false } = {}) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.classList.remove("is-open");
    nav.classList.remove("is-open");
    pageBody.classList.remove("menu-open");

    if (restoreFocus) {
      toggle.focus();
    }
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    toggle.classList.add("is-open");
    nav.classList.add("is-open");
    pageBody.classList.add("menu-open");
    menuLinks[0]?.focus();
  };

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMenu({ restoreFocus: true });
      return;
    }

    openMenu();
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu({ restoreFocus: true });
    }
  });

  nav.addEventListener("click", (event) => {
    if (event.target === nav) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > desktopBreakpoint) {
      closeMenu();
    }
  });
};

initializeMenu({
  toggle: document.querySelector(".menu-btn"),
  nav: document.getElementById("primary-nav"),
  desktopBreakpoint: 768,
});

initializeMenu({
  toggle: document.querySelector("[data-menu-toggle]"),
  nav: document.querySelector("[data-mobile-nav]"),
  desktopBreakpoint: 720,
});

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const minimumSubmissionDelayMs = 1500;

const trackEvent = (eventName, props = undefined) => {
  if (!window.plausible) return;
  if (props) {
    window.plausible(eventName, { props });
    return;
  }
  window.plausible(eventName);
};

const bindTrackedClicks = (selector, eventName, getProps = null) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("click", () => {
      const props = getProps ? getProps(element) : undefined;
      trackEvent(eventName, props);
    });
  });
};

bindTrackedClicks("#pricing .primary-cta", "pricing_cta_click", (el) => {
  const card = el.closest(".pricing-card");
  const planName =
    card?.querySelector("h3")?.textContent?.trim() || "unknown_plan";
  return { plan: planName };
});

bindTrackedClicks(".founder-cta", "founder_cta_click");
bindTrackedClicks(
  "#team .primary-cta, .talk-btn[href='#contact']",
  "contact_cta_click",
);
bindTrackedClicks(".footer-social-link", "social_link_click", (el) => ({
  network: el.getAttribute("aria-label") || "unknown",
}));

const monthlyServiceSelect = document.querySelector(
  "#contact-form select[name='service']",
);

if (monthlyServiceSelect) {
  monthlyServiceSelect.addEventListener("change", () => {
    const service = monthlyServiceSelect.value || "none";
    trackEvent("service_selected", { service });
  });
}

if (contactForm && contactStatus) {
  const startedAtField = contactForm.querySelector("[data-form-started-at]");

  const resetStartedAt = () => {
    if (startedAtField) {
      startedAtField.value = String(Date.now());
    }
  };

  resetStartedAt();

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const formAction = contactForm.getAttribute("action");
    const honey = (formData.get("_honey") || "").toString().trim();
    const startedAt = Number(formData.get("form_started_at") || 0);

    if (honey) {
      contactStatus.textContent = "Submission blocked.";
      trackEvent("lead_form_blocked");
      return;
    }

    if (!startedAt || Date.now() - startedAt < minimumSubmissionDelayMs) {
      contactStatus.textContent = "Please take a moment, then submit again.";
      trackEvent("lead_form_blocked", { reason: "submitted_too_quickly" });
      return;
    }

    contactStatus.textContent = "Sending your inquiry...";
    trackEvent("lead_form_attempt");

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
      resetStartedAt();

      if (window.plausible) {
        window.plausible("lead_form_submit");
      }
    } catch (error) {
      contactStatus.textContent =
        "Could not send right now. Please email hello@eastbrite.com.";
      trackEvent("lead_form_failed");
      resetStartedAt();
    }
  });
}

// Auto-select service dropdown from URL param (e.g., ?service=Website+Management)
const preselectService = () => {
  const select = document.querySelector("#contact-form select[name='service']");
  if (!select) return;
  const param = new URLSearchParams(window.location.search).get("service");
  if (!param) return;
  const paramLower = param.toLowerCase();
  Array.from(select.options).forEach((option) => {
    if (option.textContent.toLowerCase().includes(paramLower)) {
      select.value = option.textContent.trim();
    }
  });
};
preselectService();

// Preselect service dropdown when clicking pricing CTAs on the same page
document.querySelectorAll(".primary-cta[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const select = document.querySelector(
      "#contact-form select[name='service']",
    );
    if (!select) return;
    const serviceName = (link.getAttribute("data-service") || "").toLowerCase();
    Array.from(select.options).forEach((option) => {
      if (option.textContent.toLowerCase().includes(serviceName)) {
        select.value = option.textContent.trim();
      }
    });
  });
});
