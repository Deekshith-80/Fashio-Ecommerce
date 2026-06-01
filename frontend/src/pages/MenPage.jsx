import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axiosConfig";
import { products as fallbackProducts } from "../utils/productsData";

export default function MenPage() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data?.products || fallbackProducts;
        setProducts(list.filter((product) => product?.category === "Men"));
      } catch (error) {
        console.error("Failed to fetch men's products:", error);
        if (mounted) {
          setProducts(fallbackProducts.filter((product) => product?.category === "Men"));
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const menProducts = useMemo(
    () => products.filter((product) => product?.category === "Men"),
    [products],
  );

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="border-b border-black/10 pb-8">
          <p className="text-[11px] uppercase tracking-[0.5em] text-neutral-500">Curated Edit</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            MEN&apos;S ESSENTIALS
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 px-8 py-12 sm:grid-cols-2 md:grid-cols-4">
          {menProducts.map((product) => (
            <article key={product.id} className="group overflow-hidden border border-black/10 bg-white">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[340px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <button className="absolute bottom-0 left-0 right-0 translate-y-full bg-black py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-transform duration-300 group-hover:translate-y-0">
                    ADD TO BAG
                  </button>
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-medium text-black">{product.name}</h3>
                  <p className="text-sm text-neutral-500">${product.price}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
