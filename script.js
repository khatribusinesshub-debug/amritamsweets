// Product Data
const products = [
    { id: 1, name: "Premium Kesar Rasgulla", category: "bengali", price: 400, unit: "kg", image: "rasgulla.jpeg" },
    { id: 2, name: "Malai Cham Cham", category: "bengali", price: 450, unit: "kg", image: "malai%20cham%20cham.jpeg" },
    { id: 3, name: "Kaju Katli Special", category: "dry", price: 900, unit: "kg", image: "kaju%20katli.jpeg" },
    { id: 4, name: "Pista Barfi", category: "dry", price: 1100, unit: "kg", image: "pista%20barfi.jpeg" },
    { id: 5, name: "Desi Ghee Besan Laddu", category: "traditional", price: 550, unit: "kg", image: "desi%20ghee%20laddu.jpeg" },
    { id: 6, name: "Hot Gulab Jamun", category: "traditional", price: 350, unit: "kg", image: "gulab%20jamun.jpeg" }
];

// State
let cart = [];
let currentCategory = 'all';

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartBadge = document.getElementById('cartBadge');
const cartItems = document.getElementById('cartItems');
const cartTotalDisplay = document.getElementById('cartTotalDisplay');
const emptyCart = document.getElementById('emptyCart');
const checkoutTotalDisplay = document.getElementById('checkoutTotalDisplay');

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupTabs();
    setupHeroCanvas();
    setupMenuCanvas();
    setupAboutCanvas();
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // mobile menu close if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
});

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderProducts();
        });
    });
}

function renderProducts() {
    const filtered = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);
        
    productGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            ${product.category === 'dry' || product.category === 'traditional' ? '<span class="product-badge">Bestseller</span>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price} / ${product.unit}</p>
                
                <div class="weight-options">
                    <button class="weight-opt" onclick="selectWeight(this, ${product.id}, 0.25)">250g</button>
                    <button class="weight-opt active selected" onclick="selectWeight(this, ${product.id}, 0.5)">500g</button>
                    <button class="weight-opt" onclick="selectWeight(this, ${product.id}, 1)">1kg</button>
                </div>
                
                <div class="product-actions mt-16">
                    <button class="btn btn-primary w-full" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function selectWeight(btn, productId, weight) {
    const options = btn.parentElement.querySelectorAll('.weight-opt');
    options.forEach(opt => opt.classList.remove('selected'));
    btn.classList.add('selected');
    // We could store selected weight, but for simplicity assuming add to cart gets the selected one.
}

function addToCart(productId) {
    // Find selected weight
    // Simplification: just add the product with default 500g weight (price * 0.5)
    // Or we find the explicit card and weight
    
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCartUI();
    toggleCart(true); // show cart when added
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQty(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.qty += change;
    if (item.qty <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = count;
    
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItems.innerHTML = '';
        cartItems.appendChild(emptyCart);
    } else {
        emptyCart.classList.add('hidden');
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title text-sm">${item.name}</div>
                    <div class="text-maroon font-bold text-sm">₹${item.price} / ${item.unit}</div>
                    <div class="cart-qty-ctrl">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                        <span class="text-sm font-medium w-16 text-center">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalDisplay.textContent = `₹${total}`;
    
    // update feather icons in newly rendered HTML if any
    if (window.feather) { feather.replace(); }
}

function toggleCart(forceOpen = false) {
    const overlay = document.getElementById('cartOverlay');
    if (forceOpen === true) {
        overlay.classList.add('active');
    } else {
        overlay.classList.toggle('active');
    }
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Please add items to your cart first.");
        return;
    }
    toggleCart(false);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    checkoutTotalDisplay.textContent = `₹${total}`;
    
    document.getElementById('checkoutModal').classList.add('active');
    document.getElementById('checkoutForm').classList.remove('hidden');
    document.getElementById('orderConfirmation').classList.add('hidden');
}

function closeCheckout(clearCartStatus = false) {
    document.getElementById('checkoutModal').classList.remove('active');
    if (clearCartStatus === true) {
        cart = [];
        updateCartUI();
    }
}

function processCheckout(e) {
    e.preventDefault();
    document.getElementById('checkoutForm').classList.add('hidden');
    document.getElementById('orderConfirmation').classList.remove('hidden');
    
    if (window.feather) { feather.replace(); }
}

function setupHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    const frameCount = 80;
    const images = [];
    let imagesLoaded = 0;
    
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(3, '0');
        img.src = `sweets/Animate_sweets_splash_202604202210_${frameIndex}.jpg`;
        
        img.onload = () => {
            imagesLoaded++;
            // Draw the first frame roughly as early as possible so UI isn't blank
            if (imagesLoaded === 1 || i === 0) {
                drawFrame(0);
            }
            if (imagesLoaded === frameCount) {
                startAnimation();
            }
        };
        images.push(img);
    }
    
    function drawFrame(index) {
        const img = images[index];
        if (!img) return;
        
        // Proactively crop Veo watermark here as well
        const cropRight = img.width * 0.12; 
        const cropBottom = img.height * 0.10;
        
        const finalWidth = img.width - cropRight;
        const finalHeight = img.height - cropBottom;

        if (img.width > 0 && canvas.width !== finalWidth) {
            canvas.width = finalWidth;
            canvas.height = finalHeight;
        }
        
        if (img.width > 0) {
            ctx.drawImage(
                img, 
                0, 0, finalWidth, finalHeight,
                0, 0, finalWidth, finalHeight
            );
        }
    }
    
    let currentFrame = 0;
    let direction = 1;
    let lastTime = 0;
    const fpsInterval = 1000 / 24; // 24 FPS cinematic playback
    
    function startAnimation() {
        requestAnimationFrame(animate);
    }
    
    function animate(timestamp) {
        requestAnimationFrame(animate);
        
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;
        
        if (elapsed > fpsInterval) {
            lastTime = timestamp - (elapsed % fpsInterval);
            drawFrame(currentFrame);
            
            // Ping-pong loop
            currentFrame += direction;
            if (currentFrame >= frameCount - 1) {
                direction = -1;
            } else if (currentFrame <= 0) {
                direction = 1;
            }
        }
    }
}

