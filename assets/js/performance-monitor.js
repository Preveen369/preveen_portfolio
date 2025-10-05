// Performance Monitoring Script
// Add this to the bottom of script.js or create a separate performance.js file

// Performance monitoring and optimization utilities
const PerformanceMonitor = {
    // Track Core Web Vitals
    trackWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    },

    // Monitor resource loading times
    trackResourceLoading() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(resource => resource.duration > 1000);
            
            if (slowResources.length > 0) {
                console.warn('Slow loading resources:', slowResources);
            }
            
            // Log page load time
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    },

    // Lazy loading intersection observer with performance tracking
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const loadStartTime = performance.now();
                        
                        img.addEventListener('load', () => {
                            const loadTime = performance.now() - loadStartTime;
                            console.log(`Image ${img.src} loaded in ${loadTime.toFixed(2)}ms`);
                        });
                        
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    },

    // Check if critical resources are properly preloaded
    checkPreloadedResources() {
        const preloadedResources = document.querySelectorAll('link[rel="preload"]');
        preloadedResources.forEach(link => {
            const href = link.href;
            const resource = performance.getEntriesByName(href)[0];
            if (resource) {
                console.log(`Preloaded resource ${href} took ${resource.duration.toFixed(2)}ms`);
            }
        });
    }
};

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    // Only enable in development or when needed
    if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        PerformanceMonitor.trackWebVitals();
        PerformanceMonitor.trackResourceLoading();
        PerformanceMonitor.initLazyLoading();
        
        // Check preloaded resources after a delay
        setTimeout(() => {
            PerformanceMonitor.checkPreloadedResources();
        }, 2000);
    }
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}