// Demo estático: cargamos datos desde archivos JSON en /public/data
// Mantiene las mismas interfaces para compatibilidad con el resto de la app

async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
  return res.json();
}

// Tipos de datos
export interface ProductTag {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  products_count: number;
}

// NUEVOS TIPOS: Ingredientes
export interface Ingredient {
  id: number;
  name: string;
  is_active: boolean;
}

export interface ProductIngredient {
  id?: number;
  ingredient: Ingredient; // cuando viene del API
  ingredient_id?: number; // para envíos
  default_included: boolean;
  extra_cost: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  category_name: string;
  category_icon: string;
  image: string;
  image_url: string;
  is_active: boolean;
  tags: ProductTag[];
  product_ingredients?: ProductIngredient[]; // NUEVO
  created_at: string;
  updated_at: string;
}

// Nuevos tipos para contenido dinámico
export interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
  background_image: string;
  background_image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_1: string;
  image_1_url: string;
  image_2: string;
  image_2_url: string;
  years_experience: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  image: string;
  image_url: string;
  preparation_time: string;
  servings: string;
  rating: number;
  reviews_count: number;
  discount_amount: number;
  discount_percentage_calculated: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos para órdenes
export interface OrderItemExtra {
  id: number;
  ingredient: number;
  ingredient_name: string;
  quantity: number;
  unit_price: number;  // Cambiado de extra_cost a unit_price
  total_price: number;
}

export interface OrderItemRequest {
  id?: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  extras: OrderItemExtra[];
}

export interface Order {
  id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  delivery_notes?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_street: string;
  delivery_number: string;
  delivery_apartment?: string;
  delivery_city: string;
  delivery_region: string;
  notes?: string;
  items: Array<{
    product_id: string;
    quantity: string;
    extras: { [ingredientId: string]: string };
    included_ingredients?: string[];  // Nuevo campo
  }>;
}

export interface OrderItemIngredient {
  id: number;
  ingredient: number;
  ingredient_name: string;
  is_included: boolean;
  was_default: boolean;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  extras: OrderItemExtra[];
  ingredients: OrderItemIngredient[];  // Nuevo campo
}

// Servicios de productos
export const getProducts = async (category = 'all'): Promise<Product[]> => {
  const products = await loadJSON<Product[]>(`/data/products.json`);
  const cats = await loadJSON<Category[]>(`/data/categories.json`);
  const withCat = products.map(p => {
    const c = cats.find(c => c.id === p.category);
    return {
      ...p,
      category_name: c?.name || 'General',
      category_icon: c?.icon || '🍽️',
    } as Product;
  });
  const filtered = category === 'all'
    ? withCat.filter(p => p.is_active)
    : withCat.filter(p => p.is_active && String(p.category) === String(category));
  // Limitar a 4 productos para la demo
  return filtered.slice(0, 4);
};

export const getProduct = async (id: string): Promise<Product> => {
  const products = await getProducts('all');
  const found = products.find(p => String(p.id) === String(id));
  if (!found) throw new Error('Producto no encontrado');
  return found;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const featuredIds = await loadJSON<number[]>(`/data/featured_products.json`);
    const products = await getProducts('all');
    return products.filter(p => featuredIds.includes(p.id));
  } catch {
    const products = await getProducts('all');
    return products.slice(0, 4);
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const q = query.trim().toLowerCase();
  const products = await getProducts('all');
  if (!q) return products;
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.name.toLowerCase().includes(q))
  );
};

export const createProduct = async (_productData: FormData): Promise<Product> => {
  throw new Error('Demo estática: creación de productos no disponible');
};

export const updateProduct = async (_id: number | string, _productData: FormData): Promise<Product> => {
  throw new Error('Demo estática: actualización de productos no disponible');
};

export const deleteProduct = async (_id: number | string): Promise<boolean> => {
  throw new Error('Demo estática: eliminación de productos no disponible');
};

// Servicios de categorías
export const getCategories = async (): Promise<Category[]> => {
  const cats = await loadJSON<Category[]>(`/data/categories.json`);
  const products = await loadJSON<Product[]>(`/data/products.json`);
  return cats.map(c => ({
    ...c,
    products_count: products.filter(p => p.category === c.id && p.is_active).length,
  }));
};

