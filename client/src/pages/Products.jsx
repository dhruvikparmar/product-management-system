import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // DELETE PRODUCTS
  const deleteProduct = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure?"
      );

      if (!confirmDelete) return;

      await API.delete(`/products/${id}`);

      fetchProducts();

      alert("Product Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.productId
        ?.toLowerCase()
        .startsWith(searchTerm.toLowerCase()) ||

      product.name
        ?.toLowerCase()
        .startsWith(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Inventory
        </h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Product ID or Name..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full md:w-80 px-4 py-2 border rounded-lg outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Product ID</th>
              <th className="text-left p-4">Product Name</th>
              <th className="text-left p-4">Brand</th>
              <th className="text-left p-4">Purchase Price (₹)</th>
              <th className="text-left p-4">Sell Price (₹)</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts
                .sort(
                  (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                ).map((product) => (
                  <tr
                    key={product._id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Image */}
                    <td className="p-4">
                      <img
                        src={
                          product.image
                            ? `http://localhost:5000/uploads/${product.image}`
                            : "https://via.placeholder.com/60"
                        }
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    </td>

                    {/* Product ID */}
                    <td className="p-4 font-medium">
                      {product.productId}
                    </td>

                    {/* Product Name */}
                    <td className="p-4">
                      {product.name}
                    </td>

                    {/* Brand */}
                    <td className="p-4">
                      {product.brand}
                    </td>

                    {/* Purchase Price */}
                    <td className="p-4">
                      ₹{product.purchasePrice}
                    </td>

                    {/* Sell Price */}
                    <td className="p-4">
                      ₹{product.sellPrice}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      {product.stock}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${product.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm" to={`/edit-product/${product._id}`}>
                          Edit
                        </Link>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" onClick={() => deleteProduct(product._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center p-6 text-gray-500"
                >
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;