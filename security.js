const Security = {
    violations: 0,
    maxViolations: 3,

    init() {
        this.checkEnvironment();
        this.disableContextMenu();
        this.disableKeys();
        this.setupFocusListeners();
        this.preventNavigation();
    },

    checkEnvironment() {
        const ua = navigator.userAgent;
        // Strict Mobile Check (Screen out Desktops)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

        if (!isMobile) {
            this.showError('Desktop devices are not allowed.', 'Please open this link on a Mobile Device (Android/iOS).');
            return;
        }

        // Strict Chrome Detection (exclude common spoofers)
        // Note: Browsers like Edge/Samsung Internet include "Chrome" in UA.
        // We explicitly check for their presence to exclude them.
        const isChrome = /Chrome/.test(ua) &&
            !/EdgA|OPR|SamsungBrowser|MiuiBrowser|UCBrowser/.test(ua);

        const isAndroid = /Android/.test(ua);

        if (isAndroid && !isChrome) {
            // Android: Not in Chrome? Force intent to Chrome App.
            this.showIntentPrompt();
        } else if (!isAndroid && !isChrome && /iPhone|iPad/.test(ua) && !/CriOS/.test(ua)) {
            // iOS: Not in Chrome? (CriOS is Chrome on iOS)
            this.showError('Browser Not Supported', 'Please use Google Chrome on your iPhone.');
        } else if (!isChrome) {
            // Fallback
            this.showError('Browser Not Supported', 'Please use Google Chrome to take this exam.');
        }
    },

    showError(title, message) {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('browser-error').classList.remove('hidden');
        document.querySelector('#browser-error h2').textContent = title;
        document.querySelector('#browser-error p').innerHTML = `<strong>${message}</strong>`;

        const intentBtn = document.getElementById('intent-btn');
        if (intentBtn) intentBtn.classList.add('hidden');
    },

    showIntentPrompt() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('browser-error').classList.remove('hidden');

        const title = document.querySelector('#browser-error h2');
        const text = document.querySelector('#browser-error p');
        const box = document.querySelector('.error-box');

        title.textContent = "Google Chrome Required";
        text.innerHTML = "You are using an unsupported browser.<br>Click below to open this exam specifically in the <strong>Google Chrome App</strong>.";

        // Construct Android Intent URI
        // Syntax: intent://<host><path>#Intent;scheme=<scheme>;package=com.android.chrome;end;
        const urlObj = new URL(window.location.href);
        const scheme = urlObj.protocol.replace(':', '');
        const cleanUrl = urlObj.host + urlObj.pathname + urlObj.search + urlObj.hash;

        const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};package=com.android.chrome;end`;

        let btn = document.getElementById('intent-btn');
        if (!btn) {
            btn = document.createElement('a');
            btn.id = 'intent-btn';
            btn.className = 'primary-btn';
            btn.style.marginTop = '1.5rem';
            btn.style.display = 'inline-block';
            btn.style.textDecoration = 'none';
            btn.textContent = 'Open in Google Chrome App';
            box.appendChild(btn);
        }
        btn.href = intentUrl;
    },

    requestFullScreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.error(err));
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    },

    disableContextMenu() {
        document.addEventListener('contextmenu', event => event.preventDefault());
    },

    disableKeys() {
        document.onkeydown = function (e) {
            if (e.keyCode === 123 || (e.altKey && e.keyCode === 9)) return false;
        };
    },

    setupFocusListeners() {
        window.addEventListener('blur', () => this.handleViolation('Focus lost'));

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleViolation('App Switched (Hidden)');
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && !document.getElementById('exam-screen').classList.contains('hidden')) {
                this.handleFullScreenViolation();
            }
        });
    },

    preventNavigation() {
        history.pushState(null, null, location.href);
        window.onpopstate = function () { history.go(1); };
        window.onbeforeunload = () => "Exam in progress.";
    },

    handleViolation(reason) {
        if (document.getElementById('exam-screen').classList.contains('hidden')) return;

        this.violations++;
        const overlay = document.getElementById('security-overlay');
        const msg = document.getElementById('warning-message');
        msg.textContent = `Warning: ${reason}. Violation ${this.violations}/${this.maxViolations}`;
        overlay.classList.remove('hidden');
    },

    handleFullScreenViolation() {
        this.handleViolation('Exited Full Screen');
    }
};

document.getElementById('start-btn').addEventListener('click', () => {
    // Re-check just in case
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) { alert("Mobile only!"); return; }

    Security.requestFullScreen();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('exam-screen').classList.remove('hidden');
    if (window.Exam) window.Exam.start();
});

document.getElementById('resume-btn').addEventListener('click', () => {
    Security.requestFullScreen();
    document.getElementById('security-overlay').classList.add('hidden');
});

Security.init();
