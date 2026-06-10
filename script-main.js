// Product data
const products = [
    {
        id: 1,
        name: 'Burger',
        image: 'images/bugger.png',
        price: 12000,
        description: 'Delicious grilled burger with fresh vegetables'
    },
    {
        id: 2,
        name: 'Burger 2',
        image: 'images/bugger2.png',
        price: 14000,
        description: 'Premium double patty burger with special sauce'
    },
    {
        id: 3,
        name: 'Cake',
        image: 'images/cake.png',
        price: 8000,
        description: 'Fresh and moist chocolate cake'
    },
    {
        id: 4,
        name: 'Chips',
        image: 'images/chips.png',
        price: 5000,
        description: 'Crispy golden fried chips'
    },
    {
        id: 5,
        name: 'Pilau',
        image: 'images/pilau.jpg',
        price: 10000,
        description: 'Traditional Tanzanian spiced rice pilau'
    },
    {
        id: 6,
        name: 'Pizza',
        image: 'images/piza.png',
        price: 16000,
        description: 'Cheesy pizza with mixed toppings'
    },
    {
        id: 7,
        name: 'Soda',
        image: 'images/soda.png',
        price: 3000,
        description: 'Cold refreshing soda drink'
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
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
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add</button>
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
    showNotification(`${product.name} added to cart!`);
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
        background-color: #FF6B35;
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
    updateCartDisplay();
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = 'TZS 0';
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
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
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
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    
    const message = `Order Summary:\n\n${itemsList}\n\nTotal: TZS ${total.toLocaleString()}\n\nThank you for your order!\nYour food will be delivered to Mbeya within 30 minutes.`;
    
    alert(message);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
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
