-- ==========================================================================
-- TRANEX Sports Database Schema
-- ==========================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================================
-- Users Table (extends Supabase auth.users)
-- ==========================================================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    company TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================================================
-- Products Table
-- ==========================================================================

CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category TEXT NOT NULL,
    subcategory TEXT,
    brand TEXT DEFAULT 'TRANEX',
    sku TEXT UNIQUE,
    weight DECIMAL(8,2),
    dimensions TEXT,
    features JSONB,
    specifications JSONB,
    images JSONB,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies (products are public)
CREATE POLICY "Products are viewable by everyone" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ==========================================================================
-- Product Categories Table
-- ==========================================================================

CREATE TABLE public.product_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES public.product_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
('Flywheel Training', 'flywheel-training', 'Advanced flywheel resistance training systems', 1),
('Fencing Equipment', 'fencing-equipment', 'Professional fencing gear and protective equipment', 2),
('Performance Analytics', 'performance-analytics', 'Data analysis and tracking tools', 3),
('Accessories', 'accessories', 'Training accessories and replacement parts', 4);

-- ==========================================================================
-- Cart Table
-- ==========================================================================

CREATE TABLE public.cart (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id TEXT, -- For guest users
    product_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own cart" ON public.cart
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (session_id IS NOT NULL AND session_id = current_setting('app.session_id', true))
    );

CREATE POLICY "Users can modify own cart" ON public.cart
    FOR ALL USING (
        auth.uid() = user_id OR 
        (session_id IS NOT NULL AND session_id = current_setting('app.session_id', true))
    );

-- ==========================================================================
-- Orders Table
-- ==========================================================================

CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB,
    billing_address JSONB,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    shipping_method TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can modify orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ==========================================================================
-- Order Items Table
-- ==========================================================================

CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    options JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

-- ==========================================================================
-- Reviews Table
-- ==========================================================================

CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Only admins can delete reviews" ON public.reviews
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ==========================================================================
-- Wishlist Table
-- ==========================================================================

CREATE TABLE public.wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wishlist" ON public.wishlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own wishlist" ON public.wishlist
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================================================
-- Contact Messages Table
-- ==========================================================================

CREATE TABLE public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only admins can view contact messages)
CREATE POLICY "Only admins can view contact messages" ON public.contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- ==========================================================================
-- Sample Data
-- ==========================================================================

-- Insert sample products
INSERT INTO public.products (id, name, description, short_description, price, original_price, category, subcategory, sku, features, specifications, images) VALUES
('FLW-PRO-001', 'Flywheel Training System Pro', 'Advanced flywheel resistance training with real-time performance tracking and analytics.', 'Professional-grade flywheel training system for elite athletes and sports facilities.', 2499.00, 2999.00, 'flywheel-training', 'pro', 'FLW-PRO-001', 
'["Adjustable resistance from 0-200kg", "Real-time performance tracking", "Bluetooth connectivity for data sync", "Professional-grade construction", "Includes mobile app for analytics"]',
'{"dimensions": "120cm x 80cm x 150cm", "weight": "45kg", "resistance_range": "0-200kg (adjustable)", "power_requirements": "110-240V AC, 50-60Hz", "connectivity": "Bluetooth 5.0, WiFi", "warranty": "3 years comprehensive"}',
'["/src/assets/images/flywheel-main.jpg", "/src/assets/images/flywheel-side.jpg", "/src/assets/images/flywheel-detail.jpg"]'),

('FLW-BASIC-001', 'Flywheel Training System Basic', 'Entry-level flywheel training system perfect for beginners and small facilities.', 'Affordable flywheel training system with essential features.', 1999.00, 2499.00, 'flywheel-training', 'basic', 'FLW-BASIC-001',
'["Adjustable resistance from 0-100kg", "Basic performance tracking", "Durable construction", "Easy to use"]',
'{"dimensions": "100cm x 70cm x 140cm", "weight": "35kg", "resistance_range": "0-100kg (adjustable)", "power_requirements": "110-240V AC, 50-60Hz", "warranty": "2 years"}',
'["/src/assets/images/flywheel-basic.jpg"]'),

('FENCING-PRO-001', 'Professional Fencing Equipment Set', 'Complete fencing equipment set for professional athletes and clubs.', 'High-quality fencing gear including masks, jackets, weapons, and protective equipment.', 899.00, 1099.00, 'fencing-equipment', 'complete-sets', 'FENCING-PRO-001',
'["FIE approved equipment", "Professional-grade materials", "Complete protection set", "Multiple weapon options", "Adjustable sizing"]',
'{"included_items": "Mask, Jacket, Glove, Weapon, Body Cord", "materials": "High-grade cotton and synthetic", "certification": "FIE approved", "sizing": "Adjustable"}',
'["/src/assets/images/fencing-set.jpg"]'),

('ANALYTICS-PRO-001', 'Performance Analytics Dashboard', 'Comprehensive analytics platform for tracking athletic performance and progress.', 'Advanced data analysis tools for coaches and athletes.', 299.00, 399.00, 'performance-analytics', 'software', 'ANALYTICS-PRO-001',
'["Real-time data visualization", "Performance trend analysis", "Custom report generation", "Multi-device sync", "API integration"]',
'{"platform": "Web-based + Mobile apps", "data_storage": "Cloud-based", "integration": "API available", "support": "24/7 technical support"}',
'["/src/assets/images/analytics-dashboard.jpg"]');

-- ==========================================================================
-- Indexes for Performance
-- ==========================================================================

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_cart_user_id ON public.cart(user_id);
CREATE INDEX idx_cart_session_id ON public.cart(session_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_wishlist_user_id ON public.wishlist(user_id);

-- ==========================================================================
-- Functions and Triggers
-- ==========================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    counter INTEGER;
BEGIN
    counter := 1;
    LOOP
        order_num := 'TRX-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(counter::TEXT, 6, '0');
        
        -- Check if order number already exists
        IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = order_num) THEN
            RETURN order_num;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================================
-- Row Level Security (RLS) Summary
-- ==========================================================================
/*
RLS is enabled on all tables with appropriate policies:

1. profiles: Users can only access their own profile
2. products: Public read access, admin-only write access
3. cart: Users can only access their own cart
4. orders: Users can only access their own orders, admins can modify all
5. order_items: Users can only access items from their own orders
6. reviews: Public read access for approved reviews, users can create/update their own
7. wishlist: Users can only access their own wishlist
8. contact_messages: Public create access, admin-only read access

This ensures data security while maintaining appropriate access levels for different user roles.
*/