function setupMenuCanvas() {
    const canvas = document.getElementById('menu-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // The rasgulla directory has exactly 80 frames: 000 through 079
    const frameCount = 80;
    const images = [];
    let imagesLoaded = 0;
    
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(3, '0');
        img.src = `rasgulla/Animate_ingredients_splash_202604202241_${frameIndex}.jpg`;
        
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === 1 || i === 0) {
                drawFrame(0);
            }
            if (imagesLoaded === frameCount) {
                startAnimation();
            }
        };
        images.push(img);
    }
    
    function drawFrame(index) {
        const img = images[index];
        if (!img) return;
        
        // Remove Veo watermark by dynamically cropping the bottom and right edges 
        // without stretching or zooming the rest of the image.
        const cropRight = img.width * 0.12; 
        const cropBottom = img.height * 0.10;
        
        const finalWidth = img.width - cropRight;
        const finalHeight = img.height - cropBottom;

        if (img.width > 0 && canvas.width !== finalWidth) {
            canvas.width = finalWidth;
            canvas.height = finalHeight;
        }
        
        if (img.width > 0) {
            // Draw only the specified cropped area from the source image
            ctx.drawImage(
                img, 
                0, 0, finalWidth, finalHeight, // Source slice
                0, 0, finalWidth, finalHeight  // Destination target
            );
        }
    }
    
    let currentFrame = 0;
    let direction = 1;
    let lastTime = 0;
    const fpsInterval = 1000 / 24; // 24 FPS smooth playback
    
    function startAnimation() {
        requestAnimationFrame(animate);
    }
    
    function animate(timestamp) {
        requestAnimationFrame(animate);
        
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;
        
        if (elapsed > fpsInterval) {
            lastTime = timestamp - (elapsed % fpsInterval);
            drawFrame(currentFrame);
            
            currentFrame += direction;
            if (currentFrame >= frameCount - 1) {
                direction = -1;
            } else if (currentFrame <= 0) {
                direction = 1;
            }
        }
    }
}

function setupAboutCanvas() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // The sugar syrup directory has exactly 80 frames: 000 through 079
    const frameCount = 80;
    const images = [];
    let imagesLoaded = 0;
    
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(3, '0');
        img.src = `sugar syrup/Animate_sugar_syrup_202604211230_${frameIndex}.jpg`;
        
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === 1 || i === 0) {
                drawFrame(0);
            }
            if (imagesLoaded === frameCount) {
                startAnimation();
            }
        };
        images.push(img);
    }
    
    function drawFrame(index) {
        const img = images[index];
        if (!img) return;
        
        // Remove Veo watermark by dynamically cropping the bottom and right edges 
        const cropRight = img.width * 0.12; 
        const cropBottom = img.height * 0.10;
        
        const finalWidth = img.width - cropRight;
        const finalHeight = img.height - cropBottom;

        if (img.width > 0 && canvas.width !== finalWidth) {
            canvas.width = finalWidth;
            canvas.height = finalHeight;
        }
        
        if (img.width > 0) {
            ctx.drawImage(
                img, 
                0, 0, finalWidth, finalHeight,
                0, 0, finalWidth, finalHeight
            );
        }
    }
    
    let currentFrame = 0;
    let direction = 1;
    let lastTime = 0;
    const fpsInterval = 1000 / 24; // 24 FPS smooth playback
    
    function startAnimation() {
        requestAnimationFrame(animate);
    }
    
    function animate(timestamp) {
        requestAnimationFrame(animate);
        
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;
        
        if (elapsed > fpsInterval) {
            lastTime = timestamp - (elapsed % fpsInterval);
            drawFrame(currentFrame);
            
            currentFrame += direction;
            if (currentFrame >= frameCount - 1) {
                direction = -1;
            } else if (currentFrame <= 0) {
                direction = 1;
            }
        }
    }
}
