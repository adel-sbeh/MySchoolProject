/*

    Initiate the service worker

*/

// Set up the service worker
function setupServiceWorker() {

    // Register the service worker
    navigator.serviceWorker.register('./worker.js').then(function(registration) {

        // Send the codebase version
        var intervalLoop = setInterval(function() {

            // Wait for the service worker controller to get defined!
            if (navigator.serviceWorker.controller != null) {

                // Send the codebase version
                navigator.serviceWorker.controller.postMessage({

                    type: 'set-version',
                    value: window.platform.codebase.version

                });

                // Stop this loop
                clearInterval(intervalLoop);
            }

        }, window.platform.special.intervalRefreshRate);

    }, function(err) {

        // Registration failed
        console.log('ServiceWorker registration failed: ', err);

    });

}

// Check if the browser supports service workers, and if this is not an app.
if ('serviceWorker' in navigator) {

    // Wait for the page to finish loading
    window.addEventListener('load', function() {

        if (!window.platform.isApp) {

            // Setup the service worker
            setupServiceWorker();

        }

    });

}