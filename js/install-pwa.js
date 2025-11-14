// wwwroot/js/install-pwa.js

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.getElementById('btnInstallPwa');
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', async () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('User choice:', outcome);
            deferredPrompt = null;
        });
    }
});
