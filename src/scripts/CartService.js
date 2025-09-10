// src/scripts/CartService.js

const CART_KEY = 'tranex-cart';

class CartService {
  constructor() {
    this.items = this._loadCart();
    this._listeners = []; // To notify other parts of the app (like the header icon)
  }

  // --- Private Methods ---
  _loadCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }

  _saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    this._notifyListeners();
  }

  _notifyListeners() {
    const totalItems = this.getTotalItemCount();
    this._listeners.forEach(callback => callback(totalItems));
  }

  // --- Public API ---

  /**
   * Adds an item to the cart. If it already exists, increases the quantity.
   * @param {object} product - The product object to add.
   * @param {number} quantity - The number of items to add.
   */
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.main || product.image,
        quantity: quantity
      });
    }
    this._saveCart();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this._saveCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this._saveCart();
    } else if (item && quantity <= 0) {
      this.removeItem(productId);
    }
  }

  getCartItems() {
    return this.items;
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clearCart() {
    this.items = [];
    this._saveCart();
  }

  /**
   * Allows other parts of the app to listen for cart changes.
   * @param {function} callback - Function to run when the cart updates.
   */
  subscribe(callback) {
    this._listeners.push(callback);
  }
}

// Export a single instance so the whole app shares the same cart
export const cartService = new CartService();