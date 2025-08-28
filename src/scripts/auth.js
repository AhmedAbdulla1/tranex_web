/**
 * Authentication functionality for TRANEX website
 * Handles user authentication flows and UI interactions with real-time validation
 */

// Validation patterns
const PATTERNS = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/
};

// Validation messages
const MESSAGES = {
    en: {
        email: {
            invalid: 'Please enter a valid email address',
            required: 'Email is required'
        },
        password: {
            invalid: 'Password must be at least 8 characters and contain letters and numbers',
            required: 'Password is required'
        },
        username: {
            invalid: 'Username must be 3-20 characters and can contain letters, numbers and underscore',
            required: 'Username is required'
        },
        confirmPassword: {
            mismatch: 'Passwords do not match',
            required: 'Please confirm your password'
        }
    },
    ar: {
        email: {
            invalid: 'يرجى إدخال عنوان بريد إلكتروني صالح',
            required: 'البريد الإلكتروني مطلوب'
        },
        password: {
            invalid: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على أحرف وأرقام',
            required: 'كلمة المرور مطلوبة'
        },
        username: {
            invalid: 'يجب أن يتكون اسم المستخدم من 3-20 حرفًا ويمكن أن يحتوي على أحرف وأرقام وشرطة سفلية',
            required: 'اسم المستخدم مطلوب'
        },
        confirmPassword: {
            mismatch: 'كلمات المرور غير متطابقة',
            required: 'يرجى تأكيد كلمة المرور'
        }
    }
};

class FormValidator {
    constructor(form, lang = 'en') {
        this.form = form;
        this.lang = lang;
        this.inputs = {};
        this.init();
    }

    init() {
        // Get all form inputs
        this.form.querySelectorAll('input').forEach(input => {
            this.inputs[input.name] = input;
            this.setupValidation(input);
        });

        // Add form submit handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    setupValidation(input) {
        // Add real-time validation
        input.addEventListener('input', () => this.validateField(input));
        input.addEventListener('blur', () => this.validateField(input));

        // Add validation message element
        const messageEl = document.createElement('div');
        messageEl.className = 'validation-message';
        input.parentNode.appendChild(messageEl);
    }

    validateField(input) {
        const value = input.value.trim();
        const pattern = PATTERNS[input.name];
        const messageEl = input.parentNode.querySelector('.validation-message');
        let isValid = true;
        let message = '';

        // Check if required
        if (input.required && !value) {
            isValid = false;
            message = MESSAGES[this.lang][input.name].required;
        }
        // Check pattern if exists
        else if (pattern && value && !pattern.test(value)) {
            isValid = false;
            message = MESSAGES[this.lang][input.name].invalid;
        }
        // Special check for password confirmation
        else if (input.name === 'confirmPassword') {
            const password = this.inputs.password.value;
            if (value !== password) {
                isValid = false;
                message = MESSAGES[this.lang].confirmPassword.mismatch;
            }
        }

        // Update UI
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            messageEl.textContent = '';
            messageEl.classList.remove('error');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            messageEl.textContent = message;
            messageEl.classList.add('error');
        }

        return isValid;
    }

    validateForm() {
        let isValid = true;
        Object.values(this.inputs).forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Show loading state
                this.form.classList.add('loading');
                
                // Determine auth action based on form ID
                const action = this.form.id === 'login-form' ? 'login' : 'register';
                const result = await this.submitForm(action, data);
                
                if (result.success) {
                    // Store auth token
                    localStorage.setItem('auth_token', result.token);
                    
                    // Update UI elements
                    const authButtons = document.querySelectorAll('.auth-buttons');
                    authButtons.forEach(container => {
                        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
                        container.innerHTML = `
                            <button type="button" class="btn btn-text username-display">${userData.username}</button>
                            <button type="button" class="btn btn-outline sign-out-btn">Sign Out</button>
                        `;
                    });
                    
                    // Redirect to home page after registration
                    window.location.href = result.redirect || '/';
                } else {
                    this.showError(result.message);
                }
            } catch (error) {
                this.showError('An error occurred. Please try again.');
            } finally {
                this.form.classList.remove('loading');
            }
        }
    }

    showError(message) {
        const errorEl = this.form.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    async submitForm(action, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (action === 'register') {
                    // Store user data
                    const userData = {
                        name: data.username,
                        email: data.email,
                        isAuthenticated: true
                    };
                    localStorage.setItem('user_data', JSON.stringify(userData));
                    
                    // Update UI
                    const loginBtn = document.querySelector('.login-btn');
                    const registerBtn = document.querySelector('.register-btn');
                    const userNameBtn = document.querySelector('.user-name-btn');
                    
                    if (loginBtn) loginBtn.classList.add('hidden');
                    if (registerBtn) registerBtn.classList.add('hidden');
                    if (userNameBtn) {
                        userNameBtn.textContent = userData.name;
                        userNameBtn.classList.remove('hidden');
                    }
                    
                    resolve({
                        success: true,
                        token: 'dummy_token',
                        redirect: '/index.html'
                    });
                } else {
                    // Login - check if user exists
                    const storedUser = JSON.parse(localStorage.getItem('user_data') || '{}');
                    if (storedUser.email === data.email) {
                        storedUser.isAuthenticated = true;
                        localStorage.setItem('user_data', JSON.stringify(storedUser));
                        
                        // Update UI
                        const loginBtn = document.querySelector('.login-btn');
                        const registerBtn = document.querySelector('.register-btn');
                        const userNameBtn = document.querySelector('.user-name-btn');
                        
                        if (loginBtn) loginBtn.classList.add('hidden');
                        if (registerBtn) registerBtn.classList.add('hidden');
                        if (userNameBtn) {
                            userNameBtn.textContent = storedUser.name;
                            userNameBtn.classList.remove('hidden');
                        }
                        
                        resolve({
                            success: true,
                            token: 'dummy_token',
                            redirect: '/index.html'
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Invalid credentials'
                        });
                    }
                }
            }, 1000);
        });
    }
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.lang || 'en';
    
    // Initialize login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        new FormValidator(loginForm, lang);
    }
    
    // Initialize register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        new FormValidator(registerForm, lang);
    }
    
    // Add sign out functionality
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        });
    }
});

