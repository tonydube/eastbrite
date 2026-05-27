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
