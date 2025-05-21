/** @format */

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const filterButtons = document.querySelectorAll(".filter-button");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");

  let currentImageIndex = 0;
  let images = Array.from(document.querySelectorAll(".gallery-item img"));
  let touchStartX = 0;
  let touchEndX = 0;

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filter items with animation
      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.opacity = "0";
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
          }, 100);
        } else {
          item.style.opacity = "0";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // Lightbox functionality
  function openLightbox(imgElement) {
    currentImageIndex = images.indexOf(imgElement);
    updateLightboxImage();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  function updateLightboxImage() {
    const img = images[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    // Update navigation visibility
    lightboxPrev.style.visibility =
      currentImageIndex > 0 ? "visible" : "hidden";
    lightboxNext.style.visibility =
      currentImageIndex < images.length - 1 ? "visible" : "hidden";
  }

  function nextImage() {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      updateLightboxImage();
    }
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateLightboxImage();
    }
  }

  // Click events
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img");
      openLightbox(img);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxNext.addEventListener("click", nextImage);
  lightboxPrev.addEventListener("click", prevImage);

  // Touch events for lightbox
  lightbox.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
  });

  lightbox.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeLength = touchEndX - touchStartX;

    if (Math.abs(swipeLength) > swipeThreshold) {
      if (swipeLength > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    switch (e.key) {
      case "ArrowRight":
        nextImage();
        break;
      case "ArrowLeft":
        prevImage();
        break;
      case "Escape":
        closeLightbox();
        break;
    }
  });

  // Close lightbox when clicking outside the image
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
});
