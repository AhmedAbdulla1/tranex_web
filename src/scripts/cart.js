/**
 * Cart functionality for TRANEX website
 * Handles cart display, updates, and checkout process
 */
import { cartService } from './CartService.js';

class CartPage {
    constructor() {
        this.cart = cartService;
        this.initializeElements();
        this.bindEvents();
        this.renderCart();
    }

    initializeElements() {
        this.cartItemsContainer = document.getElementById('cart-body');
        this.emptyCartMessage = document.getElementById('empty-cart');
        this.cartSubtotal = document.getElementById('cart-subtotal');
        this.shippingCost = document.getElementById('shipping-cost');
        this.cartTotal = document.getElementById('cart-total');
        this.checkoutBtn = document.querySelector('.checkout-button');
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
                const newQuantity = currentQuantity + change;

                this.cart.updateQuantity(itemId, newQuantity); // This now calls the service method
                this.renderCart();
            } else if (button.classList.contains('remove-item')) {
                this.cart.removeItem(itemId); // This now calls the service method
                this.renderCart();
            }
        });
    }

    renderCart() {
        const cartItems = this.cart.getCartItems();
        if (cartItems.length === 0) {
            this.cartItemsContainer.parentElement.style.display = 'none';
            this.emptyCartMessage.style.display = 'flex';
            return;
        }

        this.cartItemsContainer.parentElement.style.display = 'grid';
        this.emptyCartMessage.style.display = 'none';

        // Render cart items
        this.cartItemsContainer.innerHTML = cartItems.map(item => `
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
        const subtotal = this.cart.getTotalPrice()
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
            this.cart.clearCart();

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