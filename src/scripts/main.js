/**
 * FlyPro Systems - Main JavaScript
 * Handles theme switching, language switching, mobile menu, and store functionality
 */

// ==========================================================================
// Theme Management
// ==========================================================================

function initializeTheme() {
  const savedTheme = localStorage.getItem('tranex-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  console.log('Toggle Theme V2.0');
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('tranex-theme', newTheme);
  updateThemeIcon(newTheme);

  // Add theme transition animation
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function updateThemeIcon(theme) {
  const button = document.querySelector('.theme-toggle');
  if (button) {
    button.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

// ==========================================================================
// Language Management
// ==========================================================================

function getCurrentLanguage() {
  return document.documentElement.getAttribute('lang') || 'en';
}

function switchLanguage(targetLang) {
  const currentLang = getCurrentLanguage();

  if (currentLang === targetLang) return;

  // Update HTML attributes
  document.documentElement.setAttribute('lang', targetLang);
  document.documentElement.setAttribute('dir', targetLang === 'ar' ? 'rtl' : 'ltr');

  // Update content based on language
  updatePageContent(targetLang);

  // Update language switcher
  updateLanguageSwitcher();

  // Store preference
  localStorage.setItem('tranex-language', targetLang);

  // Add animation effect
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 300);
}

function updatePageContent(lang) {
  // Update page title and meta description
  if (lang === 'ar') {
    document.title = document.title.replace('TRANEX', 'ترانكس');
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'ترانكس توفر حلول تكنولوجية متطورة للشركات والمنظمات. حلول مبتكرة وموثوقة وقابلة للتطوير للعالم الحديث.');
  } else {
    document.title = document.title.replace('ترانكس', 'TRANEX');
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'TRANEX provides cutting-edge technology solutions for businesses and organizations. Innovative, reliable, and scalable solutions for the modern world.');
  }

  // Update navigation text
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (lang === 'ar') {
      if (link.textContent === 'Home') link.textContent = 'الرئيسية';
      if (link.textContent === 'About') link.textContent = 'من نحن';
      if (link.textContent === 'Services') link.textContent = 'خدماتنا';
      if (link.textContent === 'Contact') link.textContent = 'اتصل بنا';
      if (link.textContent === 'Store') link.textContent = 'المتجر';
    } else {
      if (link.textContent === 'الرئيسية') link.textContent = 'Home';
      if (link.textContent === 'من نحن') link.textContent = 'About';
      if (link.textContent === 'خدماتنا') link.textContent = 'Services';
      if (link.textContent === 'اتصل بنا') link.textContent = 'Contact';
      if (link.textContent === 'المتجر') link.textContent = 'Store';
    }
  });

  // Update all elements with data-en and data-ar attributes
  document.querySelectorAll('[data-en][data-ar]').forEach(element => {
    const enText = element.getAttribute('data-en');
    const arText = element.getAttribute('data-ar');
    if (enText && arText) {
      element.textContent = lang === 'ar' ? arText : enText;
    }
  });

  // Update mobile navigation
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    if (lang === 'ar') {
      if (link.textContent === 'Home') link.textContent = 'الرئيسية';
      if (link.textContent === 'About') link.textContent = 'من نحن';
      if (link.textContent === 'Services') link.textContent = 'خدماتنا';
      if (link.textContent === 'Contact') link.textContent = 'اتصل بنا';
    } else {
      if (link.textContent === 'الرئيسية') link.textContent = 'Home';
      if (link.textContent === 'من نحن') link.textContent = 'About';
      if (link.textContent === 'خدماتنا') link.textContent = 'Services';
      if (link.textContent === 'اتصل بنا') link.textContent = 'Contact';
    }
  });

  // Update hero content
  const heroTitle = document.querySelector('.hero__title');
  const heroSubtitle = document.querySelector('.hero__subtitle');

  if (heroTitle && heroSubtitle) {
    if (lang === 'ar') {
      if (heroTitle.textContent === 'Next-Gen Technology Solutions') {
        heroTitle.textContent = 'حلول تكنولوجية من الجيل القادم';
      }
      if (heroSubtitle.textContent === 'Innovative, reliable, and scalable technology solutions for modern businesses and organizations.') {
        heroSubtitle.textContent = 'حلول تكنولوجية مبتكرة وموثوقة وقابلة للتطوير للشركات والمنظمات الحديثة.';
      }
    } else {
      if (heroTitle.textContent === 'حلول تكنولوجية من الجيل القادم') {
        heroTitle.textContent = 'Next-Gen Technology Solutions';
      }
      if (heroSubtitle.textContent === 'حلول تكنولوجية مبتكرة وموثوقة وقابلة للتطوير للشركات والمنظمات الحديثة.') {
        heroSubtitle.textContent = 'Innovative, reliable, and scalable technology solutions for modern businesses and organizations.';
      }
    }
  }

  // Update CTA buttons
  const ctaButtons = document.querySelectorAll('.btn--primary');
  ctaButtons.forEach(button => {
    if (lang === 'ar') {
      if (button.textContent === 'Our Services') button.textContent = 'خدماتنا';
      if (button.textContent === 'Contact Us') button.textContent = 'اتصل بنا';
      if (button.textContent === 'Shop Now') button.textContent = 'تسوق الآن';
      if (button.textContent === 'Get Started') button.textContent = 'ابدأ الآن';
    } else {
      if (button.textContent === 'خدماتنا') button.textContent = 'Our Services';
      if (button.textContent === 'اتصل بنا') button.textContent = 'Contact Us';
      if (button.textContent === 'تسوق الآن') button.textContent = 'Shop Now';
      if (button.textContent === 'ابدأ الآن') button.textContent = 'Get Started';
    }
  });
}

