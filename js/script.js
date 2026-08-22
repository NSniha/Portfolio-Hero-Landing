"use strict";

const body = document.body;

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const menuCloseButton = document.querySelector(".mobile-menu-close");
const menuOverlay = document.querySelector(".menu-overlay");

const mobileNavigationLinks = document.querySelectorAll(
    ".mobile-navigation a"
);

const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");

let countersStarted = false;

/* Mobile Navigation */

function openMobileMenu() {
    mobileMenu.classList.add("open");
    menuOverlay.classList.add("open");

    mobileMenu.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");

    body.classList.add("menu-open");
}

function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    menuOverlay.classList.remove("open");

    mobileMenu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");

    body.classList.remove("menu-open");
}

menuButton.addEventListener("click", openMobileMenu);
menuCloseButton.addEventListener("click", closeMobileMenu);
menuOverlay.addEventListener("click", closeMobileMenu);

mobileNavigationLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

/* Reveal Animation */

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -30px",
    }
);

revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 55, 330)}ms`;

    revealObserver.observe(element);
});

/* Counter Animation */

function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const decimals = Number(counter.dataset.decimals || 0);

    const duration = 1700;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const easedProgress =
            1 - Math.pow(1 - progress, 4);

        const currentValue = target * easedProgress;

        counter.textContent = currentValue.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
            return;
        }

        counter.textContent = target.toFixed(decimals);
    }

    requestAnimationFrame(updateCounter);
}

const statsSection = document.querySelector(".stats");

const statsObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || countersStarted) {
                return;
            }

            countersStarted = true;

            counters.forEach((counter) => {
                animateCounter(counter);
            });

            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.45,
    }
);

if (statsSection) {
    statsObserver.observe(statsSection);
}

/* Desktop Active Navigation */

const desktopNavLinks = document.querySelectorAll(
    ".desktop-navigation .nav-link"
);

desktopNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
        desktopNavLinks.forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

/* Close Mobile Menu On Desktop Resize */

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});