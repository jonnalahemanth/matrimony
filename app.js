const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 30);
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.innerHTML = isOpen ? "&times;" : "&#9776;";
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.innerHTML = "&#9776;";
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const items = Array.from(document.querySelectorAll(".gitem"));
let current = 0;

function renderLightbox(index) {
  current = (index + items.length) % items.length;
  const source = items[current].dataset.src;
  const image = items[current].querySelector("img");
  lbImg.src = source;
  lbImg.alt = image ? image.alt : "Gallery photo";
}

function openLightbox(index) {
  renderLightbox(index);
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

items.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", (event) => {
  event.stopPropagation();
  renderLightbox(current - 1);
});
lbNext.addEventListener("click", (event) => {
  event.stopPropagation();
  renderLightbox(current + 1);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    renderLightbox(current - 1);
  }

  if (event.key === "ArrowRight") {
    renderLightbox(current + 1);
  }
});

let touchStartX = 0;

lightbox.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.touches[0].clientX;
  },
  { passive: true }
);

lightbox.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(deltaX) > 50) {
    renderLightbox(deltaX < 0 ? current + 1 : current - 1);
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), index * 70);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});
