import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { clearCart } from "../store/cartSlice";
import { addOrder } from "../store/ordersSlice";

const inputClass =
  "w-full border border-gray-300 focus:border-black outline-none px-4 py-3 transition-colors bg-white";

const RAZORPAY_CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SymOmUg6RB2DZr";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_SCRIPT}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    let mounted = true;

    const initScript = async () => {
      const isReady = await loadRazorpayScript();
      if (mounted) {
        setScriptReady(isReady);
      }
    };

    void initScript();

    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    );
    const shipping = subtotal > 0 ? (subtotal >= 250 ? 0 : 15) : 0;
    return {
      subtotal,
      shipping,
      grandTotal: subtotal + shipping,
    };
  }, [cartItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createRazorpayOrder = async () => {
    const { data } = await api.post("/orders/razorpay", {
      products: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
      })),
      totalAmount: totals.grandTotal,
    });

    return data;
  };

  const verifyPayment = async (response) => {
    const { data } = await api.post("/orders/verify", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    return data;
  };

  const handlePlaceOrder = async (event) => {
    event?.preventDefault?.();

    if (!cartItems.length || loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const isScriptReady = scriptReady || (await loadRazorpayScript());

      if (!isScriptReady || !window.Razorpay) {
        throw new Error("Razorpay checkout failed to load.");
      }

      const createdOrder = await createRazorpayOrder();
      const razorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: createdOrder.amount,
        currency: createdOrder.currency || "INR",
        name: "Fashio",
        description: "Secure checkout",
        order_id: createdOrder.order_id,
        prefill: {
          name: form.fullName,
          email: form.email,
        },
        notes: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        theme: {
          color: "#111111",
        },
        handler: async (response) => {
          try {
            const verification = await verifyPayment(response);
            dispatch(addOrder(verification.order));
            dispatch(clearCart());
            navigate("/dashboard");
          } catch (verifyError) {
            setError(
              verifyError?.response?.data?.message ||
                verifyError.message ||
                "Payment verification failed.",
            );
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.on("payment.failed", (response) => {
        setError(
          response?.error?.description ||
            "Payment failed. Please try again using the Razorpay sandbox modal.",
        );
        setLoading(false);
      });
      razorpay.open();
      setLoading(false);
    } catch (orderError) {
      setError(
        orderError?.response?.data?.message ||
          orderError.message ||
          "Unable to start Razorpay checkout.",
      );
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 border border-black bg-white px-8 py-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-black border-t-transparent" />
            <p className="text-xs uppercase tracking-[0.35em] text-black">Placing Order</p>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-gray-500">Checkout</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
              Shipping and Billing
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Full Name"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Email"
              required
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass}
              placeholder="Address"
              required
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="City"
                required
              />
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className={inputClass}
                placeholder="Postal Code"
                required
              />
            </div>
            {error ? (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        </form>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 border border-gray-300 bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-[0.35em] text-gray-500">Order Summary</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-black">
                {cartItems.length} items
              </span>
            </div>

            <div className="mt-8 space-y-5 border-t border-gray-200 pt-6">
              {cartItems.length ? (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size || "one"}`} className="flex gap-4">
                    <div className="h-20 w-16 overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-black">{item.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gray-500">
                            Size {item.size || "N/A"}
                          </p>
                        </div>
                        <p className="text-sm text-black">
                          ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-400">
                        Qty {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Your cart is currently empty.</p>
              )}
            </div>

            <div className="mt-8 space-y-3 border-t border-gray-200 pt-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-black">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-black">
                  {totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-medium">
                <span className="text-black">Grand Total</span>
                <span className="text-black">${totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading || !cartItems.length}
              className="mt-8 w-full bg-black px-4 py-4 text-xs font-medium uppercase tracking-[0.35em] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              PLACE ORDER
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