// Export the Cart class
/**
 * Authentication and Form Validation
 */

class FormValidator {
    constructor() {
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
            username: /^[a-zA-Z0-9_]{3,20}$/
        };

        this.messages = {
            en: {
                email: {
                    pattern: 'Please enter a valid email address',
                    required: 'Email is required'
                },
                password: {
                    pattern: 'Password must be at least 8 characters and contain letters and numbers',
                    required: 'Password is required'
                },
                username: {
                    pattern: 'Username must be 3-20 characters and can contain letters, numbers, and underscores',
                    required: 'Username is required'
                },
                confirmPassword: {
                    match: 'Passwords do not match',
                    required: 'Please confirm your password'
                }
            },
            ar: {
                email: {
                    pattern: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
                    required: 'البريد الإلكتروني مطلوب'
                },
                password: {
                    pattern: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على أحرف وأرقام',
                    required: 'كلمة المرور مطلوبة'
                },
                username: {
                    pattern: 'يجب أن يتكون اسم المستخدم من 3-20 حرفًا ويمكن أن يحتوي على أحرف وأرقام وشرطات سفلية',
                    required: 'اسم المستخدم مطلوب'
                },
                confirmPassword: {
                    match: 'كلمات المرور غير متطابقة',
                    required: 'يرجى تأكيد كلمة المرور'
                }
            }
        };

        this.initializeForms();
        this.initializePasswordToggles();
        this.initializeTabSwitching();
    }

    initializeForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            this.setupFormValidation(loginForm);
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            this.setupFormValidation(registerForm);
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const lang = document.documentElement.getAttribute('lang') || 'en';
        const field = input.name;
        const value = input.value.trim();
        const messages = this.messages[lang];

        // Clear previous validation
        input.classList.remove('invalid');
        const messageElement = input.parentElement.querySelector('.validation-message') ||
                             input.parentElement.parentElement.querySelector('.validation-message');
        messageElement.textContent = '';

        // Required field validation
        if (!value && input.hasAttribute('required')) {
            input.classList.add('invalid');
            messageElement.textContent = messages[field]?.required;
            return false;
        }

        // Pattern validation
        if (value && this.patterns[field] && !this.patterns[field].test(value)) {
            input.classList.add('invalid');
            messageElement.textContent = messages[field]?.pattern;
            return false;
        }

        // Confirm password validation
        if (field === 'confirmPassword') {
            const password = document.getElementById('registerPassword').value;
            if (value !== password) {
                input.classList.add('invalid');
                messageElement.textContent = messages.confirmPassword.match;
                return false;
            }
        }

        return true;
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    initializePasswordToggles() {
        const toggles = document.querySelectorAll('.toggle-password');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const input = button.parentElement.querySelector('input');
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                button.setAttribute('aria-label',
                    type === 'password' ? 'Show password' : 'Hide password'
                );
            });
        });
    }

    initializeTabSwitching() {
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetForm = tab.getAttribute('data-tab');
                this.switchForm(targetForm);
            });
        });
    }

    switchForm(targetForm) {
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === targetForm);
        });

        forms.forEach(form => {
            form.classList.toggle('active', form.id === `${targetForm}Form`);
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        if (!this.validateForm(e.target)) return;

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            // Here you would typically make an API call to your authentication endpoint
            // For demo purposes, we'll use localStorage
            localStorage.setItem('tranex-auth-token', 'demo-token');
            localStorage.setItem('tranex-user-email', email);

            // Update auth state in the header
            if (typeof checkAuthState === 'function') {
                checkAuthState();
            }

            // Redirect back to the previous page or home
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            window.location.href = redirect || '/';
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        if (!this.validateForm(e.target)) return;

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const username = formData.get('username');

        try {
            // Here you would typically make an API call to your registration endpoint
            // For demo purposes, we'll use localStorage
            localStorage.setItem('tranex-auth-token', 'demo-token');
            localStorage.setItem('tranex-user-email', email);
            localStorage.setItem('tranex-username', username);

            // Update auth state in the header
            if (typeof checkAuthState === 'function') {
                checkAuthState();
            }

            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }
}

// Initialize form validation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
});

