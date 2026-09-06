import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBrands = async () => {
    try {
      const res = await API.get("/brands");
      setBrands(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalBrands = brands.length;

  const activeBrands = brands.filter(
    (brand) => brand.status === "Active"
  ).length;

  const inactiveBrands = brands.filter(
    (brand) => brand.status !== "Active"
  ).length;

  const brandStats = brands.map((brand) => ({
    name: brand.name,
    count: products.filter(
      (product) => product.brand === brand.name
    ).length,
  }));

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, item) =>
      sum +
      Number(item.purchasePrice || 0) *
      Number(item.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (item) => item.stock > 0 && item.stock < 10
  );

  const outOfStockProducts = products.filter(
    (item) => Number(item.stock) === 0
  );

  const filteredProducts = products.filter((product) => {
    if (filter === "lowstock") {
      return product.stock > 0 && product.stock < 10;
    }

    if (filter === "active") {
      return product.status === "Active";
    }

    if (filter === "outofstock") {
      return product.stock <= 0;
    }

    if (
      selectedBrand !== "all" &&
      product.brand !== selectedBrand
    ) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Products
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalProducts}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Stock
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalStock}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Inventory Value
          </h3>

          <p className="text-3xl font-bold mt-2">
            ₹{inventoryValue}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Low Stock Items
          </h3>

          <p className="text-3xl font-bold mt-2 text-red-500">
            {lowStockProducts.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Out Of Stock
          </h3>

          <p className="text-3xl font-bold mt-2 text-red-600">
            {outOfStockProducts.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Brands
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalBrands}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Active Brands
          </h3>

          <p className="text-3xl font-bold mt-2 text-green-600">
            {activeBrands}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-gray-500">
            Inactive Brands
          </h3>

          <p className="text-3xl font-bold mt-2 text-red-600">
            {inactiveBrands}
          </p>
        </div>

      </div>

      {/* Inventory Overview */}
      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Inventory Overview
        </h2>

        <div className="space-y-4">

          <div>
            <div className="flex justify-between mb-1">
              <span>Total Stock</span>
              <span>{totalStock}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Low Stock</span>
              <span>{lowStockProducts.length}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-yellow-500 h-3 rounded-full"
                style={{
                  width: `${(lowStockProducts.length / totalProducts) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Out Of Stock</span>
              <span>{outOfStockProducts.length}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full"
                style={{
                  width: `${(outOfStockProducts.length / totalProducts) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Left Side */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 cursor-pointer rounded-lg ${filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white border"
              }`}
          >
            All Products
          </button>

          <button
            onClick={() => setFilter("lowstock")}
            className={`px-4 py-2 cursor-pointer rounded-lg ${filter === "lowstock"
              ? "bg-red-600 text-white"
              : "bg-white border"
              }`}
          >
            Low Stock
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 cursor-pointer rounded-lg ${filter === "active"
              ? "bg-green-600 text-white"
              : "bg-white border"
              }`}
          >
            Active
          </button>

          <button
            onClick={() => setFilter("outofstock")}
            className={`px-4 py-2 cursor-pointer rounded-lg ${filter === "outofstock"
              ? "bg-yellow-600 text-white"
              : "bg-white border"
              }`}
          >
            Out of Stock
          </button>
        </div>
        {/* Right Side */}
        <div>

          <select
            value={selectedBrand}
            onChange={(e) =>
              setSelectedBrand(
                e.target.value
              )
            }
            className="border px-4 py-2 rounded-lg cursor-pointer bg-white"
          >
            <option value="all">
              All Brands
            </option>

            {brandStats.map((brand) => (
              <option
                key={brand.name}
                value={brand.name}
              >
                {brand.name} ({brand.count})
              </option>
            ))}

          </select>

        </div>
        {/* Notification Bell */}
        {/* <div className="relative">

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="relative bg-white p-3 rounded-lg border hover:bg-gray-50"
          >
            🔔

            {products.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {Math.min(products.length, 99)}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">

              <div className="p-4 border-b">
                <h3 className="font-semibold">
                  Recent Activity
                </h3>
              </div>

              <div className="max-h-80 overflow-y-auto">

                {products
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt) -
                      new Date(a.createdAt)
                  )
                  .slice(0, 10)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="p-3 border-b hover:bg-gray-50"
                    >
                      <p className="text-sm">
                        Product
                        <span className="font-semibold">
                          {" "}
                          {item.name}
                        </span>
                        {" "}was added
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        ID: {item.productId}
                      </p>
                    </div>
                  ))}

              </div>

            </div>
          )}

        </div> */}
      </div>


      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow p-5 mb-8">

        <h2 className="text-xl font-bold mb-4">
          Products
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Product ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Brand</th>
                <th className="text-left p-3">Stock</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt) -
                      new Date(a.createdAt)
                  )
                  .slice(0, 5).map((product) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                      </td>

                      <td className="p-3 font-medium">
                        {product.productId}
                      </td>

                      <td className="p-3">
                        {product.name}
                      </td>

                      <td className="p-3">
                        {product.brand}
                      </td>

                      <td className="p-3">
                        {product.stock}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-12"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-5xl mb-2">
                        📦
                      </span>

                      <h3 className="font-semibold text-lg">
                        No Products Found
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {filter === "lowstock" &&
                          "No Low Stock Products Found"}

                        {filter === "outofstock" &&
                          "No Out Of Stock Products Found"}

                        {filter === "active" &&
                          "No Active Products Found"}

                        {filter === "all" &&
                          "No Products Available"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-red-600">
            Low Stock Products
          </h2>

          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
            {lowStockProducts.length} Items
          </span>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No low stock products found
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-xl p-4 hover:bg-gray-50 transition"
              >
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      ID : {item.productId}
                    </p>

                    <p className="text-sm text-gray-500">
                      Brand : {item.brand}
                    </p>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    Low Stock
                  </span>

                  <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full font-semibold">
                    {item.stock} Left
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;