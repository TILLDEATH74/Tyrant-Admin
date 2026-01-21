document.addEventListener('DOMContentLoaded', () => {
    const browserNameElement = document.getElementById('browser-name');
    const osInfoElement = document.getElementById('os-info');

    const userAgent = navigator.userAgent;
    let browser = "Unknown Browser";

    // Simple detection logic prioritized for Android common browsers
    if (userAgent.indexOf("Firefox") > -1) {
        browser = "Mozilla Firefox";
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
        browser = "Samsung Internet";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        browser = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
        browser = "Microsoft Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
        browser = "Microsoft Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
        // Many browsers include "Chrome" in UA, so check this last among specific ones or verify it's not others
        // However, "CriOS" is Chrome on iOS, "Chrome" is usually Chrome on Android/Desktop
        if (userAgent.indexOf("Edg") === -1 && userAgent.indexOf("OPR") === -1 && userAgent.indexOf("SamsungBrowser") === -1) {
            browser = "Google Chrome";
        } else {
            // It was caught by one of the specific checks above, but just in case logic flows here for some reason
            if (userAgent.indexOf("Edg") > -1) browser = "Microsoft Edge";
            if (userAgent.indexOf("OPR") > -1) browser = "Opera";
            if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
        }
    } else if (userAgent.indexOf("Safari") > -1) {
        // Chrome and others also have Safari in UA, but we checked Chrome above.
        browser = "Apple Safari";
    }

    // Check for Android specifically
    const isAndroid = /Android/i.test(userAgent);

    browserNameElement.textContent = browser;

    if (isAndroid) {
        osInfoElement.textContent = "Running on Android OS";
    } else {
        // Optional: show other OS if detected or generic message
        if (/iPhone|iPad|iPod/i.test(userAgent)) {
            osInfoElement.textContent = "Running on iOS";
        } else if (/Windows/i.test(userAgent)) {
            osInfoElement.textContent = "Running on Windows";
        } else {
            osInfoElement.textContent = "OS not identified as Android";
        }
    }

    console.log("User Agent:", userAgent);
});
