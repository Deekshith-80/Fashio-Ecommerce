import { useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/cartSlice";
import { addOrder } from "../store/ordersSlice";

const inputClass =
  "w-full border border-gray-300 focus:border-black outline-none px-4 py-3 transition-colors bg-white";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
  });

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
  const grandTotal = totals.grandTotal;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePlaceOrder = (event) => {
    event?.preventDefault?.();
    if (!cartItems.length || loading) return;

    setLoading(true);
    const name = form.fullName || "Deekshith D.";
    const address = form.address;
    const city = form.city;
    const postalCode = form.postalCode;
    const uniqueId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderPayload = {
      orderId: uniqueId,
      items: cartItems,
      total: grandTotal,
      shippingDetails: { name, address, city, postalCode },
      status: "PROCESSING",
      date: new Date(),
    };

    const simulatedOrder = {
      id: uniqueId,
      items: cartItems,
      total: grandTotal,
      shippingDetails: { name, address, city, postalCode },
      status: "PROCESSING",
      date: new Date(),
    };

    const saveOrder = async () => {
      try {
        // Send the order details to your Express backend endpoint
        const response = await axios.post(
          "http://localhost:5000/api/orders",
          orderPayload,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token") || ""}`,
            },
          },
        );

        if (response.status === 201 || response.status === 200) {
          // ONLY if the backend successfully writes to MongoDB, update frontend state
          dispatch(addOrder(response.data));
          dispatch(clearCart());
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Network Link Failed:", error);
        alert(
          "Network Connection Error! Check your backend terminal log for CORS or endpoint mismatch flags.",
        );
      } finally {
        setLoading(false);
      }
    };

    void saveOrder();
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