export const getCategory = async (id: string): Promise<Category> => {
  const cats = await getCategories();
  const found = cats.find(c => String(c.id) === String(id));
  if (!found) throw new Error('Categoría no encontrada');
  return found;
};

export const getCategoryProducts = async (id: string): Promise<Product[]> => {
  const products = await getProducts('all');
  return products.filter(p => String(p.category) === String(id));
};

export const createCategory = async (_categoryData: Partial<Category>): Promise<Category> => {
  throw new Error('Demo estática: creación de categorías no disponible');
};

export const updateCategory = async (_id: string, _categoryData: Partial<Category>): Promise<Category> => {
  throw new Error('Demo estática: actualización de categorías no disponible');
};

export const deleteCategory = async (_id: string): Promise<boolean> => {
  throw new Error('Demo estática: eliminación de categorías no disponible');
};

// Servicios de etiquetas/tags
export const getProductTags = async (): Promise<ProductTag[]> => {
  try {
    return await loadJSON<ProductTag[]>(`/data/tags.json`);
  } catch {
    const products = await loadJSON<Product[]>(`/data/products.json`);
    const map = new Map<number, ProductTag>();
    products.forEach(p => p.tags.forEach(t => map.set(t.id, t)));
    return Array.from(map.values());
  }
};

export const getProductTag = async (id: string): Promise<ProductTag> => {
  const tags = await getProductTags();
  const found = tags.find(t => String(t.id) === String(id));
  if (!found) throw new Error('Tag no encontrado');
  return found;
};

export const createProductTag = async (tagData: Partial<ProductTag>): Promise<ProductTag> => {
  throw new Error('Demo estática: creación de tags no disponible');
};

export const updateProductTag = async (_id: string, _tagData: Partial<ProductTag>): Promise<ProductTag> => {
  throw new Error('Demo estática: actualización de tags no disponible');
};

export const deleteProductTag = async (id: string): Promise<boolean> => {
  throw new Error('Demo estática: eliminación de tags no disponible');
};

// Servicios de ingredientes
export const getIngredients = async (): Promise<Ingredient[]> => {
  try {
    return await loadJSON<Ingredient[]>(`/data/ingredients.json`);
  } catch {
    const products = await loadJSON<Product[]>(`/data/products.json`);
    const map = new Map<number, Ingredient>();
    products.forEach(p => (p.product_ingredients || []).forEach(pi => map.set(pi.ingredient.id, pi.ingredient)));
    return Array.from(map.values());
  }
};

export const createIngredient = async (_data: Partial<Ingredient>): Promise<Ingredient> => {
  throw new Error('Demo estática: creación de ingredientes no disponible');
};

export const updateIngredient = async (_id: number | string, _data: Partial<Ingredient>): Promise<Ingredient> => {
  throw new Error('Demo estática: actualización de ingredientes no disponible');
};

export const deleteIngredient = async (_id: number | string): Promise<boolean> => {
  throw new Error('Demo estática: eliminación de ingredientes no disponible');
};

// Calcular precio en backend
export const calculateProductPrice = async (productId: number, extraIds: number[]): Promise<{ base_price: number; extras_total: number; total: number; extra_ids: number[] }> => {
  const product = await getProduct(String(productId));
  const base = Number(product.price) || 0;
  const extras = (product.product_ingredients || [])
    .filter(pi => extraIds.includes(pi.ingredient.id))
    .reduce((sum, pi) => sum + Number(pi.extra_cost || 0), 0);
  const total = base + extras;
  return { base_price: base, extras_total: extras, total, extra_ids: extraIds };
};

// Servicios para contenido dinámico
export const getHeroSection = async (): Promise<HeroSection> => {
  return loadJSON<HeroSection>(`/data/hero.json`);
};

export const getAboutSection = async (): Promise<AboutSection> => {
  return loadJSON<AboutSection>(`/data/about.json`);
};

export const getContactInfo = async (): Promise<ContactInfo> => {
  return loadJSON<ContactInfo>(`/data/contact.json`);
};

export const getFeaturedProduct = async (): Promise<FeaturedProduct> => {
  return loadJSON<FeaturedProduct>(`/data/featured.json`);
};

// Servicios CRUD para contenido dinámico (admin)
export const createHeroSection = async (_data: FormData): Promise<HeroSection> => {
  throw new Error('Demo estática: no se puede crear Hero');
};

