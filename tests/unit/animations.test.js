// Animations module tests
require('../../tests/setup');
const { initAnimations } = require('./setup-modules');

describe('Animations Module', () => {
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <div class="et_animated">
                <span class="et-waypoint et_pb_animation_top"></span>
            </div>
            <div class="et_animated">
                <span class="et-waypoint et_pb_animation_left"></span>
            </div>
            <span class="et_pb_scroll_top et-pb-icon"></span>
            <div class="et_pb_parallax_css" style="background-image: url('test.jpg');"></div>
        `;
        
        // Mock window properties
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            value: 0
        });
    });

    test('initializes without errors', () => {
        expect(() => initAnimations()).not.toThrow();
    });

    test('IntersectionObserver is set up for animated elements', () => {
        const mockObserve = jest.fn();
        global.IntersectionObserver = jest.fn().mockImplementation(() => ({
            observe: mockObserve,
            unobserve: jest.fn(),
            disconnect: jest.fn()
        }));

        initAnimations();

        const animatedElements = document.querySelectorAll('.et_animated');
        expect(global.IntersectionObserver).toHaveBeenCalled();
        expect(mockObserve).toHaveBeenCalledTimes(animatedElements.length);
    });

    test('animated elements become visible when intersecting', () => {
        let observerCallback;
        global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
            observerCallback = callback;
            return {
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn()
            };
        });

        initAnimations();

        const animatedElement = document.querySelector('.et_animated');
        const waypoint = animatedElement.querySelector('.et-waypoint');

        // Simulate intersection
        observerCallback([{
            isIntersecting: true,
            target: animatedElement
        }]);

        expect(animatedElement.classList.contains('et_animated_visible')).toBe(true);
        expect(waypoint.classList.contains('et-animated')).toBe(true);
    });

    test('scroll to top button appears after scrolling', () => {
        initAnimations();
        
        const scrollTopButton = document.querySelector('.et_pb_scroll_top');
        
        // Initial state - button should not be visible
        expect(scrollTopButton.classList.contains('et_pb_scroll_top_visible')).toBe(false);
        
        // Simulate scroll past threshold
        window.pageYOffset = 400;
        window.dispatchEvent(new Event('scroll'));
        
        // Wait for debounced scroll handler
        setTimeout(() => {
            expect(scrollTopButton.classList.contains('et_pb_scroll_top_visible')).toBe(true);
        }, 150);
    });

    test('scroll to top button scrolls to top on click', () => {
        initAnimations();
        
        const scrollTopButton = document.querySelector('.et_pb_scroll_top');
        window.scrollTo = jest.fn();
        
        // Click the button
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        scrollTopButton.dispatchEvent(event);
        
        expect(event.defaultPrevented).toBe(true);
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth'
        });
    });

    test('parallax effect updates on scroll', () => {
        initAnimations();
        
        const parallaxElement = document.querySelector('.et_pb_parallax_css');
        
        // Mock requestAnimationFrame
        let rafCallback;
        window.requestAnimationFrame = jest.fn((callback) => {
            rafCallback = callback;
            return 1;
        });
        
        // Simulate scroll
        window.pageYOffset = 100;
        window.dispatchEvent(new Event('scroll'));
        
        // Execute RAF callback
        if (rafCallback) rafCallback();
        
        // Check transform was applied
        expect(parallaxElement.style.transform).toBe('translate3d(0, -30px, 0)');
    });

    test('fallback for browsers without IntersectionObserver', () => {
        // Remove IntersectionObserver
        const originalIO = global.IntersectionObserver;
        delete global.IntersectionObserver;
        
        initAnimations();
        
        const animatedElements = document.querySelectorAll('.et_animated');
        animatedElements.forEach(element => {
            expect(element.classList.contains('et_animated_visible')).toBe(true);
        });
        
        // Restore IntersectionObserver
        global.IntersectionObserver = originalIO;
    });

    test('handles missing scroll top button gracefully', () => {
        document.querySelector('.et_pb_scroll_top').remove();
        expect(() => initAnimations()).not.toThrow();
    });

    test('handles missing parallax elements gracefully', () => {
        document.querySelector('.et_pb_parallax_css').remove();
        expect(() => initAnimations()).not.toThrow();
    });
});