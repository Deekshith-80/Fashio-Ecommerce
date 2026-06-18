import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { logout, setCredentials } from "../store/authSlice";
import { setOrders } from "../store/ordersSlice";

const timelineSteps = [
  { label: "Processing", active: true },
  { label: "Shipped", active: true },
  { label: "Delivered", active: false },
];

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const { user, token } = useSelector((state) => state.auth);
  const [orders, setOrdersState] = useState([]);
  const [ordersError, setOrdersError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const currentUser = user || storedUser || {};
  const authToken = token || localStorage.getItem("token") || "";

  const displayName = useMemo(
    () => currentUser?.name || "Member",
    [currentUser?.name],
  );

  useEffect(() => {
    setProfileForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
    });
  }, [currentUser?.address, currentUser?.email, currentUser?.name, currentUser?.phone]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersError("");
        const response = await api.get("/orders/user");
        const orderList = Array.isArray(response.data)
          ? response.data
          : response.data?.orders || [];

        dispatch(setOrders(orderList));
        setOrdersState(orderList);
      } catch (err) {
        setOrdersError(err?.response?.data?.message || "Failed to fetch your recent orders.");
        console.error("Failed to fetch dashboard orders:", err);
      }
    };

    fetchOrders();
  }, [dispatch]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    try {
      const { data } = await api.put("/user/profile", profileForm);
      const updatedUser = data.user;

      dispatch(
        setCredentials({
          user: updatedUser,
          token: authToken,
        }),
      );

      setProfileSuccess("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setProfileError(
        err?.response?.data?.message || "Unable to update your profile right now.",
      );
    }
  };

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
              Welcome back, {displayName}
            </h1>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="border border-black px-4 py-2 text-xs uppercase tracking-wider transition-colors duration-300 hover:bg-black hover:text-white"
          >
            LOG OUT
          </button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
          Review your orders, update your profile, and keep your account activity in one
          refined workspace.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-400">
                  Account Profile
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage the name, email, phone number, and address linked to your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="border border-black px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-black hover:text-white"
              >
                {isEditing ? "Close Edit" : "Edit Profile"}
              </button>
            </div>

            {!isEditing ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-black">Name: {currentUser?.name || "Member"}</p>
                <p className="text-sm text-gray-600">Email: {currentUser?.email || ""}</p>
                <p className="text-sm text-gray-600">
                  Phone Number: {currentUser?.phone || "Not added yet"}
                </p>
                <p className="text-sm text-gray-600">
                  Address: {currentUser?.address || "Not added yet"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleProfileSave} className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
                      Name
                    </span>
                    <input
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-black"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
                      Email
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-black"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
                    Phone Number
                  </span>
                  <input
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-black"
                    placeholder="Enter phone number"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
                    Address
                  </span>
                  <textarea
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    rows="4"
                    className="border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-black"
                    placeholder="Enter your address"
                  />
                </label>

                {profileError ? (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {profileError}
                  </div>
                ) : null}
                {profileSuccess ? (
                  <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {profileSuccess}
                  </div>
                ) : null}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="border border-black bg-black px-4 py-3 text-xs font-medium uppercase tracking-[0.3em] text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <h3 className="text-xs uppercase tracking-widest text-gray-400">Signed In</h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-black">
                Name: {currentUser?.name || "Member"}
              </p>
              <p className="text-sm text-gray-600">Email: {currentUser?.email || ""}</p>
            </div>
          </div>
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
          {ordersError ? <p className="text-sm text-neutral-500">{ordersError}</p> : null}
          {orders.length === 0 ? (
            <article className="border border-gray-300 bg-white p-5">
              <p className="text-sm text-neutral-500">You have no recent orders.</p>
            </article>
          ) : (
            orders.map((order) => {
              const orderLabel = order.razorpayOrderId
                ? order.razorpayOrderId.slice(-8).toUpperCase()
                : order._id;
              const placedOn = order.createdAt || order.updatedAt;

              return (
              <article key={order._id || order.id} className="border border-gray-300 bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">
                      {orderLabel || "ORD-UNKNOWN"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gray-500">
                      {placedOn ? new Date(placedOn).toISOString() : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    {(() => {
                      const displayPrice = order.totalAmount
                        ? Number(order.totalAmount).toFixed(2)
                        : "0.00";

                      return <p className="text-sm text-black">${displayPrice}</p>;
                    })()}
                    <span className="border border-black px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-black">
                      {order.status}
                    </span>
                  </div>
                </div>
              </article>
              );
            })
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
                      step.label === "Processing" && orders.length > 0
                        ? "border-black bg-black"
                        : step.active
                          ? "border-black bg-black"
                          : "border-gray-300 bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        step.label === "Processing" && orders.length > 0
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
