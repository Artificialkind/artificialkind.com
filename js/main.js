// Main JavaScript file - replaces jQuery functionality
// Artificialkind.com - Modern vanilla JavaScript implementation

// Initialize preloader immediately when script loads
if (typeof initPreloader !== 'undefined') {
    initPreloader();
}

// Wait for DOM to be ready for other modules
document.addEventListener('DOMContentLoaded', function() {
    // Initialize remaining modules
    initNavigation();
    initAnimations();
    initAccessibility();
});

// Helper functions
function addClass(element, className) {
    if (element && element.classList) {
        element.classList.add(className);
    }
}

function removeClass(element, className) {
    if (element && element.classList) {
        element.classList.remove(className);
    }
}

function hasClass(element, className) {
    return element && element.classList && element.classList.contains(className);
}

function querySelectorAll(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function querySelector(selector) {
    return document.querySelector(selector);
}

// Make utilities globally available if needed
window.akUtils = {
    addClass,
    removeClass,
    hasClass,
    querySelectorAll,
    querySelector
};