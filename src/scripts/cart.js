/**
 * Cart functionality for TRANEX website
 * Handles cart display, updates, and checkout process
 */

class CartPage {
    constructor() {
        this.cart = window.cart; // Get cart instance from main.js
        this.initializeElements();
        this.bindEvents();
        this.renderCart();
    }

    initializeElements() {
        this.cartItemsContainer = document.getElementById('cart-items');
        this.emptyCartMessage = document.getElementById('empty-cart');
        this.cartSubtotal = document.getElementById('cart-subtotal');
        this.shippingCost = document.getElementById('shipping-cost');
        this.cartTotal = document.getElementById('cart-total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.checkoutModal = document.getElementById('checkout-modal');
        this.checkoutForm = document.getElementById('checkout-form');
        this.modalCloseBtn = document.querySelector('.modal-close');
    }

    bindEvents() {
        // Checkout button
        this.checkoutBtn.addEventListener('click', () => this.openCheckoutModal());

        // Modal close button
        this.modalCloseBtn.addEventListener('click', () => this.closeCheckoutModal());

        // Close modal when clicking overlay
        this.checkoutModal.querySelector('.modal-overlay').addEventListener('click', () => this.closeCheckoutModal());

        // Handle checkout form submission
        this.checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));

        // Handle quantity changes and item removal
        this.cartItemsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const itemId = button.closest('.cart-item').dataset.id;

            if (button.classList.contains('quantity-btn')) {
                const change = button.dataset.change === 'increase' ? 1 : -1;
                const quantityElement = button.parentElement.querySelector('.quantity');
                const currentQuantity = parseInt(quantityElement.textContent);
                const newQuantity = Math.max(1, currentQuantity + change);

                this.cart.updateQuantity(itemId, newQuantity);
                this.renderCart();
            } else if (button.classList.contains('remove-item')) {
                this.cart.removeItem(itemId);
                this.renderCart();
            }
        });
    }

    renderCart() {
        if (this.cart.items.length === 0) {
            this.cartItemsContainer.parentElement.style.display = 'none';
            this.emptyCartMessage.style.display = 'flex';
            return;
        }

        this.cartItemsContainer.parentElement.style.display = 'grid';
        this.emptyCartMessage.style.display = 'none';

        // Render cart items
        this.cartItemsContainer.innerHTML = this.cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn" data-change="decrease" aria-label="Decrease quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button type="button" class="quantity-btn" data-change="increase" aria-label="Increase quantity">+</button>
                </div>
                <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                <button type="button" class="remove-item" aria-label="Remove item">&times;</button>
            </div>
        `).join('');

        // Update summary
        const subtotal = this.cart.getTotal();
        const shipping = subtotal > 0 ? 10 : 0; // Example shipping cost
        const total = subtotal + shipping;

        this.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        this.shippingCost.textContent = `$${shipping.toFixed(2)}`;
        this.cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    openCheckoutModal() {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('is_authenticated') === 'true';
        if (!isAuthenticated) {
            window.location.href = '/src/pages/auth/login.html?redirect=/src/pages/cart.html';
            return;
        }

        // Pre-fill user data if available
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.email) {
            this.checkoutForm.email.value = userData.email;
        }

        this.checkoutModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeCheckoutModal() {
        this.checkoutModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    async handleCheckout(e) {
        e.preventDefault();

        const formData = new FormData(this.checkoutForm);
        const orderData = {
            items: this.cart.items,
            total: this.cart.getTotal(),
            shipping: 10, // Example shipping cost
            customer: Object.fromEntries(formData.entries())
        };

        try {
            // Simulate order processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Clear cart
            this.cart.items = [];
            this.cart.saveCart();

            // Show success message
            alert('Order placed successfully! Thank you for shopping with us.');

            // Redirect to home
            window.location.href = '/';
        } catch (error) {
            alert('An error occurred while processing your order. Please try again.');
        }
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
});