export const updateHeroSection = async (_id: string, _data: FormData): Promise<HeroSection> => {
  throw new Error('Demo estática: no se puede actualizar Hero');
};

export const createAboutSection = async (_data: FormData): Promise<AboutSection> => {
  throw new Error('Demo estática: no se puede crear About');
};

export const updateAboutSection = async (_id: string, _data: FormData): Promise<AboutSection> => {
  throw new Error('Demo estática: no se puede actualizar About');
};

export const createContactInfo = async (_data: Partial<ContactInfo>): Promise<ContactInfo> => {
  throw new Error('Demo estática: no se puede crear Contact');
};

export const updateContactInfo = async (_id: string, _data: Partial<ContactInfo>): Promise<ContactInfo> => {
  throw new Error('Demo estática: no se puede actualizar Contact');
};

export const createFeaturedProduct = async (_data: FormData): Promise<FeaturedProduct> => {
  throw new Error('Demo estática: no se puede crear destacado');
};

export const updateFeaturedProduct = async (_id: string, _data: FormData): Promise<FeaturedProduct> => {
  throw new Error('Demo estática: no se puede actualizar destacado');
};

// Servicios de órdenes
function getOrdersFromStorage(): Order[] | null {
  try {
    const raw = localStorage.getItem('orders_override');
    return raw ? JSON.parse(raw) as Order[] : null;
  } catch {
    return null;
  }
}

function saveOrdersToStorage(orders: Order[]) {
  try {
    localStorage.setItem('orders_override', JSON.stringify(orders));
  } catch {}
}

async function loadBaseOrders(): Promise<Order[]> {
  const base = await loadJSON<Order[]>(`/data/orders.json`);
  const override = getOrdersFromStorage();
  return override ?? base;
}

export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  // Simular creación de orden y devolver un objeto con totales
  const products = await getProducts('all');
  const items = orderData.items.map((i, idx) => {
    const p = products.find(p => String(p.id) === String(i.product_id));
    const unit = p ? Number(p.price) : 0;
    const extrasTotal = Object.entries(i.extras || {}).reduce((sum, [ingredientId, qtyStr]) => {
      const ingredientIdNum = Number(ingredientId);
      const qty = Number(qtyStr || 0);
      if (!p || !qty) return sum;
      const pi = (p.product_ingredients || []).find(pi => pi.ingredient.id === ingredientIdNum);
      if (!pi) return sum;
      return sum + Number(pi.extra_cost || 0) * qty;
    }, 0);
    const unit_price = unit + extrasTotal;
    const quantity = Number(i.quantity || 1);
    return {
      id: idx + 1,
      product: Number(i.product_id),
      product_name: p?.name || 'Producto',
      product_description: p?.description || '',
      quantity,
      unit_price,
      total_price: unit_price * quantity,
      extras: [],
      ingredients: [],
    } as OrderItem;
  });
  const total_amount = items.reduce((s, it) => s + it.total_price, 0);
  const order: Order = {
    id: Math.floor(Math.random() * 100000),
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    customer_email: orderData.customer_email,
    delivery_address: `${orderData.delivery_street} ${orderData.delivery_number}${orderData.delivery_apartment ? ', ' + orderData.delivery_apartment : ''}, ${orderData.delivery_city}, ${orderData.delivery_region}`,
    delivery_notes: orderData.notes,
    status: 'pending',
    total_amount,
    items,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return order;
};

export const getOrders = async (status?: string): Promise<Order[]> => {
  const orders = await loadBaseOrders();
  if (!status || status === 'all') return orders;
  return orders.filter(o => o.status === status);
};

export const getOrder = async (id: number): Promise<Order> => {
  const orders = await loadBaseOrders();
  const found = orders.find(o => o.id === id);
  if (!found) throw new Error('Pedido no encontrado');
  return found;
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order> => {
  const base = await loadBaseOrders();
  const idx = base.findIndex(o => o.id === id);
  if (idx === -1) throw new Error('Pedido no encontrado');
  const updated: Order = { ...base[idx], status, updated_at: new Date().toISOString() };
  const next = [...base];
  next[idx] = updated;
  saveOrdersToStorage(next);
  return updated;
};

export const deleteOrder = async (_id: number): Promise<boolean> => {
  throw new Error('Demo estática: no se puede eliminar órdenes');
};