// Product data
const products = [
    {
        id: 1,
        name: 'Seti ya Shuka ya Bluu',
        image: 'images/Cotton_Bed_Sheets_Classic_Set_Glacier_Blue_COM_a9e2a10e-1e45-4c29-9898-0cca30e95f50.webp',
        price: 45000,
        description: 'Shuka laini za cotton kwa kitanda cha kisasa'
    },
    {
        id: 2,
        name: 'Bedsheet ya Rangi Nzuri',
        image: 'images/51hqqMdXQiL._AC_UF894,1000_QL80_.jpg',
        price: 38000,
        description: 'Muonekano mzuri unaofaa chumba cha familia'
    },
    {
        id: 3,
        name: 'Shuka ya Premium',
        image: 'images/360_F_635794005_CUTSCvCHi8PcgBufKz8qkPCazp21joc7.jpg',
        price: 55000,
        description: 'Ubora wa juu, laini na hudumu kwa muda mrefu'
    },
    {
        id: 4,
        name: 'Mapazia ya S-Fold',
        image: 'images/Close-up-Of-S-Fold-Curtains-640w.webp',
        price: 65000,
        description: 'Mapazia yanayolingana vizuri na shuka zako'
    },
    {
        id: 5,
        name: 'Bedsheet ya Nyumbani',
        image: 'images/download-66.jpeg',
        price: 32000,
        description: 'Chaguo nafuu na safi kwa matumizi ya kila siku'
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('bedsheetCart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    toggleCheckoutForm(false);
});

// Load products into the grid
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-footer">
                <div class="product-price">TZS ${product.price.toLocaleString()}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Ongeza</button>
            </div>
        </div>
    `;
    return card;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} imeongezwa kwenye kikapu!`);
}

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #2f8f83;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Open cart modal
function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'block';
    toggleCheckoutForm(false);
    updateCartDisplay();
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
    toggleCheckoutForm(false);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Kikapu chako kiko wazi</p>';
        cartTotal.textContent = 'TZS 0';
        toggleCheckoutForm(false);
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">TZS ${item.price.toLocaleString()}</div>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Ondoa</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = `TZS ${total.toLocaleString()}`;
}

// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('bedsheetCart', JSON.stringify(cart));
}

function toggleCheckoutForm(show) {
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutButton = document.querySelector('.checkout-btn');

    if (!checkoutForm || !checkoutButton) return;

    checkoutForm.classList.toggle('active', show);
    checkoutButton.textContent = show ? 'Hariri Kikapu' : 'Kamilisha Oda';
}

// Complete order
function checkout() {
    if (cart.length === 0) {
        alert('Kikapu chako kiko wazi!');
        return;
    }

    const checkoutForm = document.getElementById('checkoutForm');
    const formIsOpen = checkoutForm && checkoutForm.classList.contains('active');
    toggleCheckoutForm(!formIsOpen);
}

function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Kikapu chako kiko wazi!');
        toggleCheckoutForm(false);
        return;
    }

    const form = event.currentTarget;
    const customerName = form.customerName.value.trim();
    const customerEmail = form.customerEmail.value.trim();
    const customerContact = form.customerContact.value.trim();
    const customerLocation = form.customerLocation.value.trim();
    const deliveryPayment = form.deliveryPayment.value;

    if (!customerName || !customerEmail || !customerContact || !customerLocation || !deliveryPayment) {
        alert('Tafadhali jaza taarifa zote za oda.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    
    const message = `Muhtasari wa oda:\n\n${itemsList}\n\nJumla: TZS ${total.toLocaleString()}\n\nMteja: ${customerName}\nBarua pepe: ${customerEmail}\nMawasiliano: ${customerContact}\nMahali: ${customerLocation}\nMalipo ya ufikishaji: ${deliveryPayment}\n\nAsante kwa oda yako!\nTutawasiliana nawe kuthibitisha malipo na muda wa kufikisha bidhaa.`;
    
    alert(message);
    
    // Clear cart after checkout
    cart = [];
    form.reset();
    saveCart();
    updateCartCount();
    updateCartDisplay();
    toggleCheckoutForm(false);
    closeCart();
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
