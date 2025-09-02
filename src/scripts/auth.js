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


// Export the Cart class
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
});
