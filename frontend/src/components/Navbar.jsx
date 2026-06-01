import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawer } from "../store/cartSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const bagCount = useSelector((state) =>
    state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-[0.45em] text-black">
          FASHIO
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.28em] text-neutral-600">
          <Link to="/shop" className="transition-colors hover:text-black">
            SHOP
          </Link>
          <Link to="/men" className="transition-colors hover:text-black">
            MEN
          </Link>
          <Link to="/women" className="transition-colors hover:text-black">
            WOMEN
          </Link>
        </nav>
        <button
          onClick={() => dispatch(toggleDrawer())}
          className="text-xs uppercase tracking-[0.28em] text-black"
        >
          Bag ({bagCount})
        </button>
        <Link
          to="/dashboard"
          className="text-xs uppercase tracking-[0.28em] text-black transition-opacity hover:opacity-70"
        >
          Account
        </Link>
      </div>
    </header>
  );
}
