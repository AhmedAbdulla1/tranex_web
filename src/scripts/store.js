/**
 * TRANEX - Store JavaScript
 * Handles product loading and display functionality
 */

import productLoader from './product-loader.js';
import { cartService } from "./CartService.js";

// DOM Elements
let productGrid;
let categoryFilter;
let sortFilter;
let searchInput;
let loadMoreBtn;

// State
let currentPage = 1;
let productsPerPage = 6;
let currentCategory = null;
let currentSort = 'newest';
let searchQuery = '';

/**
 * Initialize the store page
 */
async function initializeStore() {
  // Get DOM elements
  productGrid = document.getElementById('product-grid');
  categoryFilter = document.getElementById('category-filter');
  sortFilter = document.getElementById('sort-filter');
  searchInput = document.getElementById('product-search');
  loadMoreBtn = document.getElementById('load-more');

  // Set up event listeners
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryChange);
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', handleSortChange);
  }

  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreProducts);
  }

  // Load categories
  await loadCategories();

  // Load initial products
  await loadProducts();
}

/**
 * Load product categories
 */
async function loadCategories() {
  if (!categoryFilter) return;

  try {
    // Check if Supabase is configured
    const isSupabaseConfigured = window.supabase &&
      typeof window.supabase.from === 'function';

    // Get categories (real or mock)
    const categories = isSupabaseConfigured ?
      await productLoader.loadCategories() :
      productLoader.getMockCategories();

    // Clear existing options except "All"
    while (categoryFilter.options.length > 1) {
      categoryFilter.remove(1);
    }

    // Add category options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.slug;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

/**
 * Load products based on current filters
 */
async function loadProducts(append = false) {
  if (!productGrid) return;

  // Show loading state
  toggleLoading(true);
  console.log('load products');
  try {
    // Check if Supabase is configured
    const isSupabaseConfigured = window.supabase &&
      typeof window.supabase.from === 'function';

    // Get products (real or mock)
    let products;

    if (isSupabaseConfigured) {
      // Get from Supabase
      console.log('supabase configured');
      const options = {
        limit: productsPerPage,
        offset: append ? (currentPage - 1) * productsPerPage : 0,
        category: currentCategory,
        sortBy: getSortField(currentSort),
        sortDirection: getSortDirection(currentSort)
      };
      products = await productLoader.loadProducts(options);
    } else {
      // Get mock products
      products = productLoader.getMockProducts(12);

      // Apply filtering
      if (currentCategory) {
        const categoryName = getCategoryNameFromSlug(currentCategory);
        products = products.filter(p => p.category === categoryName);
      }

      // Apply sorting
      products = sortProducts(products, currentSort);

      // Apply pagination
      const startIndex = append ? (currentPage - 1) * productsPerPage : 0;
      const endIndex = startIndex + productsPerPage;
      products = products.slice(startIndex, endIndex);
    }

    // Render products
    renderProducts(products, append);

    // Update load more button
    updateLoadMoreButton(products.length);
  } catch (error) {
    console.error('Error loading products:', error);
    showError('Failed to load products. Please try again later.');
  } finally {
    toggleLoading(false);
  }
}

/**
 * Render products to the grid
 * @param {Array} products - Array of product objects
 * @param {boolean} append - Whether to append or replace existing products
 */
function renderProducts(products, append = false) {
  if (!productGrid) return;

  // Clear grid if not appending
  if (!append) {
    productGrid.innerHTML = '';
  }

  // If no products, show message
  if (products.length === 0 && !append) {
    const noProducts = document.createElement('div');
    noProducts.className = 'no-products';
    noProducts.textContent = 'No products found. Try adjusting your filters.';
    productGrid.appendChild(noProducts);
    return;
  }

  // Create product cards
  products.forEach(product => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

/**
 * Create a product card element
 * @param {Object} product - Product object
 * @returns {HTMLElement} - Product card element
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  // Calculate discount percentage if there's an original price
  let discountBadge = '';
  if (product.original_price && product.original_price > product.price) {
    const discountPercent = Math.round((1 - (product.price / product.original_price)) * 100);
    discountBadge = `
      <div class="product-discount">
        <span>-${discountPercent}%</span>
      </div>
    `;
  }

  // Get main image or placeholder
  const imageUrl = product.images && product.images.main ?
    product.images.main :
    '/src/assets/images/product-placeholder.jpg';

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price);

  // Format original price if exists
  let originalPriceHtml = '';
  if (product.original_price && product.original_price > product.price) {
    const formattedOriginalPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(product.original_price);

    originalPriceHtml = `<span class="product-original-price">${formattedOriginalPrice}</span>`;
  }

  // Build card HTML
  card.innerHTML = `
    <a href="/src/pages/product-details.html?id=${product.id}" class="product-link">
      <div class="product-image">
        ${discountBadge}
        <img src="${imageUrl}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-price">
          <span class="current-price">${formattedPrice}</span>
          ${originalPriceHtml}
        </div>
      </div>
    </a>
    <button class="add-to-cart-btn" data-product-id="${product.id}">
      Add to Cart
    </button>
  `;

  // Add event listener to Add to Cart button
  const addToCartBtn = card.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // THIS IS THE NEW, SIMPLIFIED LOGIC
      cartService.addItem(product);
      showNotification('Product added to cart!', 'success');
    });
  }

  return card;
}


/**
 * Handle category filter change
 */
function handleCategoryChange(e) {
  currentCategory = e.target.value === 'all' ? null : e.target.value;
  currentPage = 1;
  loadProducts();
}

/**
 * Handle sort filter change
 */
function handleSortChange(e) {
  currentSort = e.target.value;
  currentPage = 1;
  loadProducts();
}

/**
 * Handle search input
 */
function handleSearch(e) {
  searchQuery = e.target.value.trim();
  currentPage = 1;
  loadProducts();
}

/**
 * Load more products
 */
function loadMoreProducts() {
  currentPage++;
  loadProducts(true);
}

/**
 * Update the load more button state
 * @param {number} productsLoaded - Number of products loaded in the current batch
 */
function updateLoadMoreButton(productsLoaded) {
  if (!loadMoreBtn) return;

  // Hide button if fewer products were loaded than requested
  if (productsLoaded < productsPerPage) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

/**
 * Toggle loading state
 * @param {boolean} isLoading - Whether loading is in progress
 */
function toggleLoading(isLoading) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = isLoading ? 'flex' : 'none';
  }

  if (loadMoreBtn) {
    loadMoreBtn.disabled = isLoading;
  }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  showNotification(message, 'error');
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * Get sort field based on sort option
 * @param {string} sortOption - Sort option
 * @returns {string} - Sort field
 */
function getSortField(sortOption) {
  switch (sortOption) {
    case 'price-low':
    case 'price-high':
      return 'price';
    case 'newest':
    case 'oldest':
      return 'created_at';
    default:
      return 'created_at';
  }
}

/**
 * Get sort direction based on sort option
 * @param {string} sortOption - Sort option
 * @returns {string} - Sort direction (asc or desc)
 */
function getSortDirection(sortOption) {
  switch (sortOption) {
    case 'price-low':
    case 'oldest':
      return 'asc';
    case 'price-high':
    case 'newest':
      return 'desc';
    default:
      return 'desc';
  }
}

/**
 * Sort products array
 * @param {Array} products - Products array
 * @param {string} sortOption - Sort option
 * @returns {Array} - Sorted products
 */
function sortProducts(products, sortOption) {
  const sortedProducts = [...products];

  switch (sortOption) {
    case 'price-low':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'newest':
      return sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'oldest':
      return sortedProducts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    default:
      return sortedProducts;
  }
}

/**
 * Get category name from slug
 * @param {string} slug - Category slug
 * @returns {string} - Category name
 */
function getCategoryNameFromSlug(slug) {
  // This is a simple mapping for mock data
  const categoryMap = {
    'flywheel-training': 'Flywheel Training',
    'fencing-equipment': 'Fencing Equipment',
    'performance-analytics': 'Performance Analytics',
    'accessories': 'Accessories'
  };

  return categoryMap[slug] || '';
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Initialize store when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeStore);