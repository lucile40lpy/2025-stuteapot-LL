"use strict";

// Menu function for start-test page
document.addEventListener("DOMContentLoaded", function () {
  createDropdownMenu();
  setupEmailCopy();
});

function createDropdownMenu() {
  // Create dropdown container
  const dropdownContainer = document.createElement("div");
  dropdownContainer.id = "dropdown-container";

  // Create dropdown trigger
  const dropdownTrigger = document.createElement("div");
  dropdownTrigger.id = "dropdown-trigger";

  // Create teapot icon
  const teapotIcon = document.createElement("img");
  teapotIcon.id = "teapot-icon";
  teapotIcon.src = window.staticImages.teapot;
  teapotIcon.alt = "Menu";

  // Create menu label
  const menuLabel = document.createElement("span");
  menuLabel.id = "menu-label";
  menuLabel.textContent = "MENU";

  // Create dropdown menu
  const dropdownMenu = document.createElement("div");
  dropdownMenu.id = "dropdown-menu";
  dropdownMenu.classList.add("hidden");

  // Menu items for start-test page
  const menuItems = [
    {
      text: "Home",
      target: "home",
      action: () => {
        window.location.href = "/";
      },
    },
  ];

  // Create menu items
  menuItems.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");

    const teacupIcon = document.createElement("img");
    teacupIcon.classList.add("teacup-icon");
    teacupIcon.src = window.staticImages.teacup;
    teacupIcon.alt = item.text;

    const itemText = document.createElement("span");
    itemText.textContent = item.text;

    menuItem.appendChild(teacupIcon);
    menuItem.appendChild(itemText);

    menuItem.addEventListener("click", function (e) {
      e.stopPropagation();
      if (item.action) {
        item.action();
      }
      closeMenu();
    });

    dropdownMenu.appendChild(menuItem);
  });

  // Assemble the dropdown
  dropdownTrigger.appendChild(teapotIcon);
  dropdownTrigger.appendChild(menuLabel);
  dropdownContainer.appendChild(dropdownTrigger);
  dropdownContainer.appendChild(dropdownMenu);

  // Add to the body
  document.body.appendChild(dropdownContainer);

  // Toggle menu function
  function toggleMenu() {
    const isHidden = dropdownMenu.classList.contains("hidden");
    isHidden ? openMenu() : closeMenu();
  }

  function openMenu() {
    dropdownMenu.classList.remove("hidden");
    teapotIcon.classList.add("pouring");
  }

  function closeMenu() {
    dropdownMenu.classList.add("hidden");
    teapotIcon.classList.remove("pouring");
  }

  // Event listeners
  dropdownTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside
  document.addEventListener("click", function () {
    closeMenu();
  });

  // Prevent menu from closing when clicking inside it
  dropdownMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// Email copy functionality
function setupEmailCopy() {
  const emailLinks = document.querySelectorAll(
    ".email-link, [data-copy-email]"
  );

  emailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const email =
        this.getAttribute("data-email") ||
        this.textContent.trim() ||
        "adress.name@x.com";

      navigator.clipboard
        .writeText(email)
        .then(() => {
          // Visual feedback
          const originalText = this.textContent;
          const originalClass = this.className;

          this.textContent = "✓ Copied!";
          this.classList.add("copied");

          setTimeout(() => {
            this.textContent = originalText;
            this.className = originalClass;
          }, 2000);
        })
        .catch((err) => {
          console.error("Copy failed:", err);
          fallbackCopyTextToClipboard(email);
        });
    });
  });
}
