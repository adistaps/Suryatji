import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import PageHeader from '@/components/layout/PageHeader';
import { fetchProducts, fetchCategories, fetchVariantsByProductId } from '@/lib/products';
import type { Product, ProductVariant, Category } from '@/types';

function ProductCard({ product, variants }: { product: Product; variants?: ProductVariant[] }) {
  const { addToCart } = useCart();
  const defaultVariant = variants && variants.length > 0 ? variants[0] : undefined;
  const displayPrice = product.salePrice || (defaultVariant ? defaultVariant.price : 0);
  const originalPrice = defaultVariant ? defaultVariant.price : 0;

  const handleAdd = () => {
    if (defaultVariant) addToCart(product, defaultVariant, 1);
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <Link to={`/shop/${product.slug}`} className="block relative aspect-square bg-[#F9F6F1] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {product.salePrice && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center">
            sale
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); handleAdd(); }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#4A7C3A] text-white text-xs font-semibold px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3d6b2f]"
          disabled={!defaultVariant}
        >
          Add to cart
        </button>
      </Link>
      <div className="p-4">
        <div className="flex gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={12}
              className={i <= product.rating ? 'text-[#4A7C3A] fill-[#4A7C3A]' : 'text-[#A89782]'}
            />
          ))}
        </div>
        <Link to={`/shop/${product.slug}`}>
          <h3 className="text-[#1E1A17] font-semibold text-base hover:text-[#4A7C3A] transition-colors" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#4A7C3A] font-bold">Rp {Math.round(displayPrice).toLocaleString('id-ID')}</span>
          {product.salePrice && defaultVariant && (
            <span className="text-[#A89782] text-sm line-through">Rp {Math.round(originalPrice).toLocaleString('id-ID')}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [productVariants, setProductVariants] = useState<Record<string, ProductVariant[]>>({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500000]); // Max range 500k Rp
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setDbProducts(prods);
        setDbCategories(cats);

        // Fetch variants for each product
        const varsMap: Record<string, ProductVariant[]> = {};
        await Promise.all(
          prods.map(async (p) => {
            const vars = await fetchVariantsByProductId(p.id);
            varsMap[p.id] = vars;
          })
        );
        setProductVariants(varsMap);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  // Extract all tags from dbProducts
  const allTags = Array.from(new Set(dbProducts.flatMap(p => p.tags || [])));

  let filtered = dbProducts.filter(p => {
    if (categoryFilter && !p.category.toLowerCase().replace(/\s+/g, '-').includes(categoryFilter.toLowerCase())) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedTag && !p.tags?.includes(selectedTag)) return false;
    
    const vars = productVariants[p.id] || [];
    const minPrice = vars.length > 0 ? Math.min(...vars.map(v => p.salePrice || v.price)) : 0;
    if (minPrice > priceRange[1]) return false;
    return true;
  });

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => {
      const va = productVariants[a.id] || [];
      const vb = productVariants[b.id] || [];
      const priceA = a.salePrice || va[0]?.price || 0;
      const priceB = b.salePrice || vb[0]?.price || 0;
      return priceA - priceB;
    });
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => {
      const va = productVariants[a.id] || [];
      const vb = productVariants[b.id] || [];
      const priceA = a.salePrice || va[0]?.price || 0;
      const priceB = b.salePrice || vb[0]?.price || 0;
      return priceB - priceA;
    });
  }

  return (
    <div>
      <PageHeader title="All Products" breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Shop' }]} />

      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] shrink-0">
              {/* Search */}
              <div className="flex mb-8">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C3A]"
                />
                <button className="bg-[#4A7C3A] text-white px-4 rounded-r-lg hover:bg-[#3d6b2f] transition-colors">
                  <Search size={18} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-[#1E1A17] font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#4A7C3A">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Product Categories
                </h4>
                <div className="space-y-1">
                  {dbCategories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        to={`/shop?category=${cat.slug}`}
                        className="flex items-center gap-1 w-full text-left text-sm text-[#1E1A17] hover:text-[#4A7C3A] py-1.5 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h4 className="text-[#1E1A17] font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#4A7C3A">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                  Filter by Price
                </h4>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-[#4A7C3A]"
                />
                <p className="text-sm text-[#8B6F4E] mt-2">
                  Harga: Rp 0 — Rp {priceRange[1].toLocaleString('id-ID')}
                </p>
                <button
                  onClick={() => setPriceRange([0, 500000])}
                  className="mt-3 bg-[#4A7C3A] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#3d6b2f] transition-colors"
                >
                  Reset Filter
                </button>
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div>
                  <h4 className="text-[#1E1A17] font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4A7C3A">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" />
                    </svg>
                    Product Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedTag === tag
                            ? 'bg-[#4A7C3A] text-white border-[#4A7C3A]'
                            : 'bg-white text-[#8B6F4E] border-gray-200 hover:border-[#4A7C3A] hover:text-[#4A7C3A]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[#8B6F4E]">
                  {loading ? 'Loading...' : `Showing ${filtered.length} results`}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1E1A17] focus:outline-none focus:border-[#4A7C3A]"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-20 text-gray-500">Loading products from database...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} variants={productVariants[product.id]} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
