import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawer, updateQuantity } from "../store/cartSlice";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, isDrawerOpen } = useSelector((state) => state.cart);
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
        onClick={() => dispatch(toggleDrawer())}
      />

      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 flex flex-col transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <h2 className="text-xs uppercase tracking-[0.35em] text-black">Shopping Bag</h2>
          <button
            onClick={() => dispatch(toggleDrawer())}
            className="text-xs uppercase tracking-[0.28em] text-neutral-500"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
          {cartItems.length === 0 ? (
            <p className="text-sm text-neutral-500">Your bag is currently empty.</p>
          ) : (
            cartItems.map((item) => (
              <article key={`${item.id}-${item.size || "default"}`} className="flex gap-4 border-b border-black/10 pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-20 rounded-md object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-black">{item.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Size {item.size || "M"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-black">${item.price}</p>
                  </div>

                  <div className="mt-4 inline-grid grid-cols-3 overflow-hidden border border-black/10">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            size: item.size,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                      className="px-3 py-2 text-sm transition-colors hover:bg-black hover:text-white"
                    >
                      -
                    </button>
                    <div className="flex items-center justify-center border-x border-black/10 text-sm">
                      {item.quantity}
                    </div>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            size: item.size,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }
                      className="px-3 py-2 text-sm transition-colors hover:bg-black hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-6 border-t border-black/10 pt-4">
          <p className="text-sm text-black">Total: ${total}</p>
        </div>

        <button
          onClick={() => {
            dispatch(toggleDrawer());
            navigate("/checkout");
          }}
          className="mt-4 w-full bg-black px-4 py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-neutral-800"
        >
          PROCEED TO CHECKOUT
        </button>
      </aside>
    </>
  );
}
