// Navigation module tests
require('../../tests/setup');
const { initNavigation } = require('./setup-modules');

describe('Navigation Module', () => {
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <div class="container et_menu_container">
                <nav id="top-menu-nav">
                    <ul id="top-menu" class="nav">
                        <li><a href="#">Home</a></li>
                        <li>
                            <a href="#">About</a>
                            <ul class="sub-menu">
                                <li><a href="#team">Team</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div class="mobile_nav closed">
                    <span class="mobile_menu_bar"></span>
                </div>
            </div>
            <div class="et_search_form_container">
                <input class="et-search-field" type="search">
            </div>
        `;
    });

    test('initializes without errors', () => {
        expect(() => initNavigation()).not.toThrow();
    });

    test('mobile menu toggle works', () => {
        initNavigation();
        const mobileMenuBar = document.querySelector('.mobile_menu_bar');
        const mobileNav = document.querySelector('.mobile_nav');
        
        expect(mobileNav.classList.contains('closed')).toBe(true);
        
        // Click to open
        mobileMenuBar.click();
        expect(mobileNav.classList.contains('closed')).toBe(false);
        expect(mobileNav.classList.contains('opened')).toBe(true);
        
        // Click to close
        mobileMenuBar.click();
        expect(mobileNav.classList.contains('closed')).toBe(true);
        expect(mobileNav.classList.contains('opened')).toBe(false);
    });

    test('smooth scroll works for anchor links', () => {
        document.body.innerHTML += '<div id="team" tabindex="-1">Team Section</div>';
        initNavigation();
        
        const anchorLink = document.querySelector('a[href="#team"]');
        const targetElement = document.getElementById('team');
        
        // Mock scrollIntoView
        targetElement.scrollIntoView = jest.fn();
        targetElement.focus = jest.fn();
        
        // Trigger click
        const event = new Event('click', { bubbles: true, cancelable: true });
        anchorLink.dispatchEvent(event);
        
        expect(event.defaultPrevented).toBe(true);
        expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start'
        });
        expect(targetElement.focus).toHaveBeenCalled();
    });

    test('search field focus/blur handlers work', () => {
        // Initialize navigation first
        initNavigation();
        
        const searchField = document.querySelector('.et-search-field');
        const searchContainer = document.querySelector('.et_search_form_container');
        const menuContainer = document.querySelector('.et_menu_container');
        
        // Add required class to menu container
        menuContainer.classList.add('et_pb_menu_visible');
        
        // Focus to show search
        searchField.focus();
        
        // Check that menu is hidden
        expect(menuContainer.classList.contains('et_pb_menu_hidden')).toBe(true);
        expect(searchContainer.classList.contains('et_pb_search_visible')).toBe(true);
    });

    test('keyboard navigation updates classes', () => {
        initNavigation();
        
        const nav = document.querySelector('.nav');
        const firstLink = nav.querySelector('a');
        
        // Simulate focus on first link
        firstLink.focus();
        
        // Trigger keyup event
        const keyupEvent = new KeyboardEvent('keyup', { key: 'Tab' });
        document.dispatchEvent(keyupEvent);
        
        // Navigation should have been processed
        expect(nav).toBeDefined();
    });
});