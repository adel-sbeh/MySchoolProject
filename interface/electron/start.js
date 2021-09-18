/*

    Manage the Electron version of this codebase

*/

// Get all the required modules
const {

    app,
    BrowserWindow,
    nativeTheme,
    session,
    ipcMain

} = require('electron'),
    path = require('path'),
    sharedVariables = {
        lastRedirectURL: path.join(__dirname, "..", "page", "home/").replace(/\\/g, "/")
    };


// Do all the things Apache does
function imitateApache(window) {

    // Get the required modules
    const fs = require("fs");


    // Define the page root paths
    const pageRootPath = path.join(__dirname, "..", "page/").replace(/\\/g, "/"),
        layoutPath = path.join(__dirname, "..", "layout.html").replace(/\\/g, "/"),
        pagesRootPath = path.join(__dirname, "..", "pages/").replace(/\\/g, "/");

    // Keep watching the files handler
    session.defaultSession.webRequest.onBeforeRequest({ urls: [] }, (details, callback) => {

        //console.log(details.url);

        var redirect = false;

        // Set the default directory index file to "index.html"
        if (details.url.indexOf("file:") == 0 && details.url[details.url.length - 1] === "/") {

            details.url += "index.html";

            redirect = true;

        }

        // Redirect the files in "/page/*" to "/pages/*"
        if (details.url.indexOf(pageRootPath) != -1) {

            details.url = layoutPath;

            redirect = true;

        }

        // Call the `callabck` function
        callback((redirect) ? {
            redirectURL: details.url
        } : {});

    });

    // Keep track of the redirected URLs
    session.defaultSession.webRequest.onBeforeRedirect({ urls: [] }, (details) => {

        // Update the `lastRedirectURL` shared variable
        sharedVariables.lastRedirectURL = details.url;

    });

}

// Create a window
function createWindow() {

    // Create a `BrowserWindow` object
    const window = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        //titleBarStyle: 'customButtonsOnHover',
        frame: false,
        show: false,
        minWidth: 860,
        minHeight: 500,
        width: 900,
        height: 600,
        backgroundColor: (nativeTheme.shouldUseDarkColors) ? '#252525' : '#e8e8e8',
        titleBarStyle: 'hidden'
    });

    // Load the home page
    window.loadFile(path.join(__dirname, '..', 'layout.html'));

    window.webContents.on('did-finish-load', function() {

        // Maximise the window
        window.maximize();

        // Show the window
        window.show();

    });

};

// Wait for the app to load
app.whenReady().then(() => {

    // Set up the apache imitation
    imitateApache();

    // Create a window
    createWindow();

    // Re-create a window in the app on macOS
    app.on('activate', function() {

        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();

    });

});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function() {

    if (process.platform !== 'darwin')
        app.quit();

});

// Manage the shared variables
ipcMain.on('variable-request', function(event, arg) {

    // Send the shared variable value
    event.sender.send('variable-reply', sharedVariables[arg]);

});