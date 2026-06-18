import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axiosConfig";
import { addToCart } from "../store/cartSlice";

const ProductDetail = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const cleanId = id && id.includes(":") ? id.split(":")[0] : id;

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${cleanId}`);
        if (!mounted) return;
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product detail:", err);
        if (mounted) setError("Product not found or failed to load.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [cleanId]);

  const handleAddToBag = () => {
    dispatch(
      addToCart({
        ...product,
        image: product.imageUrl || product.image,
        size: selectedSize,
        quantity: 1,
      }),
    );

    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-sm tracking-widest text-gray-500 uppercase mb-4">
          {error || "Product Not Found"}
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="border border-black px-6 py-2 text-xs uppercase tracking-wider"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div className="aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center">
        <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          {product.category} Collection
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-black mb-4">{product.name}</h1>
        <p className="text-xl font-medium text-gray-900 mb-8">${product.price}.00</p>

        <div className="mb-8">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Select Size
          </h3>
          <div className="flex gap-3">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border text-xs px-4 py-2 uppercase tracking-wider transition-all ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-black hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToBag}
          className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest font-medium hover:bg-gray-900 transition-colors"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
