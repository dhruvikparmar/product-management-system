import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaShoppingBag,
  FaFileInvoiceDollar,
  FaHistory,
  FaBoxes,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-6 shadow-xl">

      <h1 className="text-3xl font-bold mb-5 text-center">
        {/* Pooja Toys */}
      </h1>

      <div className="space-y-2">

        {/* Dashboard */}

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaTachometerAlt size={20} />
          <span>Dashboard</span>
        </NavLink>

        {/* Sales */}

        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaShoppingCart size={20} />
          <span>Sales</span>
        </NavLink>

        {/* Purchase */}

        <NavLink
          to="/add-product"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaShoppingBag size={20} />
          <span>Purchase</span>
        </NavLink>

        {/* Estimate */}

        <NavLink
          to="/estimate"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaFileInvoiceDollar size={20} />
          <span>Estimate</span>
        </NavLink>

        {/* Sales History */}

        <NavLink
          to="/sales-history"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaHistory size={20} />
          <span>Sales History</span>
        </NavLink>

        {/* Purchase History */}

        <NavLink
          to="/purchase-history"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaHistory size={20} />
          <span>Purchase History</span>
        </NavLink>

        {/* Estimate History */}

        <NavLink
          to="/estimate-history"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaHistory size={20} />
          <span>Estimate History</span>
        </NavLink>

        {/* Inventory */}

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <FaBoxes size={20} />
          <span>Inventory</span>
        </NavLink>

      </div>

      {/* Logout */}

      <div className="mt-2 border-t border-slate-700 pt-5">

        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 w-full">

          <FaSignOutAlt size={20} />

          <span>Logout</span>

        </button>

      </div>

    </div>
  );
};

export default Sidebar;