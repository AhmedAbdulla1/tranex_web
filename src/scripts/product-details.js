// ==========================================================================
// Product Details Page JavaScript
// ==========================================================================

// Supabase configuration (replace with your actual credentials)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabase;
try {
    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.warn('Supabase not available, using mock data');
}

// ==========================================================================
// Product Gallery
// ==========================================================================

function initializeProductGallery() {
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    const mainImage = document.getElementById('main-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Update main image
            const imageSrc = thumbnail.dataset.image;
            mainImage.src = imageSrc;
            mainImage.alt = thumbnail.querySelector('img').alt;
        });
    });
}

// ==========================================================================
// Product Options
// ==========================================================================

function initializeProductOptions() {
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            // Update product price if color affects price
            updateProductPrice();
        });
    });
    
    // Resistance level selection
    const resistanceSelect = document.getElementById('resistance-level');
    if (resistanceSelect) {
        resistanceSelect.addEventListener('change', () => {
            updateProductPrice();
        });
    }
}

function updateProductPrice() {
    const resistanceLevel = document.getElementById('resistance-level')?.value;
    const selectedColor = document.querySelector('.color-option.active')?.dataset.color;
    
    // Base price for Pro model
    let basePrice = 2499;
    
    // Adjust price based on resistance level
    if (resistanceLevel === 'basic') {
        basePrice = 1999;
    } else if (resistanceLevel === 'elite') {
        basePrice = 2999;
    }
    
    // Adjust price based on color (example pricing)
    if (selectedColor === 'blue') {
        basePrice += 100; // Premium color
    }
    
    // Update displayed price
    const currentPriceElement = document.querySelector('.current-price');
    if (currentPriceElement) {
        currentPriceElement.textContent = `$${basePrice.toLocaleString()}`;
    }
    
    // Update discount calculation
    const originalPriceElement = document.querySelector('.original-price');
    const discountBadge = document.querySelector('.discount-badge');
    if (originalPriceElement && discountBadge) {
        const originalPrice = 2999;
        const discount = originalPrice - basePrice;
        discountBadge.textContent = `Save $${discount}`;
    }
}

// ==========================================================================
// Quantity Controls
// ==========================================================================

function initializeQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const increaseBtn = document.querySelector('.quantity-increase');
    const decreaseBtn = document.querySelector('.quantity-decrease');
    
    if (quantityInput && increaseBtn && decreaseBtn) {
        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        // Prevent manual input of invalid values
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 10) value = 10;
            quantityInput.value = value;
        });
    }
}

// ==========================================================================
// Add to Cart
// ==========================================================================

async function addToCart() {
    const quantityInput = document.getElementById('quantity-input');
    const quantity = quantityInput ? quantityInput.value : 1;
    // const quantity = parseInt(document.getElementById('quantity').value);
    const resistanceLevel = document.getElementById('resistance-level').value;
    const selectedColor = document.querySelector('.color-option.active').dataset.color;
    
    const productData = {
        id: 'FLW-PRO-001',
        name: 'Flywheel Training System Pro',
        price: 2499,
        quantity: quantity,
        options: {
            resistance: resistanceLevel,
            color: selectedColor
        },
        image: '/src/assets/images/flywheel-main.jpg'
    };
    
    try {
        if (supabase) {
            // Add to Supabase cart table
            const { data, error } = await supabase
                .from('cart')
                .insert([{
                    user_id: getCurrentUserId(),
                    product_data: productData,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
        }
        
        // Add to local storage cart
        addToLocalCart(productData);
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showNotification('Product added to cart successfully!', 'success');
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add product to cart. Please try again.', 'error');
    }
}

function addToLocalCart(productData) {
    let cart = JSON.parse(localStorage.getItem('tranex-cart') || '[]');
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => 
        item.id === productData.id && 
        JSON.stringify(item.options) === JSON.stringify(productData.options)
    );
    
    if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += productData.quantity;
    } else {
        // Add new product
        cart.push(productData);
    }
    
    localStorage.setItem('tranex-cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('tranex-cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function getCurrentUserId() {
    // This should return the current user's ID from your auth system
    // For now, return a placeholder
    return 'guest-user';
}

// ==========================================================================
// Product Tabs
// ==========================================================================

function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Load content for specific tabs
            if (targetTab === 'reviews') {
                loadProductReviews();
            } else if (targetTab === 'specifications') {
                loadProductSpecifications();
            }
        });
    });
}

// ==========================================================================
// Initialize Page
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeProductGallery();
    initializeProductOptions();
    initializeQuantityControls();
    initializeProductTabs();
    loadProductData();
});

// ==========================================================================
// Load Product Data
// ==========================================================================

async function loadProductData() {
    try {
        if (supabase) {
            // Load product data from Supabase
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', 'FLW-PRO-001')
                .single();
            
            if (error) throw error;
            
            // Update product information
            updateProductInfo(data);
        } else {
            // Use mock data if Supabase is not available
            loadMockProductData();
        }
    } catch (error) {
        console.error('Error loading product data:', error);
        loadMockProductData();
    }
}

