import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
class SupabaseService {
  constructor() {
    // Initialize Supabase client once
    this.supabaseUrl = "https://cwkiimxabpcxxwwvkzdh.supabase.co";
    this.supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3a2lpbXhhYnBjeHh3d3ZremRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Mzg5NjUsImV4cCI6MjA3MTQxNDk2NX0.gIp5PPVNDOVOOK_zn5XIo8NRocpf-VrEVH7-NOX4hQs";
    this.client = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }

  /**
   * 1. LOGIN
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return { success: false, error: error.message };
    }

    console.log("Login successful:", data.user);
    return { success: true, user: data.user, session: data.session };
  }

  /**
   * 2. REGISTER
   * @param {string} email
   * @param {string} password
   * @param {string} full_name
   */
  async register(email, password, full_name) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name, // Save extra data in user_metadata
        },
      },
    });

    if (error) {
      console.error("Registration failed:", error.message);
      return { success: false, error: error.message };
    }

    console.log("Registration successful:", data.user);
    return { success: true, user: data.user };
  }

  /**
   * 3. RESET PASSWORD
   * Sends password reset email
   * @param {string} email
   */
  async resetPassword(email) {
    const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/src/pages/auth/update-password.html`,
    });

    if (error) {
      console.error("Password reset failed:", error.message);
      return { success: false, error: error.message };
    }

    console.log("Password reset email sent:", data);
    return { success: true, data };
  }

  /**
 * 4. SIGN OUT
 * Logs the user out
 */
  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) {
      console.error("Sign out failed:", error.message);
      return { success: false, error: error.message };
    }
    console.log("Sign out successful");
    return { success: true };
  }

  /**
   * Fetches a list of products with optional filtering and sorting.
   * @param {object} options - Query options (limit, offset, category, etc.)
   * @returns {Promise<Array|null>}
   */
  async fetchProducts(options = {}) {
    try {
      let query = this.client
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (options.category) query = query.eq('category', options.category);
      if (options.sortBy) {
        query = query.order(options.sortBy, { ascending: options.sortDirection === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      if (options.limit) query = query.limit(options.limit);
      if (options.offset) query = query.offset(options.offset);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService Error (fetchProducts):', error.message);
      return null;
    }
  }

  /**
   * Fetches a single product by its ID.
   * @param {string} productId - The ID of the product.
   * @returns {Promise<object|null>}
   */
  async fetchProductById(productId) {
    try {
      const { data, error } = await this.client
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService Error (fetchProductById):', error.message);
      return null;
    }
  }

  /**
   * Fetches all active product categories.
   * @returns {Promise<Array|null>}
   */
  async fetchCategories() {
    try {
      const { data, error } = await this.client
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService Error (fetchCategories):', error.message);
      return null;
    }
  }
}

// Export a **single shared instance** of the service
export const supabaseService = new SupabaseService();
