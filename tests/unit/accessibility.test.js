// Accessibility module tests
require('../../tests/setup');
const { initAccessibility } = require('./setup-modules');

describe('Accessibility Module', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Reset DOM
        document.body.innerHTML = `
            <div id="main-content">Main Content</div>
            <div class="et-search-field"></div>
            <div class="et_pb_toggle" tabindex="-1">
                <h4 class="et_pb_toggle_title">Toggle Title</h4>
                <div class="et_pb_toggle_content">Toggle Content</div>
            </div>
            <ul class="et_pb_tabs_controls">
                <li class="et_pb_tab_active">
                    <a href="#tab1">Tab 1</a>
                </li>
                <li>
                    <a href="#tab2">Tab 2</a>
                </li>
            </ul>
            <div class="et_pb_tab" id="tab1">Tab 1 Content</div>
            <div class="et_pb_tab" id="tab2">Tab 2 Content</div>
        `;
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes without errors', () => {
        expect(() => initAccessibility()).not.toThrow();
    });

    test('adds skip link to page', () => {
        initAccessibility();
        
        const skipLink = document.querySelector('.skip-link');
        const mainContent = document.getElementById('main-content');
        
        expect(skipLink).toBeTruthy();
        expect(skipLink.href).toContain('#main-content');
        expect(skipLink.textContent).toBe('Skip to content');
        expect(mainContent.getAttribute('tabindex')).toBe('-1');
    });

    test('keyboard focus styles are applied only for keyboard navigation', () => {
        initAccessibility();
        
        const button = document.createElement('button');
        document.body.appendChild(button);
        
        // Simulate mouse click first to establish baseline
        document.dispatchEvent(new MouseEvent('mousedown'));
        
        // Small delay to ensure timestamps differ
        jest.advanceTimersByTime(10);
        
        // Simulate keyboard navigation
        document.dispatchEvent(new KeyboardEvent('keydown'));
        
        // Focus the button
        const focusEvent = new FocusEvent('focusin', {
            bubbles: true,
            target: button
        });
        Object.defineProperty(focusEvent, 'target', {
            value: button,
            enumerable: true
        });
        document.dispatchEvent(focusEvent);
        
        expect(button.classList.contains('keyboard-outline')).toBe(true);
        
        // Simulate mouse click
        document.dispatchEvent(new MouseEvent('mousedown'));
        
        // Focus again
        button.classList.remove('keyboard-outline');
        document.dispatchEvent(focusEvent);
        
        expect(button.classList.contains('keyboard-outline')).toBe(false);
    });

    test('search fields get proper ARIA attributes', () => {
        initAccessibility();
        
        const searchField = document.querySelector('.et-search-field');
        const label = searchField.previousElementSibling;
        const submitButton = searchField.nextElementSibling;
        
        expect(searchField.id).toBe('et_pb_search_module_input_0');
        expect(label.tagName).toBe('LABEL');
        expect(label.getAttribute('for')).toBe('et_pb_search_module_input_0');
        expect(label.textContent).toBe('Search for...');
        expect(submitButton.type).toBe('submit');
        expect(submitButton.textContent).toBe('Search');
    });

    test('toggle modules are keyboard accessible', () => {
        initAccessibility();
        
        const toggle = document.querySelector('.et_pb_toggle');
        
        expect(toggle.getAttribute('tabindex')).toBe('0');
        
        // Test spacebar prevention
        const spaceEvent = new KeyboardEvent('keydown', {
            which: 32,
            keyCode: 32,
            bubbles: true,
            cancelable: true
        });
        
        toggle.dispatchEvent(spaceEvent);
        expect(spaceEvent.defaultPrevented).toBe(true);
    });

    test('toggle expansion with keyboard', () => {
        initAccessibility();
        
        const toggle = document.querySelector('.et_pb_toggle');
        const toggleTitle = toggle.querySelector('.et_pb_toggle_title');
        
        // Mock click
        toggleTitle.click = jest.fn();
        
        // Focus the toggle
        toggle.focus();
        
        // Press Enter
        const enterEvent = new KeyboardEvent('keyup', {
            which: 13,
            keyCode: 13,
            bubbles: true
        });
        document.dispatchEvent(enterEvent);
        
        expect(toggleTitle.click).toHaveBeenCalled();
        
        // Reset mock
        toggleTitle.click.mockClear();
        
        // Press Spacebar
        const spaceEvent = new KeyboardEvent('keyup', {
            which: 32,
            keyCode: 32,
            bubbles: true
        });
        document.dispatchEvent(spaceEvent);
        
        expect(toggleTitle.click).toHaveBeenCalled();
    });

    test('tab modules get proper ARIA roles', () => {
        initAccessibility();
        
        const tabList = document.querySelector('.et_pb_tabs_controls');
        const tabItems = tabList.querySelectorAll('li');
        const tabLinks = tabList.querySelectorAll('a');
        const tabPanels = document.querySelectorAll('.et_pb_tab');
        
        // Check tablist
        expect(tabList.getAttribute('role')).toBe('tablist');
        
        // Check tab items
        tabItems.forEach(item => {
            expect(item.getAttribute('role')).toBe('presentation');
        });
        
        // Check tab links
        tabLinks.forEach((link, index) => {
            expect(link.getAttribute('role')).toBe('tab');
            expect(link.id).toBe(`et_pb_tab_control_${index}`);
            
            if (link.closest('li').classList.contains('et_pb_tab_active')) {
                expect(link.getAttribute('aria-selected')).toBe('true');
                expect(link.getAttribute('aria-expanded')).toBe('true');
                expect(link.getAttribute('tabindex')).toBe('0');
            } else {
                expect(link.getAttribute('aria-selected')).toBe('false');
                expect(link.getAttribute('aria-expanded')).toBe('false');
                expect(link.getAttribute('tabindex')).toBe('-1');
            }
        });
        
        // Check tab panels
        tabPanels.forEach(panel => {
            expect(panel.getAttribute('role')).toBe('tabpanel');
        });
    });

    test('handles missing elements gracefully', () => {
        document.body.innerHTML = '';
        expect(() => initAccessibility()).not.toThrow();
    });
});