function updateLanguageSwitcher() {
  const currentLang = getCurrentLanguage();
  const langButton = document.querySelector('.lang-btn');

  if (langButton) {
    if (currentLang === 'ar') {
      langButton.textContent = 'English';
      langButton.setAttribute('aria-label', 'Switch to English');
    } else {
      langButton.textContent = 'العربية';
      langButton.setAttribute('aria-label', 'Switch to Arabic');
    }
  }
}

// ثبت الليسنر مرة واحدة بس عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  console.log('theme toggle issue v2.0')
  const langButton = document.querySelector('.lang-btn');
  if (langButton) {
    langButton.addEventListener('click', () => {
      const newLang = getCurrentLanguage() === 'ar' ? 'en' : 'ar';
      switchLanguage(newLang);
    });
  }
});

// ==========================================================================
// Mobile Menu Management
// ==========================================================================

// Cart class for managing cart state
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart_items') || '[]');
    this.updateBadge();
  }

  addItem(item) {
    this.items.push(item);
    this.saveCart();
    this.updateBadge();
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateBadge();
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
      this.updateBadge();
    }
  }

  saveCart() {
    localStorage.setItem('cart_items', JSON.stringify(this.items));
  }

  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = this.items.length;
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}


// Authentication Functions
function handleAuthState() {
  const authData = localStorage.getItem('tranex_auth');
  const loginBtn = document.querySelector('.login-btn');
  const registerBtn = document.querySelector('.register-btn');
  const userNameBtn = document.querySelector('.user-name-btn');
  const signOutBtn = document.querySelector('.sign-out-btn');

  if (authData) {
    const user = JSON.parse(authData);
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userNameBtn) {
      userNameBtn.style.display = 'block';
      userNameBtn.textContent = user.name;
    }
    if (signOutBtn) signOutBtn.style.display = 'block';
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (registerBtn) registerBtn.style.display = 'block';
    if (userNameBtn) userNameBtn.style.display = 'none';
    if (signOutBtn) signOutBtn.style.display = 'none';
  }
}

function handleSignOut() {
  localStorage.removeItem('tranex_auth');
  handleAuthState();
  window.location.href = '/';
}

// Initialize cart and auth state
const cart = new Cart();

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initializeTheme();

  // Initialize language
  updateLanguageSwitcher();

  // Initialize auth state
  handleAuthState();

  // Mobile menu event listeners
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    const menu = document.querySelector('.mobile-nav');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (e.target.closest('.mobile-nav') || e.target.closest('.mobile-menu-toggle')) return;


    if (menu && toggle) {
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });

  // Handle window resize
  window.addEventListener('resize', closeMobileMenuOnResize);
});

function toggleMobileMenu() {
  console.log('Toggle Mobile Menu V2.0')
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  const body = document.body;

  if (!toggle || !menu) return;

  const isOpen = menu.getAttribute('aria-hidden') === 'false';

  if (isOpen) {
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-label', 'Open mobile menu');
    body.style.overflow = '';
  } else {
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-label', 'Close mobile menu');
    body.style.overflow = 'hidden';
  }
}

