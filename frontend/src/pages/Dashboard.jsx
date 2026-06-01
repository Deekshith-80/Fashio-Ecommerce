import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { setOrders } from "../store/ordersSlice";

const timelineSteps = [
  { label: "Processing", active: true },
  { label: "Shipped", active: true },
  { label: "Delivered", active: false },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { ordersList } = useSelector((state) => state.orders);
  const [orders, setOrdersState] = useState([]);
  const [error, setError] = useState("");

  const displayName = useMemo(() => user?.name || "Member", [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 1. Grab the secure token string from the browser storage shell
        const token = localStorage.getItem("token");

        // 2. Pass the token directly into the request headers config object
        const response = await axios.get("http://localhost:5000/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 3. Dispatch the verified response collection array straight to your Redux slice
        dispatch(setOrders(response.data));
        setOrdersState(Array.isArray(response.data) ? response.data : response.data?.orders || []);
      } catch (err) {
        console.error("Failed to fetch dashboard orders:", err);
      }
    };

    fetchOrders();
  }, [dispatch]);

  const activeOrders = orders.length ? orders : ordersList;
  const showLoadError = error && activeOrders.length === 0;

  return (
    <main className="max-w-5xl mx-auto px-8 py-12 mt-16">
      <section className="border-b border-black/10 pb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to="/" className="text-lg font-semibold tracking-[0.45em] text-black">
              FASHIO
            </Link>
            <p className="text-[11px] uppercase tracking-[0.5em] text-gray-500">Dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
              Welcome back, {user?.name || "Member"}
            </h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              dispatch(logout());
              navigate("/login");
            }}
            className="border border-black px-4 py-2 text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300"
          >
            LOG OUT
          </button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
          Review your orders, monitor the latest shipment progress, and keep your account
          activity in one refined workspace.
        </p>
        <div className="border border-gray-200 p-6 my-6 max-w-md">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            Account Profile
          </h3>
          <p className="text-sm font-medium text-black">
            Name: {user?.name || "Deekshith D."}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Email: {user?.email || "deekshith9099@gmail.com"}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Past Orders</p>
            <h2 className="mt-3 text-2xl font-medium text-black">Recent activity</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {showLoadError ? <p className="text-sm text-neutral-500">{error}</p> : null}
          {activeOrders.length === 0 ? (
            <article className="border border-gray-300 bg-white p-5">
              <p className="text-sm text-neutral-500">You have no recent orders.</p>
            </article>
          ) : (
            activeOrders.map((order) => (
              <article key={order._id || order.id} className="border border-gray-300 bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">
                      {order.orderId || order.id || "ORD-UNKNOWN"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gray-500">
                      {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    {(() => {
                      const displayPrice = order.total
                        ? order.total > 1000
                          ? (order.total / 100).toFixed(2)
                          : Number(order.total).toFixed(2)
                        : "0.00";

                      return <p className="text-sm text-black">${displayPrice}</p>;
                    })()}
                    <span className="border border-black px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-black">
                      {order.status}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-12 border border-gray-300 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Premium Tracking</p>
            <h2 className="mt-3 text-2xl font-medium text-black">Order timeline</h2>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="flex flex-1 items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      step.label === "Processing" && activeOrders.length > 0
                        ? "border-black bg-black"
                        : step.active
                          ? "border-black bg-black"
                          : "border-gray-300 bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        step.label === "Processing" && activeOrders.length > 0
                          ? "bg-white"
                          : step.active
                            ? "bg-white"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>
                  {index < timelineSteps.length - 1 ? (
                    <div className="hidden lg:block h-px w-24 bg-gray-300 mt-5" />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{step.label}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-500">
                    {step.active ? "In progress" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
