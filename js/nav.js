document.addEventListener("DOMContentLoaded", async function () {
  try {
    await loadMainNavbar();

  const results = await Promise.allSettled([
      loadComponent("#header-container", "./components/header.html"),
      loadComponent("#mobile-header-container", "./components/mobile-header.html"),
      loadComponent("#mobile-menu-container", "./components/mobile-menu.html"),
      loadComponent("#search-modal-container", "./components/search-modal.html"),
      loadComponent("#footer-container", "./components/footer.html"),
      loadComponent("#subnav-container", "./components/subnav.html"),
      loadComponent("#brands-sidebar-container", "./components/brands.html"),
      loadComponent("#pricelist-sidebar-container", "./components/price-list.html"),
    ]);

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Componente falló:", result.reason);
      }
    });

    initializeMobileMenu();
    initializeSearchModal();
    addDynamicStyles();
  } catch (error) {
    console.error("Error loading components:", error);
  }
});

async function loadMainNavbar() {
  const response = await fetch("./components/navbar.html");
  if (!response.ok) throw new Error("No se pudo cargar navbar.html");

  const html = await response.text();
  document.body.insertAdjacentHTML("afterbegin", html);
}

async function loadComponent(selector, path) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`No existe el contenedor: ${selector}`);
    return;
  }

  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);

  container.innerHTML = await response.text();
}

function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const closeMenuButton = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");

  if (!mobileMenuButton || !mobileMenu) return;

  function openMobileMenu() {
    mobileMenu.classList.remove("-translate-x-full");
    if (menuOverlay) menuOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    const icon = mobileMenuButton.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.add("-translate-x-full");
    if (menuOverlay) menuOverlay.classList.add("hidden");
    document.body.style.overflow = "";

    const icon = mobileMenuButton.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  }

  mobileMenuButton.addEventListener("click", openMobileMenu);
  if (closeMenuButton) closeMenuButton.addEventListener("click", closeMobileMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMobileMenu);
}

function initializeSearchModal() {
  const searchModal = document.getElementById("search-modal");
  const searchButton = document.getElementById("search-button");
  const mobileSearchButton = document.getElementById("mobile-search-button");
  const closeSearch = document.getElementById("close-search");

  if (!searchModal) return;

  function openSearchModal() {
    searchModal.classList.remove("none");
    searchModal.classList.add("anim");
    document.body.style.overflow = "hidden";
  }

  function closeSearchModal() {
    searchModal.classList.add("none");
    document.body.style.overflow = "";
  }

  if (searchButton) searchButton.addEventListener("click", openSearchModal);
  if (mobileSearchButton) mobileSearchButton.addEventListener("click", openSearchModal);
  if (closeSearch) closeSearch.addEventListener("click", closeSearchModal);

  searchModal.addEventListener("click", function (e) {
    if (e.target === searchModal) closeSearchModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !searchModal.classList.contains("none")) {
      closeSearchModal();
    }
  });
}

function addDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

    .anim {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .none {
      display: none;
    }

    .-translate-x-full {
      transform: translateX(-100%);
    }

    #mobile-menu {
      transition: transform 0.3s ease-in-out;
    }

    #menu-overlay {
      background-color: rgba(0, 0, 0, 0.5);
    }
  `;
  document.head.appendChild(style);
}