function closeMobileMenuOnResize() {
  const menu = document.querySelector('.mobile-nav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const body = document.body;

  if (window.innerWidth >= 768 && menu && toggle) {
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-label', 'Open mobile menu');
    body.style.overflow = '';
  }
}

function handleAuthState() {
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const isAuthenticated = !!userData;

  const loginBtn = document.querySelector('.login-btn');
  const registerBtn = document.querySelector('.register-btn');
  const userNameBtn = document.querySelector('.user-name-btn');
  const signOutBtn = document.querySelector('.signout-btn');

  if (isAuthenticated && userData.name) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (registerBtn) registerBtn.classList.add('hidden');
    if (userNameBtn) {
      userNameBtn.textContent = userData.name;
      userNameBtn.classList.remove('hidden');
    }
    if (signOutBtn) signOutBtn.classList.remove('hidden');
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (registerBtn) registerBtn.classList.remove('hidden');
    if (userNameBtn) userNameBtn.classList.add('hidden');
    if (signOutBtn) signOutBtn.classList.add('hidden');
  }
}

function handleSignOut() {
  localStorage.removeItem('user_data');
  handleAuthState();
  window.location.href = '/index.html';
}


// ==========================================================================
// Authentication Management
// ==========================================================================

function checkAuthState() {
  const isAuthenticated = localStorage.getItem('tranex-auth-token');
  updateAuthButtons(!!isAuthenticated);
}

function updateAuthButtons(isAuthenticated) {
  const loginBtns = document.querySelectorAll('.login-btn');
  const signoutBtns = document.querySelectorAll('.signout-btn');
  const currentLang = getCurrentLanguage();

  loginBtns.forEach(btn => {
    btn.classList.toggle('hidden', isAuthenticated);
    btn.textContent = currentLang === 'ar' ? 'تسجيل الدخول' : 'Login';
  });

  signoutBtns.forEach(btn => {
    btn.classList.toggle('hidden', !isAuthenticated);
    btn.textContent = currentLang === 'ar' ? 'تسجيل الخروج' : 'Sign Out';
    if (!btn.hasListener) {
      btn.addEventListener('click', handleSignOut);
      btn.hasListener = true;
    }
  });
}

function handleSignOut() {
  localStorage.removeItem('tranex-auth-token');
  updateAuthButtons(false);

  // Redirect to home page if on a protected route
  const protectedRoutes = ['/src/pages/cart.html', '/src/pages/profile.html'];
  if (protectedRoutes.some(route => window.location.pathname.includes(route))) {
    window.location.href = '/';
  }
}

// Initialize mobile menu and auth state
document.addEventListener('DOMContentLoaded', () => {

  // Close mobile menu on resize
  window.addEventListener('resize', closeMobileMenuOnResize);

  // Initialize auth state
  checkAuthState();
});

// ==========================================================================
// Store Functionality
// ==========================================================================

// Sample product data
const products = [
  {
    id: 'flywheel-pro',
    name: 'Flywheel Pro 2.0',
    nameAr: 'فلاي ويل برو 2.0',
    price: 899,
    category: 'flywheel',
    description: 'Professional-grade flywheel with CNC aluminum construction and BLE sensor port.',
    descriptionAr: 'فلاي ويل احترافي مع هيكل من الألمنيوم المصنع بتقنية CNC ومنفذ مستشعر BLE.',
    image: '/assets/products/flywheel-pro-1.jpg',
    specs: {
      inertia: '0.01–0.3 kg·m²',
      material: 'CNC aluminum',
      features: 'Quick-swap discs, BLE sensor port'
    },
    specsAr: {
      inertia: '0.01–0.3 كجم·م²',
      material: 'ألمنيوم CNC',
      features: 'أقراص سريعة التبديل، منفذ مستشعر BLE'
    }
  },
  {
    id: 'flywheel-lite',
    name: 'Flywheel Lite',
    nameAr: 'فلاي ويل لايت',
    price: 549,
    category: 'flywheel',
    description: 'Compact flywheel perfect for home and clinical use.',
    descriptionAr: 'فلاي ويل مضغوط مثالي للاستخدام المنزلي والسريري.',
    image: '/assets/products/flywheel-lite-1.jpg',
    specs: {
      design: 'Compact',
      strap: 'Adjustable',
      use: 'Home/clinic use'
    },
    specsAr: {
      design: 'مضغوط',
      strap: 'قابل للتعديل',
      use: 'للاستخدام المنزلي/السريري'
    }
  },
  {
    id: 'smart-sensor',
    name: 'Smart Sensor Module',
    nameAr: 'وحدة المستشعر الذكي',
    price: 129,
    category: 'sensors',
    description: 'Advanced sensor for RPM, direction, and force measurement.',
    descriptionAr: 'مستشعر متقدم لقياس RPM والاتجاه والقوة.',
    image: '/assets/products/smart-sensor-1.jpg',
    specs: {
      measurements: 'RPM + direction + force proxy',
      connectivity: 'BLE',
      charging: 'USB-C'
    },
    specsAr: {
      measurements: 'RPM + الاتجاه + وكيل القوة',
      connectivity: 'BLE',
      charging: 'USB-C'
    }
  },
  {
    id: 'mounting-kit',
    name: 'Mounting Accessory Kit',
    nameAr: 'طقم إكسسوارات التثبيت',
    price: 79,
    category: 'accessories',
    description: 'Universal mounting solution with anti-slip pads.',
    descriptionAr: 'حل تثبيت شامل مع وسائد مانعة للانزلاق.',
    image: '/assets/products/mounting-kit-1.jpg',
    specs: {
      mounts: 'Universal mounts',
      pads: 'Anti-slip pads',
      compatibility: 'All FlyPro devices'
    },
    specsAr: {
      mounts: 'حوامل شاملة',
      pads: 'وسائد مانعة للانزلاق',
      compatibility: 'جميع أجهزة FlyPro'
    }
  }
];

