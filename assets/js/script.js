'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// Portfolio page specific functionality
if (window.location.pathname.includes('portfolio.html') || window.location.pathname === '/portfolio.html') {
  
  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  if (select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });
  }

  // add event in all select items
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) {
        selectValue.innerText = this.innerText;
      }
      if (select) {
        elementToggleFunc(select);
      }
      filterFunc(selectedValue);
    });
  }

  // filter variables
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {
    for (let i = 0; i < filterItems.length; i++) {
      if (selectedValue === "all") {
        filterItems[i].classList.add("active");
      } else if (selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }
    }
  }

  // add event in all filter button items for large screen
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) {
        selectValue.innerText = this.innerText;
      }
      filterFunc(selectedValue);

      if (lastClickedBtn) {
        lastClickedBtn.classList.remove("active");
      }
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}

// Contact page specific functionality
if (window.location.pathname.includes('contact.html') || window.location.pathname === '/contact.html') {
  
  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");
  const successMessage = document.querySelector(".form-success");
  const errorMessage = document.querySelector(".form-error");

  if (form && formInputs.length > 0 && formBtn) {
    // add event to all form input field
    for (let i = 0; i < formInputs.length; i++) {
      formInputs[i].addEventListener("input", function () {
        // check form validation
        if (form.checkValidity()) {
          formBtn.removeAttribute("disabled");
        } else {
          formBtn.setAttribute("disabled", "");
        }
      });
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          if (successMessage) successMessage.style.display = "block";
          if (errorMessage) errorMessage.style.display = "none";
          form.reset(); // Clear the form
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        if (successMessage) successMessage.style.display = "none";
        if (errorMessage) errorMessage.style.display = "block";
      }
    });
  }
}

// Set active navigation link based on current page
document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll(".navbar-link");
  const currentPage = window.location.pathname;
  
  navLinks.forEach(link => {
    link.classList.remove("active");
    
    // Check if the link's href matches the current page
    const linkHref = link.getAttribute("href");
    
    if (
      (currentPage.includes("index.html") || currentPage === "/" || currentPage.endsWith("/")) && linkHref === "index.html" ||
      currentPage.includes("resume.html") && linkHref === "resume.html" ||
      currentPage.includes("portfolio.html") && linkHref === "portfolio.html" ||
      currentPage.includes("blog.html") && linkHref === "blog.html" ||
      currentPage.includes("contact.html") && linkHref === "contact.html"
    ) {
      link.classList.add("active");
    }
  });
});