function loadMockProductData() {
    // Mock product data
    const mockData = {
        name: 'Flywheel Training System Pro',
        price: 2499,
        original_price: 2999,
        rating: 4.8,
        review_count: 24,
        description: 'The TRANEX Flywheel Training System Pro is the ultimate solution for elite athletes and sports facilities.',
        features: [
            'Adjustable resistance from 0-200kg',
            'Real-time performance tracking',
            'Bluetooth connectivity for data sync',
            'Professional-grade construction',
            'Includes mobile app for analytics'
        ],
        specifications: {
            dimensions: '120cm x 80cm x 150cm',
            weight: '45kg',
            resistance_range: '0-200kg (adjustable)',
            power_requirements: '110-240V AC, 50-60Hz',
            connectivity: 'Bluetooth 5.0, WiFi',
            warranty: '3 years comprehensive'
        }
    };
    
    updateProductInfo(mockData);
}

function updateProductInfo(data) {
    // Update product title
    const titleElement = document.querySelector('.product-title');
    if (titleElement && data.name) {
        titleElement.textContent = data.name;
    }
    
    // Update price
    if (data.price) {
        const currentPriceElement = document.querySelector('.current-price');
        if (currentPriceElement) {
            currentPriceElement.textContent = `$${data.price.toLocaleString()}`;
        }
    }
    
    // Update rating
    if (data.rating) {
        const ratingElement = document.querySelector('.rating-text');
        if (ratingElement) {
            ratingElement.textContent = `${data.rating} (${data.review_count || 0} reviews)`;
        }
    }
}

// ==========================================================================
// Load Reviews
// ==========================================================================

async function loadProductReviews() {
    try {
        if (supabase) {
            // Load reviews from Supabase
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', 'FLW-PRO-001')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            displayReviews(data);
        } else {
            // Use mock reviews
            loadMockReviews();
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        loadMockReviews();
    }
}

function loadMockReviews() {
    const mockReviews = [
        {
            id: 1,
            user_name: 'John Smith',
            rating: 5,
            comment: 'Excellent training equipment! The resistance control is precise and the app integration is seamless.',
            created_at: '2024-01-15'
        },
        {
            id: 2,
            user_name: 'Sarah Johnson',
            rating: 4,
            comment: 'Great quality and durability. Perfect for our sports facility. Only giving 4 stars because the app could be more intuitive.',
            created_at: '2024-01-10'
        },
        {
            id: 3,
            user_name: 'Mike Chen',
            rating: 5,
            comment: 'Best investment for our training center. Athletes love the real-time feedback and performance tracking.',
            created_at: '2024-01-05'
        }
    ];
    
    displayReviews(mockReviews);
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    const reviewsHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
                <div class="review-author">${review.user_name}</div>
                <div class="review-date">${formatDate(review.created_at)}</div>
            </div>
            <div class="review-comment">${review.comment}</div>
        </div>
    `).join('');
    
    reviewsContainer.innerHTML = reviewsHTML;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<span class="star filled">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<span class="star half">☆</span>';
        } else {
            starsHTML += '<span class="star">☆</span>';
        }
    }
    
    return starsHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ==========================================================================
// Load Related Products
// ==========================================================================

async function loadRelatedProducts() {
    try {
        if (supabase) {
            // Load related products from Supabase
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .neq('id', 'FLW-PRO-001')
                .limit(4);
            
            if (error) throw error;
            
            displayRelatedProducts(data);
        } else {
            // Use mock related products
            loadMockRelatedProducts();
        }
    } catch (error) {
        console.error('Error loading related products:', error);
        loadMockRelatedProducts();
    }
}

function loadMockRelatedProducts() {
    const mockProducts = [
        {
            id: 'FLW-BASIC-001',
            name: 'Flywheel Training System Basic',
            price: 1999,
            image: '/src/assets/images/flywheel-basic.jpg'
        },
        {
            id: 'FENCING-PRO-001',
            name: 'Professional Fencing Equipment Set',
            price: 899,
            image: '/src/assets/images/fencing-set.jpg'
        },
        {
            id: 'ANALYTICS-PRO-001',
            name: 'Performance Analytics Dashboard',
            price: 299,
            image: '/src/assets/images/analytics-dashboard.jpg'
        }
    ];
    
    displayRelatedProducts(mockProducts);
}

function displayRelatedProducts(products) {
    const container = document.getElementById('related-products');
    if (!container) return;
    
    const productsHTML = products.map(product => `
        <div class="product-card">
            <div class="product-card__image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card__content">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__price">$${product.price.toLocaleString()}</p>
                <a href="/product-details.html?id=${product.id}" class="btn btn--primary btn--sm">View Details</a>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productsHTML;
}

// ==========================================================================
// Notifications
// ==========================================================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==========================================================================
// Initialize Page
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeProductGallery();
    initializeProductOptions();
    initializeProductTabs();
    
    // Load product data
    loadProductData();
    
    // Load related products
    loadRelatedProducts();
    
    // Update cart count
    updateCartCount();
    
    // Add event listeners for quantity controls
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
        });
    }
});

// ==========================================================================
// Export functions for global access
// ==========================================================================

window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCart = addToCart;
