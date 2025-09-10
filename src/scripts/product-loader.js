/**
 * Product Loader
 * Handles loading products from Supabase database
 */
import { supabaseService } from './SupabaseService.js';
class ProductLoader {
  /**
   * Initialize the product loader
   * @param {Object} supabaseClient - Initialized Supabase client
   */
  constructor(supabaseClient) {
    this.products = [];
    this.categories = [];
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Load all products from the database
   * @param {Object} options - Query options (limit, offset, category, etc.)
   * @returns {Promise} - Promise that resolves with products
   */
  async loadProducts(options = {}) {
    this.isLoading = true;
    this.error = null;

    try {
      // It now calls our centralized service method
      const products = await supabaseService.fetchProducts(options);
      return products || []; // Return empty array if service fails
    } catch (error) {
      this.error = error.message;
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load a single product by ID
   * @param {string} productId - The product ID to load
   * @returns {Promise} - Promise that resolves with the product
   */
  async loadProductById(productId) {
    this.isLoading = true;
    this.error = null;

    try {
      // It now calls our centralized service method
      return await supabaseService.fetchProductById(productId);
    } catch (error) {
      this.error = error.message;
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load all product categories
   * @returns {Promise} - Promise that resolves with categories
   */
  async loadCategories() {
    this.isLoading = true;
    this.error = null;

    try {
      // It now calls our centralized service method
      const categories = await supabaseService.fetchCategories();
      return categories || [];
    } catch (error) {
      this.error = error.message;
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get mock products for testing when Supabase is not configured
   * @param {number} count - Number of mock products to generate
   * @returns {Array} - Array of mock products
   */
  getMockProducts(count = 6) {
    const mockProducts = [];
    const categories = ['Flywheel Training', 'Fencing Equipment', 'Performance Analytics', 'Accessories'];

    for (let i = 1; i <= count; i++) {
      const categoryIndex = i % categories.length;
      const price = 99.99 + (i * 50);

      mockProducts.push({
        id: `product-${i}`,
        name: `TRANEX ${categories[categoryIndex]} Pro ${i}`,
        description: `High-performance ${categories[categoryIndex].toLowerCase()} for professional athletes and enthusiasts.`,
        short_description: `Premium ${categories[categoryIndex].toLowerCase()} equipment.`,
        price: price,
        original_price: price * 1.2,
        category: categories[categoryIndex],
        subcategory: null,
        brand: 'TRANEX',
        sku: `TX-${categories[categoryIndex].substring(0, 3).toUpperCase()}-${i}00`,
        stock_quantity: 10 + i,
        images: {
          main: `/src/assets/images/products/product-${i}.jpg`,
          gallery: [
            `/src/assets/images/products/product-${i}-1.jpg`,
            `/src/assets/images/products/product-${i}-2.jpg`
          ]
        },
        features: [
          'Professional grade construction',
          'Lightweight and durable',
          'Advanced performance metrics',
          'Customizable settings'
        ],
        specifications: {
          weight: `${i + 0.5} kg`,
          dimensions: `${30 + i}cm x ${20 + i}cm x ${10 + i}cm`,
          material: 'Aircraft-grade aluminum',
          warranty: '2 years'
        },
        is_active: true,
        created_at: new Date().toISOString()
      });
    }

    return mockProducts;
  }

  /**
   * Get mock categories for testing when Supabase is not configured
   * @returns {Array} - Array of mock categories
   */
  getMockCategories() {
    return [
      {
        id: 1,
        name: 'Flywheel Training',
        slug: 'flywheel-training',
        description: 'Advanced flywheel resistance training systems',
        sort_order: 1,
        is_active: true
      },
      {
        id: 2,
        name: 'Fencing Equipment',
        slug: 'fencing-equipment',
        description: 'Professional fencing gear and protective equipment',
        sort_order: 2,
        is_active: true
      },
      {
        id: 3,
        name: 'Performance Analytics',
        slug: 'performance-analytics',
        description: 'Data analysis and tracking tools',
        sort_order: 3,
        is_active: true
      },
      {
        id: 4,
        name: 'Accessories',
        slug: 'accessories',
        description: 'Training accessories and replacement parts',
        sort_order: 4,
        is_active: true
      }
    ];
  }
}

// Create and export a singleton instance
const productLoader = new ProductLoader();
export default productLoader;