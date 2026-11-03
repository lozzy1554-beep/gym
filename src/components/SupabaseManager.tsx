import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database, Plus, Edit, Trash2, LogIn, LogOut, UserPlus, AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react';
import FxButton from './motion/FxButton';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  created_at: string;
  user_id?: string | null;
}

interface SupabaseManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseManager: React.FC<SupabaseManagerProps> = ({ isOpen, onClose }) => {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auth state
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Form state (Insert & Edit)
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1. Check user session on load
  useEffect(() => {
    if (!supabase) return;

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch products from Supabase
  const fetchProducts = async () => {
    if (!supabase) {
      // Demo mock data if Supabase keys not set yet
      setProducts([
        {
          id: '1',
          name: 'Titan Whey Isolate (2kg)',
          price: 18500,
          image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Olympic Lifting Leather Belt',
          price: 8500,
          image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
          created_at: new Date().toISOString(),
        },
      ]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch from "products" table ordered by created_at descending
      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  // 3. Insert or Update Product
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    if (!supabase) {
      setError('Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env first!');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);

      const parsedPrice = parseFloat(price);

      if (isEditing) {
        // UPDATE existing product
        const { error: updateErr } = await supabase
          .from('products')
          .update({
            name: name.trim(),
            price: parsedPrice,
            image_url: imageUrl.trim() || null,
          })
          .eq('id', isEditing);

        if (updateErr) throw updateErr;
        setSuccessMsg('Product updated successfully!');
      } else {
        // INSERT new product
        const { error: insertErr } = await supabase.from('products').insert([
          {
            name: name.trim(),
            price: parsedPrice,
            image_url: imageUrl.trim() || null,
            user_id: user?.id || null,
          },
        ]);

        if (insertErr) throw insertErr;
        setSuccessMsg('Product added successfully!');
      }

      // Reset form & reload
      setName('');
      setPrice('');
      setImageUrl('');
      setIsEditing(null);
      await fetchProducts();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save product. Ensure you are logged in if RLS requires auth.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    if (!supabase) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: deleteErr } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteErr) throw deleteErr;
      setSuccessMsg('Product deleted successfully!');
      await fetchProducts();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete. You might not have permission under RLS policies.');
    } finally {
      setLoading(false);
    }
  };

  // Edit product trigger
  const handleStartEdit = (product: Product) => {
    setIsEditing(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setImageUrl(product.image_url || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setName('');
    setPrice('');
    setImageUrl('');
  };

  // 5. Auth handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Please configure Supabase credentials in .env first.');
      return;
    }

    try {
      setAuthLoading(true);
      setError(null);
      setSuccessMsg(null);

      if (authMode === 'signup') {
        const { data, error: signupErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });
        if (signupErr) throw signupErr;
        if (data.session) {
          setSuccessMsg('Account created & logged in!');
        } else {
          setSuccessMsg('Account created! Please check your email to confirm if email confirmations are enabled.');
        }
      } else {
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (loginErr) throw loginErr;
        setSuccessMsg('Logged in successfully!');
      }

      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSuccessMsg('Signed out.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150 my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C313B] pb-4 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222630] border border-[#B6F500]/40 flex items-center justify-center text-[#B6F500]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                  Supabase Database &amp; Auth Hub
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    isSupabaseConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isSupabaseConfigured ? 'CONNECTED' : 'KEYS NEEDED IN .ENV'}
                </span>
              </div>
              <p className="text-xs text-[#A3A9B5]">
                Manage "products" table CRUD &amp; Supabase Email Auth
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#222630] text-[#A3A9B5] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 shrink-0">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="overflow-y-auto space-y-6 flex-1 pr-1">
          {/* Setup Notice if not configured */}
          {!isSupabaseConfigured && (
            <div className="p-4 rounded-xl bg-[#0F1115] border border-amber-500/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Supabase Environment Variables Setup</span>
              </div>
              <p className="text-[#A3A9B5] leading-relaxed">
                To connect your real database, add your credentials in <code>.env</code>:
              </p>
              <pre className="p-2.5 rounded bg-[#181B21] border border-[#2C313B] font-mono text-[11px] text-[#B6F500] overflow-x-auto">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
              </pre>
              <p className="text-[#A3A9B5] text-[11px]">
                Showing mock preview below so you can test the UI immediately.
              </p>
            </div>
          )}

          {/* Section 1: Supabase Auth Bar */}
          <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B] flex flex-col md:flex-row items-center justify-between gap-4">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="text-xs">
                  <span className="text-[#A3A9B5] block">Logged In As:</span>
                  <span className="font-bold text-white">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-[#222630] border border-[#2C313B] text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="w-full flex flex-col sm:flex-row items-center gap-2">
                <span className="text-xs font-bold text-[#A3A9B5] shrink-0">
                  {authMode === 'login' ? 'Login:' : 'Sign Up:'}
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full sm:w-44 px-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-white text-xs focus:border-[#B6F500] focus:outline-none"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                  className="w-full sm:w-40 px-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-white text-xs focus:border-[#B6F500] focus:outline-none"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-[#B6F500] text-[#0F1115] text-xs font-bold uppercase cursor-pointer hover:bg-[#a6de04] disabled:opacity-50"
                  >
                    {authLoading ? '...' : authMode === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-[11px] text-[#A3A9B5] hover:text-white underline cursor-pointer whitespace-nowrap"
                  >
                    {authMode === 'login' ? 'Create Account' : 'Existing User?'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section 2: Insert or Edit Form */}
          <div className="p-5 rounded-xl bg-[#0F1115] border border-[#2C313B]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#B6F500]" />
              <span>{isEditing ? 'Update Product' : 'Add New Product to Supabase'}</span>
            </h4>

            <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-[11px] text-[#A3A9B5] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Resistance Bands Set"
                  className="w-full px-3 py-2 rounded-lg bg-[#181B21] border border-[#2C313B] text-white text-xs focus:border-[#B6F500] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] text-[#A3A9B5] mb-1">Price (PKR) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full px-3 py-2 rounded-lg bg-[#181B21] border border-[#2C313B] text-white text-xs focus:border-[#B6F500] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] text-[#A3A9B5] mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-[#181B21] border border-[#2C313B] text-white text-xs focus:border-[#B6F500] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-12 flex items-center justify-end gap-2 pt-1">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-lg bg-[#222630] text-xs font-semibold text-[#A3A9B5] hover:text-white cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#B6F500] text-[#0F1115] text-xs font-bold uppercase hover:bg-[#a6de04] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update in Supabase' : 'Insert to Supabase'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Products List / Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>Products in Database ({products.length})</span>
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B6F500]" />}
              </h4>
              <button
                onClick={fetchProducts}
                className="text-xs text-[#B6F500] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            {products.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0F1115] border border-[#2C313B] text-center text-xs text-[#A3A9B5]">
                No products found. Add one above!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B] hover:border-[#B6F500]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {p.image_url ? (
                        <div className="h-32 w-full rounded-lg bg-[#181B21] overflow-hidden mb-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-full rounded-lg bg-[#181B21] flex items-center justify-center text-[#A3A9B5] text-xs mb-3">
                          No Image
                        </div>
                      )}
                      <h5 className="font-bold text-white text-sm line-clamp-1">{p.name}</h5>
                      <div className="font-mono text-xs text-[#B6F500] font-bold mt-1">
                        PKR {Number(p.price).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#A3A9B5] mt-1">
                        Added: {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2C313B] mt-3">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-1.5 rounded-lg bg-[#222630] hover:text-[#B6F500] text-[#A3A9B5] text-xs cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-[#222630] hover:text-rose-400 text-[#A3A9B5] text-xs cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
