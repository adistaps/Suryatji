import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import PageHeader from '@/components/layout/PageHeader';
import { fetchProductBySlug, fetchVariantsByProductId, fetchProducts } from '@/lib/products';
import type { Product, ProductVariant } from '@/types';

const grindOptions = [
  { value: 'whole_bean', label: 'Whole Bean' },
  { value: 'coarse', label: 'Coarse' },
  { value: 'medium', label: 'Medium' },
  { value: 'fine', label: 'Fine' },
  { value: 'espresso', label: 'Espresso' },
];

const weightOptions = ['250g', '500g', '1kg'];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [relatedVariants, setRelatedVariants] = useState<Record<string, ProductVariant[]>>({});
  const [loading, setLoading] = useState(true);

  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [selectedGrind, setSelectedGrind] = useState('whole_bean');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadDetail = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const prod = await fetchProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          
          const [vars, allProds] = await Promise.all([
            fetchVariantsByProductId(prod.id),
            fetchProducts()
          ]);
          setVariants(vars);

          // Get related products (same category, max 3)
          const rel = allProds
            .filter(p => p.id !== prod.id && p.category === prod.category)
            .slice(0, 3);
          setRelated(rel);

          // Get variants for related products
          const relVarsMap: Record<string, ProductVariant[]> = {};
          await Promise.all(
            rel.map(async (rp) => {
              const rVars = await fetchVariantsByProductId(rp.id);
              relVarsMap[rp.id] = rVars;
            })
          );
          setRelatedVariants(relVarsMap);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 text-center py-20 text-gray-500">
        Loading product detail...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold text-[#1E1A17]">Product not found</h1>
        <Link to="/shop" className="text-[#4A7C3A] mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const selectedVariant = variants.find(
    v => v.weight === selectedWeight && v.grindType === selectedGrind
  ) || variants[0];

  const images = [
    product.image,
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop',
  ];

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
    }
  };

  return (
    <div>
      <PageHeader
        title={product.name}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Products', path: '/shop' },
          { label: product.name },
        ]}
        backgroundImage={product.image}
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-[#F9F6F1] rounded-xl overflow-hidden mb-4">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-[#4A7C3A]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i <= product.rating ? 'text-[#4A7C3A] fill-[#4A7C3A]' : 'text-[#A89782]'}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#8B6F4E]">({product.reviewCount} customer reviews)</span>
              </div>

              <h1 className="text-[#1E1A17] font-bold text-3xl" style={{ fontFamily: '"Playfair Display", serif' }}>
                {product.name}
              </h1>

              <p className="text-[#4A7C3A] font-bold text-2xl mt-3">
                Rp {selectedVariant ? Math.round(selectedVariant.price).toLocaleString('id-ID') : '0'}
              </p>

              <p className="text-[#8B6F4E] mt-5 leading-relaxed">{product.description}</p>

              {/* Weight Selector */}
              <div className="mt-6">
                <label className="text-sm font-semibold text-[#1E1A17] mb-2 block">Weight</label>
                <div className="flex gap-2">
                  {weightOptions.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selectedWeight === w
                          ? 'bg-[#4A7C3A] text-white border-[#4A7C3A]'
                          : 'bg-white text-[#1E1A17] border-gray-200 hover:border-[#4A7C3A]'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grind Selector */}
              <div className="mt-4">
                <label className="text-sm font-semibold text-[#1E1A17] mb-2 block">Grind Type</label>
                <div className="flex flex-wrap gap-2">
                  {grindOptions.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setSelectedGrind(g.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selectedGrind === g.value
                          ? 'bg-[#4A7C3A] text-white border-[#4A7C3A]'
                          : 'bg-white text-[#1E1A17] border-gray-200 hover:border-[#4A7C3A]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <label className="text-sm font-semibold text-[#1E1A17] mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4A7C3A] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4A7C3A] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-8 bg-[#4A7C3A] text-white font-semibold py-4 rounded-full hover:bg-[#3d6b2f] transition-colors"
                disabled={!selectedVariant}
              >
                Add to Cart
              </button>

              {/* Meta */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-[#8B6F4E]">
                  <span className="font-semibold text-[#1E1A17]">Features:</span>{' '}
                  {product.features?.join(', ') || '-'}
                </p>
                <p className="text-sm text-[#8B6F4E] mt-2">
                  <span className="font-semibold text-[#1E1A17]">Tags:</span>{' '}
                  {product.tags?.join(', ') || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex gap-8 border-b border-gray-200">
              {['description', 'additional', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-[#1E1A17] border-b-2 border-[#4A7C3A]'
                      : 'text-[#8B6F4E] hover:text-[#1E1A17]'
                  }`}
                >
                  {tab === 'reviews' ? `Reviews (${product.reviewCount})` : tab}
                </button>
              ))}
            </div>
            <div className="py-8">
              {activeTab === 'description' && (
                <p className="text-[#8B6F4E] leading-relaxed max-w-3xl">
                  {product.description} Our {product.name} is carefully sourced from the finest coffee growing regions 
                  and roasted to perfection in our facility in Kledung, Temanggung. Each batch is tested for quality 
                  and consistency before packaging to ensure you receive only the best coffee experience.
                </p>
              )}
              {activeTab === 'additional' && (
                <table className="w-full max-w-lg">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-sm font-semibold text-[#1E1A17]">Weight</td>
                      <td className="py-3 text-sm text-[#8B6F4E]">{selectedWeight}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-sm font-semibold text-[#1E1A17]">Grind Options</td>
                      <td className="py-3 text-sm text-[#8B6F4E]">Whole Bean, Coarse, Medium, Fine, Espresso</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-sm font-semibold text-[#1E1A17]">Origin</td>
                      <td className="py-3 text-sm text-[#8B6F4E]">Kledung, Temanggung</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {activeTab === 'reviews' && (
                <div className="max-w-2xl">
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={14} className="text-[#4A7C3A] fill-[#4A7C3A]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#1E1A17]">Budi S.</p>
                    <p className="text-xs text-[#8B6F4E] mb-2">July 1, 2025</p>
                    <p className="text-[#8B6F4E] text-sm leading-relaxed">
                      Amazing coffee! The aroma is incredible and the taste is so smooth. Will definitely order again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2
                className="text-[#1E1A17] font-bold text-center mb-8"
                style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
              >
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rp) => {
                  const rpVars = relatedVariants[rp.id] || [];
                  const rpPrice = rp.salePrice || (rpVars.length > 0 ? rpVars[0].price : 0);
                  return (
                    <Link
                      key={rp.id}
                      to={`/shop/${rp.slug}`}
                      className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-[#F9F6F1] overflow-hidden">
                        <img
                          src={rp.image}
                          alt={rp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#1E1A17] font-semibold" style={{ fontFamily: '"Playfair Display", serif' }}>
                          {rp.name}
                        </h3>
                        <p className="text-[#4A7C3A] font-bold mt-1">
                          Rp {Math.round(rpPrice).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
