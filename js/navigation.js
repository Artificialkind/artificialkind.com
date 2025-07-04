// Navigation module - handles menu interactions
(function() {
    'use strict';
    
    window.initNavigation = function() {
    const hoverClasses = 'et-hover et-show-dropdown';
    let currentListItem = null;

    // Update navigation classes
    function updateNavigationClasses(el) {
        const currentLink = el.querySelector('a:focus');
        if (currentLink) {
            currentListItem = currentLink.closest('li');
        }

        // Check if focused on top level nav item
        const allItems = el.querySelectorAll('li');
        if (!currentLink || el === currentListItem.closest('ul')) {
            allItems.forEach(item => {
                item.classList.remove(...hoverClasses.split(' '));
            });
        }

        // Add appropriate hover classes if nav item has children
        if (currentListItem && currentListItem.querySelector('ul')) {
            currentListItem.classList.add(...hoverClasses.split(' '));
        }
    }

    // Setup search functionality
    function setupSearch() {
        const searchField = document.querySelector('.et-search-field');
        const searchContainer = document.querySelector('.et_search_form_container');
        const menuContainer = document.querySelector('.et_menu_container');
        
        if (!searchField || !searchContainer || !menuContainer) return;

        function showSearch() {
            if (searchContainer.classList.contains('et_pb_is_animating')) return;

            menuContainer.classList.remove('et_pb_menu_visible', 'et_pb_no_animation');
            menuContainer.classList.add('et_pb_menu_hidden');
            
            searchContainer.classList.remove('et_pb_search_form_hidden', 'et_pb_no_animation');
            searchContainer.classList.add('et_pb_search_visible', 'et_pb_is_animating');

            setTimeout(() => {
                menuContainer.classList.add('et_pb_no_animation');
                searchContainer.classList.add('et_pb_no_animation');
                searchContainer.classList.remove('et_pb_is_animating');
            }, 1000);

            searchField.focus();
            setSearchFormCSS();
        }

        function hideSearch() {
            if (searchContainer.classList.contains('et_pb_is_animating')) return;

            menuContainer.classList.remove('et_pb_menu_hidden', 'et_pb_no_animation');
            menuContainer.classList.add('et_pb_menu_visible');
            
            searchContainer.classList.remove('et_pb_search_visible', 'et_pb_no_animation');
            searchContainer.classList.add('et_pb_search_form_hidden', 'et_pb_is_animating');

            setTimeout(() => {
                menuContainer.classList.add('et_pb_no_animation');
                searchContainer.classList.add('et_pb_no_animation');
                searchContainer.classList.remove('et_pb_is_animating');
            }, 1000);
        }

        function setSearchFormCSS() {
            if (!searchContainer.classList.contains('et_pb_search_visible')) return;

            const mainHeader = document.getElementById('main-header');
            const topMenu = document.getElementById('top-menu');
            const body = document.body;

            if (mainHeader && topMenu) {
                const headerHeight = mainHeader.offsetHeight;
                const menuWidth = topMenu.offsetWidth;
                const menuLink = topMenu.querySelector('li a');
                const fontSize = menuLink ? window.getComputedStyle(menuLink).fontSize : '16px';

                searchContainer.style.height = headerHeight + 'px';
                const input = searchContainer.querySelector('input');
                if (input) input.style.fontSize = fontSize;

                if (!body.classList.contains('et_header_style_left')) {
                    searchContainer.style.maxWidth = (menuWidth + 60) + 'px';
                } else {
                    const form = searchContainer.querySelector('form');
                    if (form) form.style.maxWidth = (menuWidth + 60) + 'px';
                }
            }
        }

        // Event listeners
        searchField.addEventListener('focus', showSearch);
        searchField.addEventListener('blur', hideSearch);
    }

    // Setup mobile menu
    function setupMobileMenu() {
        const mobileMenuBar = document.querySelector('.mobile_menu_bar');
        const mobileNav = document.querySelector('.mobile_nav');
        const selectPage = document.querySelector('.select_page');
        const mobileNavMenu = document.getElementById('et_mobile_nav_menu');
        const topMenu = document.getElementById('top-menu');
        
        if (mobileMenuBar && mobileNav) {
            // Create mobile menu from desktop menu if it doesn't exist
            if (topMenu && !document.querySelector('.et_mobile_menu')) {
                const mobileMenu = topMenu.cloneNode(true);
                mobileMenu.removeAttribute('id');
                mobileMenu.className = 'et_mobile_menu';
                // Append to mobile_nav instead of et_mobile_nav_menu
                mobileNav.appendChild(mobileMenu);
            }
            
            // Function to toggle mobile menu
            function toggleMobileMenu(e) {
                e.preventDefault();
                e.stopPropagation();
                mobileNav.classList.toggle('closed');
                mobileNav.classList.toggle('opened');
            }
            
            // Add click handler to entire mobile nav container (grey bar)
            mobileNav.addEventListener('click', toggleMobileMenu);
        }
    }

    // Handle keyboard navigation
    document.addEventListener('keyup', function() {
        const nav = document.querySelector('.nav');
        const menu = document.querySelector('.menu');
        
        if (nav) updateNavigationClasses(nav);
        if (menu) updateNavigationClasses(menu);
    });

    // Setup smooth scrolling for anchor links
    function setupSmoothScroll() {
        // First, add specific handler for all links pointing to current page
        const currentPath = window.location.pathname;
        const homeLinks = document.querySelectorAll(`a[href="${currentPath}"], a[href="./index.html"], a[href="/"], a[href=""]`);
        
        homeLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return false;
            }, true);
        });
        
        // Handle hash links
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            // Use capture phase to ensure our handler runs first
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Prevent default and stop propagation immediately
                e.preventDefault();
                e.stopPropagation();
                
                // Special handling for #top or empty hash
                if (href === '#top' || href === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    // Update URL without reload
                    if (window.history && window.history.pushState) {
                        window.history.pushState('', '', window.location.pathname);
                    }
                    document.body.focus();
                    return false;
                }
                
                const targetId = href.slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    targetElement.focus();
                }
                
                return false;
            }, true); // Use capture phase
        });
        
        // Also handle logo click specifically
        const logo = document.querySelector('.logo_container a');
        if (logo) {
            logo.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                if (window.history && window.history.pushState) {
                    window.history.pushState('', '', window.location.pathname);
                }
                return false;
            }, true);
        }
    }

    // Initialize all navigation features
    setupSearch();
    setupMobileMenu();
    setupSmoothScroll();
    };
})();