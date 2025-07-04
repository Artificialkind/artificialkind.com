// Preloader module tests
require('../../tests/setup');
const { initPreloader } = require('./setup-modules');

describe('Preloader Module', () => {
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <div id="loftloader-wrapper" class="pl-imgloading" data-show-close-time="1000">
                <div class="loader-inner">
                    <div id="loader"></div>
                </div>
                <div class="loader-close-button" style="display: none;">
                    <span>Close</span>
                </div>
            </div>
        `;
        
        // Clear all timers
        jest.clearAllTimers();
        jest.useFakeTimers();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Mock document.readyState
        Object.defineProperty(document, 'readyState', {
            writable: true,
            configurable: true,
            value: 'loading'
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes without errors', () => {
        expect(() => initPreloader()).not.toThrow();
    });

    test('preloader exists in DOM', () => {
        const preloader = document.getElementById('loftloader-wrapper');
        expect(preloader).toBeTruthy();
    });

    test('close button appears after specified time', () => {
        initPreloader();
        const closeButton = document.querySelector('.loader-close-button');
        
        expect(closeButton.style.display).toBe('none');
        
        // Fast forward time
        jest.advanceTimersByTime(1000);
        
        expect(closeButton.style.display).toBe('block');
    });

    test('preloader hides on window load event after minimum time', () => {
        initPreloader();
        const preloader = document.getElementById('loftloader-wrapper');
        
        // Trigger window load event immediately
        window.dispatchEvent(new Event('load'));
        
        // Should not hide yet - minimum time not elapsed
        jest.advanceTimersByTime(100);
        expect(preloader.classList.contains('loaded')).toBe(false);
        
        // Fast forward to meet minimum time (1000ms from data attribute)
        jest.advanceTimersByTime(900);
        
        expect(preloader.classList.contains('loaded')).toBe(true);
        
        // Fast forward past the 1000ms transition
        jest.advanceTimersByTime(1000);
        
        expect(preloader.style.display).toBe('none');
    });

    test('close button click hides preloader', () => {
        initPreloader();
        const preloader = document.getElementById('loftloader-wrapper');
        const closeButton = document.querySelector('.loader-close-button');
        
        // Wait for close button to appear
        jest.advanceTimersByTime(1000);
        
        // Click close button
        closeButton.click();
        
        expect(preloader.classList.contains('loaded')).toBe(true);
        
        // Fast forward past the 1000ms transition
        jest.advanceTimersByTime(1000);
        
        expect(preloader.style.display).toBe('none');
    });

    test('preloader hides after minimum time even without load event', () => {
        initPreloader();
        const preloader = document.getElementById('loftloader-wrapper');
        
        // Don't trigger load event, just wait for minimum time
        jest.advanceTimersByTime(1000);
        
        // Should still be visible - load event hasn't fired
        expect(preloader.classList.contains('loaded')).toBe(false);
        
        // Trigger load event after minimum time
        window.dispatchEvent(new Event('load'));
        
        // Should hide immediately since minimum time has passed
        expect(preloader.classList.contains('loaded')).toBe(true);
        
        // Fast forward past the 1000ms transition
        jest.advanceTimersByTime(1000);
        
        expect(preloader.style.display).toBe('none');
    });

    test('handles missing preloader element gracefully', () => {
        document.body.innerHTML = '';
        expect(() => initPreloader()).not.toThrow();
    });

    test('handles missing close button gracefully', () => {
        document.querySelector('.loader-close-button').remove();
        expect(() => initPreloader()).not.toThrow();
    });

    test('uses default close time when data attribute is missing', () => {
        const preloader = document.getElementById('loftloader-wrapper');
        preloader.removeAttribute('data-show-close-time');
        
        initPreloader();
        
        // Should use default 2000ms
        jest.advanceTimersByTime(2000);
        
        const closeButton = document.querySelector('.loader-close-button');
        if (closeButton) {
            expect(closeButton.style.display).toBe('block');
        }
    });

    test('skips animation if already shown in session', () => {
        // Set sessionStorage flag
        sessionStorage.setItem('preloaderShown', 'true');
        
        const preloader = document.getElementById('loftloader-wrapper');
        initPreloader();
        
        // Should hide immediately
        expect(preloader.style.display).toBe('none');
    });

    test('sets sessionStorage flag when animation completes', () => {
        initPreloader();
        
        // Trigger load event and wait for animation
        window.dispatchEvent(new Event('load'));
        jest.advanceTimersByTime(1000);
        
        // Check sessionStorage was set
        expect(sessionStorage.getItem('preloaderShown')).toBe('true');
    });
});