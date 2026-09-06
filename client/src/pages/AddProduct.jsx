import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await API.get("/brands");
      setBrands(
        res.data.filter(
          (item) => item.status === "Active"
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [formData, setFormData] = useState({

    supplierName: "",
    supplierMobile: "",
    billNumber: "",
    purchaseDate: "",

    productId: "",
    name: "",
    brand: "",

    purchasePrice: "",
    sellPrice: "",
    stock: "",

    status: "Active",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (!formData.supplierName.trim()) {
      alert("Supplier Name Required");
      return;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        formData.supplierMobile
      )
    ) {
      alert("Enter Valid Mobile Number");
      return;
    }

    if (!formData.billNumber.trim()) {
      alert("Bill Number Required");
      return;
    }

    if (!formData.purchaseDate) {
      alert("Purchase Date Required");
      return;
    }
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await API.post("/products", data, {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      });

      alert("Stock Added Successfully");

      navigate("/products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Add Stock
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Supplier Name */}
          <div>
            <label className="block mb-2 font-medium">
              Supplier Name
            </label>

            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              placeholder="Enter supplier name"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Supplier Mobile */}
          <div>
            <label className="block mb-2 font-medium">
              Mobile Number
            </label>

            <input
              type="text"
              name="supplierMobile"
              value={formData.supplierMobile}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /\D/g,
                  ""
                );

                if (value.length <= 10) {
                  setFormData({
                    ...formData,
                    supplierMobile: value,
                  });
                }
              }}
              placeholder="Enter mobile number"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Bill Number */}
          <div>
            <label className="block mb-2 font-medium">
              Bill Number
            </label>

            <input
              type="text"
              name="billNumber"
              value={formData.billNumber}
              onChange={handleChange}
              placeholder="Enter bill number"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block mb-2 font-medium">
              Purchase Date
            </label>

            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>
          {/* Product Image */}
          <div>
            <label className="block mb-2 font-medium">
              Product Image
            </label>

            <input
              type="file"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files[0],
                })
              }
              className="w-full border p-3 rounded"
            />
          </div>

          {/* Product ID */}
          <div>
            <label className="block mb-2 font-medium">
              Product ID
            </label>

            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              placeholder="Enter product ID"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block mb-2 font-medium">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Product Brand */}
          <div>
            <label className="block mb-2 font-medium">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              placeholder="Enter Brand Name"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block mb-2 font-medium">
              Purchase Price
            </label>

            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="Enter purchase price"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Sell Price */}
          <div>
            <label className="block mb-2 font-medium">
              Sell Price
            </label>

            <input
              type="number"
              name="sellPrice"
              value={formData.sellPrice}
              onChange={handleChange}
              placeholder="Enter sell price"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-2 font-medium">
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              className="w-full border px-4 py-3 rounded-lg outline-none"
            />
          </div>

          {/* Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-3 rounded-lg"
            >
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;