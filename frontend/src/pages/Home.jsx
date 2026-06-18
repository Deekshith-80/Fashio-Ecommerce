import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import api from "../api/axiosConfig";

const carouselImages = [
  "https://images.pexels.com/photos/9549295/pexels-photo-9549295.jpeg",
  "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg",
  "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg",
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const bagCount = useSelector((state) =>
    state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : data?.products || []);
      } catch (err) {
        console.error("Failed loading homepage products:", err);
        if (mounted) setError("Unable to load latest products.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product?.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-black">
      <Navbar />

      <section className="relative h-[78vh] w-full overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image} alt="Fashio campaign" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-[0.45em] text-white/80">
              Premium fashion essentials
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Quiet luxury, sharp silhouettes, and modern minimalism.
            </h1>
            <Link
              to="/shop"
              className="w-fit border border-white bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.3em] text-black transition-all duration-300 hover:bg-black hover:text-white"
            >
              SHOP THE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-black/10 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            {["All", "Men", "Women"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.25em] transition-all duration-300 ${
                  activeCategory === category
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black hover:border-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="text-xs uppercase tracking-[0.28em] text-neutral-600">
            Bag ({bagCount})
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8 max-w-7xl mx-auto py-12">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-sm text-neutral-500">
              Loading products...
            </div>
          ) : filteredProducts.length ? (
            filteredProducts.map((product) => {
              const productId = product?.id || product?._id;

              return (
              <article
                key={productId}
                className="group overflow-hidden border border-black/10 bg-white"
              >
                <Link to={`/product/${productId}`} className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="h-[340px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <button className="absolute bottom-0 left-0 right-0 translate-y-full bg-black py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-transform duration-300 group-hover:translate-y-0">
                      ADD TO BAG
                    </button>
                  </div>
                  <div className="space-y-2 p-5">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                      {product?.category}
                    </p>
                    <h3 className="text-lg font-medium text-black">{product?.name}</h3>
                    <p className="text-sm text-neutral-500">${product?.price}</p>
                  </div>
                </Link>
              </article>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-sm text-neutral-500">
              {error || "No products available."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
