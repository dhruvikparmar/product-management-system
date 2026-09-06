import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";

import DashboardLayout from "./layouts/DashboardLayout";
import EditProduct from "./pages/EditProduct";
import Sales from "./pages/Sales";
import PurchaseHistory from "./pages/PurchaseHistory";
import SalesHistory from "./pages/SalesHistory";
import ViewBill from "./pages/ViewBill";
import ViewEstimate from "./pages/ViewEstimate";
import EstimateHistory from "./pages/EstimateHistory";
import Estimate from "./pages/Estimate";
import EditEstimate from "./pages/EditEstimate";
import EditSale from "./pages/EditSale";

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/products"
          element={<Products />}
        />


        <Route
          path="/add-product"
          element={<AddProduct />}
        />

        <Route
          path="/edit-product/:id"
          element={<EditProduct />}
        />

        <Route
          path="/sales"
          element={<Sales />}
        />

        <Route
          path="/purchase-history"
          element={<PurchaseHistory />}
        />

        <Route
          path="/sales-history"
          element={<SalesHistory />}
        />

        <Route
          path="/edit-sale/:id"
          element={<EditSale />}
        />

        <Route
          path="/sales-history/:id"
          element={<ViewBill />}
        />

        <Route
          path="/estimate"
          element={<Estimate />}
        />

        <Route
          path="/estimate-history"
          element={<EstimateHistory />}
        />

        <Route
          path="/estimate/:id"
          element={<ViewEstimate />}
        />

        <Route
          path="/edit-estimate/:id"
          element={<EditEstimate />}
        />

      </Routes>
    </DashboardLayout>
  );
}

export default App;