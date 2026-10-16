"use strict";

const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector("#menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const searchInput = document.querySelector("#search");
const searchForm = document.querySelector("#search-form");
const searchEmpty = document.querySelector("#search-empty");

const navLinks = [...document.querySelectorAll(".nav-link")];

const pageContent = {
  dashboard: {
    title: "Dashboard",
    heading: "Welcome to your dashboard",
    description: "Select a page from the sidebar to preview its content.",
    icon: "ph-squares-four",
  },
  tasks: {
    title: "Tasks",
    heading: "Manage your tasks",
    description: "Organize your work and keep track of progress.",
    icon: "ph-check-square",
  },
  notifications: {
    title: "Notifications",
    heading: "Your notifications",
    description: "Stay informed about updates and activity.",
    icon: "ph-bell",
  },
  reports: {
    title: "Reports",
    heading: "Reports and analytics",
    description: "Review your reports and monitor performance.",
    icon: "ph-chart-bar",
  },
  documents: {
    title: "Documents",
    heading: "Your documents",
    description: "Access and organize your workspace documents.",
    icon: "ph-file-text",
  },
  inbox: {
    title: "Inbox",
    heading: "Your inbox",
    description: "Keep track of messages and important updates.",
    icon: "ph-tray",
  },
  settings: {
    title: "Settings",
    heading: "Workspace settings",
    description: "Manage your workspace preferences.",
    icon: "ph-gear",
  },
};

const pageTitle = document.querySelector("#page-title");
const contentTitle = document.querySelector("#content-title");
const contentDescription = document.querySelector("#content-description");
const cardIcon = document.querySelector(".card-icon");

// ------------------------------
// Theme management
// ------------------------------

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = isDark ? "dark" : "light";

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );

  const themeLabel = themeToggle.querySelector(".theme-label");
  const themeIcon = themeToggle.querySelector("i");

  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  themeIcon.className = isDark ? "ph ph-sun" : "ph ph-moon";

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", isDark ? "#191d27" : "#ffffff");
}

let savedTheme = "light";

try {
  savedTheme = localStorage.getItem("sidebar-theme") || "light";
} catch {
  // Storage may be unavailable in restricted browser environments.
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);

  try {
    localStorage.setItem("sidebar-theme", nextTheme);
  } catch {
    // Theme still works for the current page session.
  }
});

// ------------------------------
// Sidebar toggle for mobile
// ------------------------------

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle("is-open", isOpen);

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Collapse sidebar" : "Expand sidebar",
  );

  menuToggle.querySelector("i").className = isOpen ? "ph ph-x" : "ph ph-list";
}

menuToggle.addEventListener("click", () => {
  setSidebarOpen(!sidebar.classList.contains("is-open"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSidebarOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    window.innerWidth <= 640 &&
    sidebar.classList.contains("is-open") &&
    !sidebar.contains(event.target)
  ) {
    setSidebarOpen(false);
  }
});

// ------------------------------
// Navigation and page preview
// ------------------------------

function showPage(hash) {
  const key = hash.replace(/^#/, "");
  const page = pageContent[key];

  if (!page) return;

  navLinks.forEach((link) => {
    const isActive = link.hash === `#${key}`;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  pageTitle.textContent = page.title;
  contentTitle.textContent = page.heading;
  contentDescription.textContent = page.description;
  cardIcon.className = `ph ${page.icon} card-icon`;

  document.title = `${page.title} | Developer Dashboard`;
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    showPage(link.hash);

    if (window.innerWidth <= 640) {
      setSidebarOpen(false);
    }
  });
});

window.addEventListener("hashchange", () => {
  showPage(window.location.hash || "#dashboard");
});

showPage(window.location.hash || "#dashboard");

// ------------------------------
// Search navigation pages
// ------------------------------

function filterPages() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  navLinks.forEach((link) => {
    const matches = link.textContent.toLowerCase().includes(query);

    link.closest("li").hidden = !matches;

    if (matches) visibleCount++;
  });

  searchEmpty.hidden = query.length === 0 || visibleCount > 0;
}

searchInput.addEventListener("input", filterPages);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstVisibleLink = navLinks.find((link) => !link.closest("li").hidden);

  if (firstVisibleLink && searchInput.value.trim()) {
    firstVisibleLink.click();
  }
});
