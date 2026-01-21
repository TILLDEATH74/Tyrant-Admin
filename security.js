const Security = {
    violations: 0,
    maxViolations: 3,

    init() {
        this.checkBrowser();
        this.disableContextMenu();
        this.disableKeys();
        this.setupFocusListeners();
        this.preventNavigation();
    },

    checkBrowser() {
        // Simple check for Chrome/Chromium based browsers
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (!isChrome) {
            document.getElementById('browser-error').classList.remove('hidden');
            document.getElementById('start-screen').classList.add('hidden');
        }
    },

    requestFullScreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        }
    },

    disableContextMenu() {
        document.addEventListener('contextmenu', event => event.preventDefault());
    },

    disableKeys() {
        document.onkeydown = function (e) {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                (e.ctrlKey && e.keyCode === 85)
            ) {
                return false;
            }
            // Attempt to block Alt+Tab (not fully possible in JS but we can try to suppress defaults)
            if (e.altKey && e.keyCode === 9) {
                return false;
            }
        };
    },

    setupFocusListeners() {
        window.addEventListener('blur', () => this.handleViolation('Focus lost (Window blur)'));
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleViolation('Tab switched (Visibility change)');
            }
        });

        // Fullscreen exit detection
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && document.getElementById('exam-screen').classList.contains('hidden') === false) {
                this.handleFullScreenViolation();
            }
        });
    },

    preventNavigation() {
        // Push current state to prevent back navigation
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
            history.go(1);
        };

        // Warn on reload
        window.onbeforeunload = function () {
            return "Are you sure you want to leave? Your exam progress will be lost.";
        };
    },

    handleViolation(reason) {
        // If we are not in the exam yet, ignore
        if (document.getElementById('exam-screen').classList.contains('hidden')) return;

        this.violations++;
        console.warn(`Security Violation: ${reason}. Count: ${this.violations}`);

        const overlay = document.getElementById('security-overlay');
        const msg = document.getElementById('warning-message');

        msg.textContent = `Warning detected: ${reason}. This is violation ${this.violations}/${this.maxViolations}`;
        overlay.classList.remove('hidden');

        // Optional: Auto-resume or disqualify logic could go here
    },

    handleFullScreenViolation() {
        // If we really want to force it, showing the overlay is good
        this.handleViolation('Exited Full Screen Mode');
        // Try to re-request? (Usually requires user interaction)
    }
};

// Start button hook
document.getElementById('start-btn').addEventListener('click', () => {
    Security.requestFullScreen();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('exam-screen').classList.remove('hidden');
    // Start exam logic...
    if (window.Exam) window.Exam.start();
});

// Resume button hook (for demo purposes, real exams might lock you out)
document.getElementById('resume-btn').addEventListener('click', () => {
    Security.requestFullScreen();
    document.getElementById('security-overlay').classList.add('hidden');
});

Security.init();
