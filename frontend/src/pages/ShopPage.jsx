import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { addToCart, toggleDrawer } from "../store/cartSlice";
import api from "../api/axiosConfig";
import { products as fallbackProducts } from "../utils/productsData";

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("low");
  const [products, setProducts] = useState(fallbackProducts);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : data?.products || fallbackProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (mounted) {
          setError("Live inventory unavailable. Showing cached catalog.");
          setProducts(fallbackProducts);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    const result = products.filter((product) => {
      const productName = (product?.name || "").toLowerCase();
      const productDescription = (product?.description || "").toLowerCase();
      const matchesCategory = category === "All" || product?.category === category;
      const matchesQuery =
        !query ||
        productName.includes(query) ||
        productDescription.includes(query);

      return matchesCategory && matchesQuery;
    });

    return [...result].sort((a, b) =>
      sortOrder === "low" ? a.price - b.price : b.price - a.price,
    );
  }, [category, searchTerm, sortOrder, products]);

  const handleAddToBag = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || product.image,
        quantity: 1,
      }),
    );
    dispatch(toggleDrawer());
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-black">
      <Navbar />

      <section className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12">
        <aside className="md:w-1/4">
          <div className="sticky top-24 space-y-8 border border-black/10 bg-white p-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.45em] text-neutral-500">
                Search
              </p>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search hats, jackets, glasses, shirts..."
                className="mt-4 w-full border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.45em] text-neutral-500">
                Category
              </p>
              <div className="mt-4 space-y-2">
                {["All", "Men", "Women"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`flex w-full items-center justify-between border px-4 py-3 text-xs uppercase tracking-[0.3em] transition-colors ${
                      category === item
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black hover:border-black"
                    }`}
                  >
                      <span>{item}</span>
                      <span>{category === item ? "Active" : ""}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.45em] text-neutral-500">
                Sort
              </p>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="mt-4 w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              >
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="md:w-3/4">
          <div className="flex items-end justify-between border-b border-black/10 pb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.45em] text-neutral-500">
                Shop
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">Curated collection</h1>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              {filteredProducts.length} items
            </p>
          </div>
          {error ? <p className="mt-4 text-sm text-neutral-500">{error}</p> : null}

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
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
                      className="h-[360px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleAddToBag(product);
                      }}
                      className="absolute bottom-0 left-0 right-0 translate-y-full bg-black py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-transform duration-300 group-hover:translate-y-0"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                    <div className="space-y-2 p-5">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                        {product?.category} / {product?.type}
                      </p>
                      <h3 className="text-lg font-semibold tracking-tight text-black">
                        {product?.name}
                      </h3>
                      <p className="text-sm text-neutral-500">${product?.price}</p>
                    </div>
                  </Link>
              </article>
              );
            })}
          </div>
        </main>
      </section>
    </div>
  );
}