function filterProducts() {
  const searchInput = document.querySelector('#search-input');
  const categoryFilter = document.querySelector('#category-filter');
  const priceFilter = document.querySelector('#price-filter');
  const productGrid = document.querySelector('.products__grid');

  if (!productGrid) return;

  const searchTerm = searchInput?.value.toLowerCase() || '';
  const selectedCategory = categoryFilter?.value || 'all';
  const maxPrice = priceFilter?.value ? parseFloat(priceFilter.value) : Infinity;
  const currentLang = getCurrentLanguage();

  const filteredProducts = products.filter(product => {
    const name = currentLang === 'ar' ? product.nameAr : product.name;
    const description = currentLang === 'ar' ? product.descriptionAr : product.description;

    const matchesSearch = name.toLowerCase().includes(searchTerm) ||
      description.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  renderProducts(filteredProducts, currentLang);
}

function renderProducts(productsToRender, lang = 'en') {
  const productGrid = document.querySelector('.products__grid');
  if (!productGrid) return;

  if (productsToRender.length === 0) {
    productGrid.innerHTML = `
      <div class="no-products">
        <p>${lang === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = productsToRender.map(product => {
    const name = lang === 'ar' ? product.nameAr : product.name;
    const description = lang === 'ar' ? product.descriptionAr : product.description;
    const viewDetailsText = lang === 'ar' ? 'عرض التفاصيل' : 'View Details';

    return `
      <article class="product-card">
        <div class="product-card__image">
          <img src="${product.image}" alt="${name}" loading="lazy">
        </div>
        <div class="product-card__content">
          <h3 class="product-card__title">${name}</h3>
          <p class="product-card__description">${description}</p>
          <div class="product-card__price">${product.price}</div>
          <a href="/${lang === 'ar' ? 'ar/' : ''}product-${product.id}.html" class="btn btn--primary btn--sm">
            ${viewDetailsText}
          </a>
        </div>
      </article>
    `;
  }).join('');
}

function initializeStore() {
  // Set up event listeners for store filters
  const searchInput = document.querySelector('#search-input');
  const categoryFilter = document.querySelector('#category-filter');
  const priceFilter = document.querySelector('#price-filter');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(filterProducts, 300));
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterProducts);
  }

  if (priceFilter) {
    priceFilter.addEventListener('change', filterProducts);
  }

  // Initial render
  const currentLang = getCurrentLanguage();
  renderProducts(products, currentLang);
}

// ==========================================================================
// Form Validation
// ==========================================================================

function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach(input => {
    const errorElement = input.parentNode.querySelector('.form-error');

    if (!input.value.trim()) {
      showFieldError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      showFieldError(input, 'Please enter a valid email address');
      isValid = false;
    } else if (input.type === 'tel' && !isValidPhone(input.value)) {
      showFieldError(input, 'Please enter a valid phone number');
      isValid = false;
    } else {
      hideFieldError(input);
    }
  });

  return isValid;
}

function showFieldError(input, message) {
  input.classList.add('error');
  let errorElement = input.parentNode.querySelector('.form-error');

  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    input.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = message;
}

function hideFieldError(input) {
  input.classList.remove('error');
  const errorElement = input.parentNode.querySelector('.form-error');
  if (errorElement) {
    errorElement.remove();
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;

  if (validateForm(form)) {
    // Show success message
    showAlert('success', 'Thank you! Your message has been sent successfully.');
    form.reset();
  }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showAlert(type, message) {
  const alertHTML = `
    <div class="alert alert--${type}">
      ${message}
    </div>
  `;

  // Find a suitable container or create one
  let container = document.querySelector('.alerts-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'alerts-container';
    container.style.cssText = `
      position: fixed;
      top: var(--space-4);
      right: var(--space-4);
      z-index: var(--z-modal);
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }

  container.innerHTML = alertHTML;

  // Auto-remove after 5 seconds
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

function updateCartBadge(count = 0) {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function addToCart(productId) {
  // Placeholder function for cart functionality
  const currentCount = parseInt(document.querySelector('.cart-badge').textContent) || 0;
  updateCartBadge(currentCount + 1);

  const currentLang = getCurrentLanguage();
  const message = currentLang === 'ar' ?
    'تم إضافة المنتج إلى السلة' :
    'Product added to cart';

  showAlert('success', message);
}

// ==========================================================================
// Smooth Scrolling
// ==========================================================================

function smoothScrollToSection(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// ==========================================================================
// Enhanced Animation System
// ==========================================================================

function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationType = element.dataset.animation || 'slideInUp';

        // Add animation class
        element.classList.add(`animate--${animationType}`);
        element.classList.add('animate--visible');

        // Remove observer after animation
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe elements that should animate in
  const animateElements = document.querySelectorAll(
    '.feature-card, .product-card, .testimonial-card, .about-preview__text, .about-preview__image, .hero__content, .hero__image'
  );

  animateElements.forEach((el, index) => {
    // Set initial state
    el.classList.add('animate--initial');

    // Add animation delay for staggered effect
    el.style.animationDelay = `${index * 0.1}s`;

    // Set animation type
    if (el.classList.contains('hero__content')) {
      el.dataset.animation = 'slideInLeft';
    } else if (el.classList.contains('hero__image')) {
      el.dataset.animation = 'slideInRight';
    } else {
      el.dataset.animation = 'slideInUp';
    }

    observer.observe(el);
  });

  // Initialize floating animations for tech elements
  initializeFloatingAnimations();
}

function initializeFloatingAnimations() {
  const techElements = document.querySelectorAll('.tech-item, .tech-circle, .equipment-item, .equipment-circle');

  techElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;
  });
}

// Add CSS classes for animations
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .animate--initial {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .animate--visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .animate--slideInLeft {
      transform: translateX(-30px);
    }
    
    .animate--slideInRight {
      transform: translateX(30px);
    }
    
    .animate--slideInUp {
      transform: translateY(30px);
    }
    
    .animate--fadeIn {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
}

// ==========================================================================
// Lazy Loading Images
// ==========================================================================

function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }
}

// ==========================================================================
// Page-Specific Initialization
// ==========================================================================

function initializeContactPage() {
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
}

function initializeProductPage() {
  // Image gallery functionality
  const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
  const mainImage = document.querySelector('.product-gallery__main img');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      if (mainImage) {
        mainImage.src = thumb.href;
        mainImage.alt = thumb.querySelector('img').alt;
      }

      // Update active thumbnail
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Add to cart button
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const productId = addToCartBtn.dataset.productId;
      addToCart(productId);
    });
  }
}

