// Accessibility module - handles keyboard navigation and screen reader support
(function() {
    'use strict';
    
    window.initAccessibility = function() {
    let lastKey = new Date();
    let lastClick = new Date();

    // Add skip link to page
    function addSkipLink() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link da11y-screen-reader-text';
            skipLink.textContent = 'Skip to content';
            
            mainContent.setAttribute('tabindex', '-1');
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
    }

    // Only apply focus styles for keyboard usage
    function setupKeyboardFocusStyles() {
        document.addEventListener('focusin', function(e) {
            const keyboardOutline = document.querySelectorAll('.keyboard-outline');
            keyboardOutline.forEach(el => el.classList.remove('keyboard-outline'));

            const wasByKeyboard = lastClick < lastKey;
            if (wasByKeyboard && e.target) {
                e.target.classList.add('keyboard-outline');
            }
        });

        document.addEventListener('mousedown', function() {
            lastClick = new Date();
        });

        document.addEventListener('keydown', function() {
            lastKey = new Date();
        });
    }

    // Setup ARIA attributes for interactive elements
    function setupAriaAttributes() {
        // Search fields
        const searchFields = document.querySelectorAll('.et-search-field');
        searchFields.forEach((field, index) => {
            const id = `et_pb_search_module_input_${index}`;
            field.id = id;
            
            // Add label
            const label = document.createElement('label');
            label.className = 'da11y-screen-reader-text';
            label.setAttribute('for', id);
            label.textContent = 'Search for...';
            field.parentNode.insertBefore(label, field);
            
            // Add submit button
            const button = document.createElement('button');
            button.type = 'submit';
            button.className = 'da11y-screen-reader-text';
            button.textContent = 'Search';
            field.parentNode.insertBefore(button, field.nextSibling);
        });

        // Toggle modules
        const toggles = document.querySelectorAll('.et_pb_toggle');
        toggles.forEach(toggle => {
            toggle.setAttribute('tabindex', '0');
            
            // Prevent spacebar from scrolling
            toggle.addEventListener('keydown', function(e) {
                if (e.which === 32) {
                    e.preventDefault();
                }
            });
        });

        // Tab modules
        const tabControls = document.querySelectorAll('.et_pb_tabs_controls');
        tabControls.forEach(control => {
            control.setAttribute('role', 'tablist');
            
            const items = control.querySelectorAll('li');
            items.forEach(item => {
                item.setAttribute('role', 'presentation');
            });
            
            const links = control.querySelectorAll('a');
            links.forEach((link, index) => {
                link.setAttribute('role', 'tab');
                link.id = `et_pb_tab_control_${index}`;
                
                if (!link.closest('li').classList.contains('et_pb_tab_active')) {
                    link.setAttribute('aria-selected', 'false');
                    link.setAttribute('aria-expanded', 'false');
                    link.setAttribute('tabindex', '-1');
                } else {
                    link.setAttribute('aria-selected', 'true');
                    link.setAttribute('aria-expanded', 'true');
                    link.setAttribute('tabindex', '0');
                }
            });
        });

        const tabPanels = document.querySelectorAll('.et_pb_tab');
        tabPanels.forEach(panel => {
            panel.setAttribute('role', 'tabpanel');
        });
    }

    // Handle toggle expansion with keyboard
    document.addEventListener('keyup', function(e) {
        if (e.which === 13 || e.which === 32) { // Enter or spacebar
            const focusedToggle = document.querySelector('.et_pb_toggle:focus');
            if (focusedToggle) {
                const title = focusedToggle.querySelector('.et_pb_toggle_title');
                if (title) {
                    title.click();
                }
            }
        }
    });

    // Initialize all accessibility features
    addSkipLink();
    setupKeyboardFocusStyles();
    setupAriaAttributes();
    };
})();