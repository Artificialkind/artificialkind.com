// Preloader module - handles loading screen
(function() {
    'use strict';
    
    window.initPreloader = function() {
    const preloader = document.getElementById('loftloader-wrapper');
    const closeButton = preloader ? preloader.querySelector('.loader-close-button') : null;
    
    if (!preloader) return;
    
    // Check if animation was already shown in this session
    if (sessionStorage.getItem('preloaderShown') === 'true') {
        // Hide immediately
        preloader.style.display = 'none';
        return;
    }
    
    // Get close time from data attribute
    const closeTime = parseInt(preloader.getAttribute('data-show-close-time')) || 2000;
    
    // Disable CSS animation since JS will control it
    preloader.style.animation = 'none';
    
    // Track when preloader started
    const startTime = Date.now();
    let pageLoaded = false;
    
    // Check if window is already loaded
    if (document.readyState === 'complete') {
        pageLoaded = true;
    }
    
    // Function to hide preloader
    function hidePreloader() {
        if (preloader.classList.contains('loaded')) return; // Already hidden
        
        preloader.classList.add('loaded');
        // Mark that animation has been shown
        sessionStorage.setItem('preloaderShown', 'true');
        // Let CSS transition handle the fade out
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000); // Hide when animations complete at 2s total
    }
    
    // Check if we should hide the preloader
    function checkHidePreloader() {
        const elapsed = Date.now() - startTime;
        // Start exit animations at 1 second to complete by 2 seconds
        if (pageLoaded && elapsed >= 1000) {
            hidePreloader();
        }
    }

    // Mark page as loaded when window.load fires
    if (!pageLoaded) {
        window.addEventListener('load', function() {
            pageLoaded = true;
            checkHidePreloader();
        });
    }

    // Show close button after specified time
    if (closeButton) {
        setTimeout(() => {
            // Only show close button if preloader is still visible
            if (!preloader.classList.contains('loaded')) {
                closeButton.style.display = 'block';
                closeButton.addEventListener('click', hidePreloader);
            }
        }, closeTime);
    }

    // Check if minimum time has elapsed (1s for animations to start)
    setTimeout(() => {
        checkHidePreloader();
    }, 1000);
    
    // If page is already loaded, check immediately
    if (pageLoaded) {
        // Still respect minimum time (1s for animations)
        const elapsed = Date.now() - startTime;
        if (elapsed >= 1000) {
            hidePreloader();
        } else {
            setTimeout(hidePreloader, 1000 - elapsed);
        }
    }
    };
})();