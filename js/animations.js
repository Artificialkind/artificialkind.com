// Animations module - handles scroll animations and effects
(function() {
    'use strict';
    
    window.initAnimations = function() {
    // Process Divi animation data if available
    if (typeof et_animation_data !== 'undefined' && et_animation_data.length > 0) {
        processAnimationData();
    }
    
    // Setup Intersection Observer for animated elements
    const animatedElements = document.querySelectorAll('.et_animated');
    
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('et_animated_visible');
                    // Trigger any waypoint animations
                    const waypoints = entry.target.querySelectorAll('.et-waypoint');
                    waypoints.forEach(waypoint => {
                        waypoint.classList.add('et-animated');
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('et_animated_visible');
        });
    }
    
    // Process et_animation_data for Divi-style animations
    function processAnimationData() {
        et_animation_data.forEach(animation => {
            const elements = document.querySelectorAll('.' + animation.class);
            elements.forEach(element => {
                // Set initial opacity if specified
                if (animation.starting_opacity !== '100%') {
                    element.style.opacity = (parseInt(animation.starting_opacity) / 100).toString();
                }
                
                // Add animation classes and data attributes
                element.classList.add('et_animated');
                element.setAttribute('data-animation-style', animation.style);
                element.setAttribute('data-animation-repeat', animation.repeat);
                element.setAttribute('data-animation-duration', animation.duration);
                element.setAttribute('data-animation-delay', animation.delay);
                element.setAttribute('data-animation-intensity', animation.intensity);
                element.setAttribute('data-animation-starting-opacity', animation.starting_opacity);
                element.setAttribute('data-animation-speed-curve', animation.speed_curve);
                
                // Setup intersection observer for this element
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !entry.target.classList.contains('et_animated_applied')) {
                                applyAnimation(entry.target, animation);
                            }
                        });
                    }, {
                        threshold: 0.1,
                        rootMargin: '0px 0px -10% 0px'
                    });
                    observer.observe(element);
                } else {
                    // Immediate animation for older browsers
                    applyAnimation(element, animation);
                }
            });
        });
    }
    
    // Apply animation to element
    function applyAnimation(element, animationData) {
        // Mark as animated
        element.classList.add('et_animated_applied');
        
        // Apply animation after delay
        setTimeout(() => {
            // Add animation class
            element.classList.add('et_pb_animation_' + animationData.style);
            element.classList.add('et-animated');
            
            // Set animation CSS properties
            element.style.animationDuration = animationData.duration;
            element.style.animationTimingFunction = animationData.speed_curve;
            element.style.animationFillMode = 'both';
            
            // Set opacity to 1 for reveal
            if (animationData.starting_opacity !== '100%') {
                element.style.opacity = '1';
            }
        }, parseInt(animationData.delay));
    }
    
    // Also ensure all animated elements become visible after page load
    // This is a safety net for CSS that hides content by default
    window.addEventListener('load', function() {
        const hiddenElements = document.querySelectorAll('.et_animated:not(.et_animated_visible)');
        hiddenElements.forEach(element => {
            element.style.opacity = '1';
            element.classList.add('et_animated_visible');
        });
    });

    // Scroll to top button functionality
    const scrollTopButton = document.querySelector('.et_pb_scroll_top');
    
    if (scrollTopButton) {
        // Show/hide scroll to top button
        let scrollTimer;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    scrollTopButton.classList.add('et_pb_scroll_top_visible');
                } else {
                    scrollTopButton.classList.remove('et_pb_scroll_top_visible');
                }
            }, 100);
        });

        // Scroll to top on click
        scrollTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Parallax effects for background images (simplified)
    const parallaxElements = document.querySelectorAll('.et_pb_parallax_css');
    
    if (parallaxElements.length > 0) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = 0.3; // Parallax speed
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    };
})();