class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.count = 0;
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('tranex_cart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                this.items = cartData.items || [];
                this.recalculateCart();
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                this.clearCart();
            }
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('tranex_cart', JSON.stringify({
            items: this.items
        }));
    }

    addItem(product, quantity = 1) {
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            this.items[existingItemIndex].quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.recalculateCart();
        this.saveToLocalStorage();
        this.updateCartUI();
    }

    updateItemQuantity(productId, quantity) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.items[itemIndex].quantity = quantity;
                this.recalculateCart();
                this.saveToLocalStorage();
                this.updateCartUI();
            }
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.recalculateCart();
        this.saveToLocalStorage();
        this.updateCartUI();
    }

    clearCart() {
        this.items = [];
        this.recalculateCart();
        this.saveToLocalStorage();
        this.updateCartUI();
    }

    recalculateCart() {
        this.count = this.items.reduce((total, item) => total + item.quantity, 0);
        this.total = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartUI() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.count;
            cartCountElement.classList.toggle('visible', this.count > 0);
        }

        this.updateCartDropdown();
        this.updateCartPage();
    }

    updateCartDropdown() {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (!cartDropdown) return;

        const cartItemsList = cartDropdown.querySelector('.cart-items');
        const cartTotal = cartDropdown.querySelector('.cart-total-amount');

        if (cartItemsList) {
            cartItemsList.innerHTML = '';

            if (this.items.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'cart-empty';
                emptyMessage.textContent = document.documentElement.lang === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty';
                cartItemsList.appendChild(emptyMessage);
            } else {
                this.items.forEach(item => {
                    const cartItem = this.createCartItemElement(item);
                    cartItemsList.appendChild(cartItem);
                });
            }
        }

        if (cartTotal) {
            cartTotal.textContent = `$${this.total.toFixed(2)}`;
        }
    }

    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/100x100?text=Product'">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-price">${item.quantity} × $${item.price.toFixed(2)}</div>
            </div>
            <button class="cart-item-remove" data-product-id="${item.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;

        const removeButton = cartItem.querySelector('.cart-item-remove');
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = removeButton.getAttribute('data-product-id');
            this.removeItem(productId);
        });

        return cartItem;
    }

    updateCartPage() {
        const cartPage = document.getElementById('cart-page');
        if (!cartPage) return;

        const cartTable = document.getElementById('cart-table');
        const cartTableBody = cartTable?.querySelector('tbody');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotalElement = document.getElementById('cart-total');

        if (cartTableBody) {
            cartTableBody.innerHTML = '';

            if (this.items.length === 0) {
                cartTable.style.display = 'none';
                const emptyCart = document.getElementById('empty-cart');
                if (emptyCart) {
                    emptyCart.style.display = 'block';
                }
            } else {
                cartTable.style.display = 'table';
                const emptyCart = document.getElementById('empty-cart');
                if (emptyCart) {
                    emptyCart.style.display = 'none';
                }

                this.items.forEach(item => {
                    const row = this.createCartTableRow(item);
                    cartTableBody.appendChild(row);
                });
            }
        }

        if (cartSubtotal) cartSubtotal.textContent = `$${this.total.toFixed(2)}`;
        if (cartTotalElement) cartTotalElement.textContent = `$${this.total.toFixed(2)}`;
    }

    createCartTableRow(item) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="product-thumbnail">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/100x100?text=Product'">
            </td>
            <td class="product-name">${item.name}</td>
            <td class="product-price">$${item.price.toFixed(2)}</td>
            <td class="product-quantity">
                <div class="quantity-selector">
                    <button class="quantity-decrease" data-product-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-product-id="${item.id}">
                    <button class="quantity-increase" data-product-id="${item.id}">+</button>
                </div>
            </td>
            <td class="product-subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
            <td class="product-remove">
                <button class="remove-product" data-product-id="${item.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        `;

        this.setupCartTableRowEvents(row);
        return row;
    }

    setupCartTableRowEvents(row) {
        const decreaseBtn = row.querySelector('.quantity-decrease');
        const increaseBtn = row.querySelector('.quantity-increase');
        const quantityInput = row.querySelector('input[type="number"]');
        const removeBtn = row.querySelector('.remove-product');
        const productId = decreaseBtn.getAttribute('data-product-id');

        decreaseBtn.addEventListener('click', () => {
            const currentQty = parseInt(quantityInput.value);
            if (currentQty > 1) {
                this.updateItemQuantity(productId, currentQty - 1);
            }
        });

        increaseBtn.addEventListener('click', () => {
            const currentQty = parseInt(quantityInput.value);
            this.updateItemQuantity(productId, currentQty + 1);
        });

        quantityInput.addEventListener('change', () => {
            const newQty = parseInt(quantityInput.value);
            if (newQty >= 1) {
                this.updateItemQuantity(productId, newQty);
            }
        });

        removeBtn.addEventListener('click', () => {
            this.removeItem(productId);
        });
    }
}

// Export the Cart class
export { Cart, FormValidator };