// ==========================================================================
// Main Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Add animation styles
  addAnimationStyles();

  // Initialize core functionality
  initializeTheme();
  initializeLanguage();
  initializeAnimations();
  initializeLazyLoading();

  // Page-specific initialization
  const pathname = window.location.pathname;

  if (pathname.includes('store.html')) {
    initializeStore();
  }

  if (pathname.includes('contact.html')) {
    initializeContactPage();
  }

  if (pathname.includes('product-')) {
    initializeProductPage();
  }

  // Set up global event listeners
  window.addEventListener('resize', debounce(closeMobileMenuOnResize, 250));

  // Handle system theme changes
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem('tranex-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeIcon(newTheme);
      }
    });

  // Handle navigation active states
  updateActiveNavigation();

  // Add smooth scroll behavior
  addSmoothScrollBehavior();
});

function initializeLanguage() {
  const savedLang = localStorage.getItem('tranex-language') || 'en';
  document.documentElement.setAttribute('lang', savedLang);
  document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
  updateLanguageSwitcher();
  updatePageContent(savedLang);
}

function addSmoothScrollBehavior() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function updateActiveNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');

    if (href === currentPath ||
      (currentPath === '/' && href === '/') ||
      (currentPath.includes('ar') && href.includes('ar'))) {
      link.classList.add('active');
    }
  });
}

// Expose functions globally for onclick handlers
window.toggleTheme = toggleTheme;
window.switchLanguage = switchLanguage;
window.toggleMobileMenu = toggleMobileMenu;
window.addToCart = addToCart;
window.smoothScrollToSection = smoothScrollToSection; window.handleSignOut = handleSignOut;

// Theme toggle event listener
const themeToggleBtn = document.querySelector('.theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
}
