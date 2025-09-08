import { supabaseService } from "./SupabaseService.js";

/**
 * Authentication functionality for TRANEX website
 * Handles user authentication flows and UI interactions with real-time validation
 */

class FormValidator {
    constructor() {
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
            username: /^[a-zA-Z0-9_ ]{3,20}$/
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

        this.excludedPages = ['login.html', 'register.html', 'reset-password.html'];
        this.currentPage = window.location.pathname.split("/").pop();

        const urlParams = new URLSearchParams(window.location.search);

        this.redirectPage = (this.excludedPages.includes(this.currentPage)
            ? 'index.html'
            : document.referrer || 'index.html');

        this.initializeForms();
        this.initializePasswordToggles();
        this.initializeTabSwitching();
    }

    initializeForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

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
            input.classList.remove('invalid')
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const lang = document.documentElement.getAttribute('lang') || document.documentElement.lang || 'en';
        const field = input.name;
        const value = input.value.trim();
        const messages = this.messages[lang];

        // Clear previous validation
        input.classList.remove('invalid');
        const messageElement = input.parentElement.querySelector('.validation-message') ||
            input.parentElement.parentElement.querySelector('.validation-message');

        // Add this safety check
        if (messageElement) {
            messageElement.textContent = '';
        }

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
            const password = input.form.querySelector('input[name="password"]').value;
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
        console.log('Form validation result:', isValid)
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
            const { data, error } = await supabaseService.login(email, password);

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.message,
                    confirmButtonColor: '#0066cc'
                });
                return;
            }

            // Save session info
            localStorage.setItem('tranex-auth-token', data.session.access_token);
            localStorage.setItem('tranex-user-email', data.user.email);

            if (typeof checkAuthState === 'function') {
                checkAuthState();
            }

            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: 'Login successful!',
                confirmButtonColor: '#0066cc'
            });

            // Redirect after short delay
            setTimeout(() => {
                const redirect = new URLSearchParams(window.location.search).get('redirect');
                window.location.href = redirect || this.redirectPage;
            }, 1500);
        } catch (error) {
            console.error('Login failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'An unexpected error occurred.',
                confirmButtonColor: '#0066cc'
            });
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        if (!this.validateForm(e.target)) return;

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const full_name = formData.get('username');
        console.log('Registering user:', { email, password, full_name })

        try {
            const { data, error } = await supabaseService.register(email, password, full_name);

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: error.message,
                    confirmButtonColor: '#0066cc'
                });
                return;
            }

            localStorage.setItem('tranex-user-email', email);
            localStorage.setItem('tranex-username', full_name);

            if (typeof checkAuthState === 'function') {
                checkAuthState();
            }

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'Please check your email to confirm your account.',
                confirmButtonColor: '#0066cc'
            });

            // Redirect to home page
            setTimeout(() => {
                window.location.href = this.redirectPage;
            }, 2000);
        } catch (error) {
            console.error('Registration failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'An unexpected error occurred.',
                confirmButtonColor: '#0066cc'
            });
        }
    }
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!window.formValidatorInstance) {
        window.formValidatorInstance = new FormValidator();
    }

    // Add sign out functionality
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            localStorage.removeItem('tranex-auth-token');
            localStorage.removeItem('tranex-user-email');
            localStorage.removeItem('tranex-username');
            window.location.href = 'index.html';
        });
    }
});
