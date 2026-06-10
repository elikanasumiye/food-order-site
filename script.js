// Product data
const products = [
    {
        id: 1,
        name: 'Burger',
        image: 'images/bugger.png',
        price: 12000,
        description: 'Delicious grilled burger'
    },
    {
        id: 2,
        name: 'Burger 2',
        image: 'images/bugger2.png',
        price: 14000,
        description: 'Premium double patty burger'
    },
    {
        id: 3,
        name: 'Cake',
        image: 'images/cake.png',
        price: 8000,
        description: 'Fresh chocolate cake'
    },
    {
        id: 4,
        name: 'Chips',
        image: 'images/chips.png',
        price: 5000,
        description: 'Crispy fried chips'
    },
    {
        id: 5,
        name: 'Pilau',
        image: 'images/pilau.jpg',
        price: 10000,
        description: 'Traditional spiced rice'
    },
    {
        id: 6,
        name: 'Pizza',
        image: 'images/piza.png',
        price: 16000,
        description: 'Cheesy pizza'
    },
    {
        id: 7,
        name: 'Soda',
        image: 'images/soda.png',
        price: 3000,
        description: 'Cold refreshing drink'
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartOpen = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCart();
});

// Render all products
function renderProducts() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const productHTML = `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-footer">
                        <div class="product-price">TZS ${product.price.toLocaleString()}</div>
                        <button class="add-btn" onclick="addToCart(${product.id})">Add</button>
                    </div>
                </div>
            </div>
        `;
        productsList.innerHTML += productHTML;
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
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
    updateCart();
}

// Toggle cart
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    cartOpen = !cartOpen;
    
    if (cartOpen) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    } else {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Update cart display
function updateCart() {
    updateCartBadge();
    updateCartItems();
    updateTotal();
}

// Update badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    badge.textContent = count;
}

// Update cart items display
function updateCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty">Cart is empty</p>';
        return;
    }
    
    cartItemsDiv.innerHTML = '';
    
    cart.forEach(item => {
        const itemHTML = `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">TZS ${item.price.toLocaleString()}</div>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="decreaseQty(${item.id})">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
                    <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        `;
        cartItemsDiv.innerHTML += itemHTML;
    });
}

// Update total
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total').textContent = total.toLocaleString();
}

// Increase quantity
function increaseQty(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart();
        updateCart();
    }
}

// Decrease quantity
function decreaseQty(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeItem(productId);
            return;
        }
        saveCart();
        updateCart();
    }
}

// Remove item
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

// Save cart
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    
    const message = `📦 ORDER SUMMARY\n\n${items}\n\n💰 Total: TZS ${total.toLocaleString()}\n\n✅ Thank you for your order!\nDelivery to Mbeya within 30 minutes.`;
    
    alert(message);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCart();
    toggleCart();
}
