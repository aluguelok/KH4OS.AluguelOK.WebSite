class MercadoLivreBanner extends HTMLElement {
    constructor() {
        super();
        this.products = [];
        this.currentIndex = 0;
        this.intervalId = null;
    }

    async connectedCallback() {
        this.renderInitialStructure();
        
        try {
            // Fetch data (using absolute path for stability across subfolders)
            const response = await fetch('/parceiros/mercadolivre/js/data/mercadolivre.json');
            this.products = await response.json();
            
            if (this.products && this.products.length > 0) {
                // Start with the first product
                this.currentIndex = 0;
                this.updateContent(this.products[this.currentIndex]);
                
                // Start slider interval
                this.intervalId = setInterval(() => this.nextProduct(), 10000);
            }
        } catch (error) {
            console.error('Failed to load Mercado Livre banner data:', error);
        }
    }

    disconnectedCallback() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    renderInitialStructure() {
        this.innerHTML = `
            <div style="background-color: #ffe600; height: 100px;" class="relative w-full max-w-5xl mx-auto rounded-xl flex flex-row items-center my-8 shadow-md overflow-hidden group">
                <!-- Left side (Logo) -->
                <div style="width: 25%;" class="h-full flex items-center justify-start pl-4 md:pl-8 shrink-0">
                    <img src="/parceiros/mercadolivre/img/logo.png" alt="Mercado Livre" style="height: 45px;" class="w-auto object-contain" />
                </div>

                <!-- Center side (Phrase) -->
                <div style="width: 50%;" class="flex items-center justify-center h-full px-2 overflow-hidden">
                    <h2 style="color: #2d3277;" class="text-sm md:text-xl lg:text-2xl font-black leading-none tracking-tighter uppercase ml-phrase transition-opacity duration-500 opacity-0 text-center">
                        <!-- Phrase goes here -->
                    </h2>
                </div>

                <!-- Right side (Product Image) -->
                <div style="width: 25%;" class="h-full flex items-center justify-end shrink-0 transition-opacity duration-500 opacity-0 ml-card">
                    <img src="" alt="Produto" style="width: 140px;" class="h-full object-cover object-center ml-image" />
                </div>
                
                <!-- Overlay link that covers the entire banner -->
                <a href="#" target="_blank" rel="noopener noreferrer" class="absolute inset-0 z-10 ml-link" aria-label="Acessar oferta no Mercado Livre"></a>
            </div>
        `;
    }

    nextProduct() {
        if (!this.products || this.products.length <= 1) return;
        
        // Loop sequentially
        this.currentIndex = (this.currentIndex + 1) % this.products.length;
        this.updateContent(this.products[this.currentIndex]);
    }

    updateContent(product) {
        const phraseEl = this.querySelector('.ml-phrase');
        const cardEl = this.querySelector('.ml-card');
        const imageEl = this.querySelector('.ml-image');
        const linkEl = this.querySelector('.ml-link');

        if (!phraseEl || !cardEl || !imageEl || !linkEl) return;

        // Fade out
        phraseEl.classList.add('opacity-0');
        cardEl.classList.add('opacity-0');

        setTimeout(() => {
            // Format phrase (no manual breaks needed)
            phraseEl.innerHTML = product.phrase;
            
            imageEl.src = product.image;
            linkEl.href = product.link;

            // Fade in
            phraseEl.classList.remove('opacity-0');
            cardEl.classList.remove('opacity-0');
        }, 500); // Wait for fade out transition (duration-500)
    }
}

// Register the web component
customElements.define('mercadolivre-banner', MercadoLivreBanner);
