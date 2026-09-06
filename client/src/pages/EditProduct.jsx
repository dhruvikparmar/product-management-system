import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        productId: "",
        name: "",
        brand: "",
        purchasePrice: "",
        sellPrice: "",
        stock: "",
        status: "",
    });

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const res = await API.get("/products");

            const product = res.data.find(
                (item) => item._id === id
            );

            if (product) {
                setFormData(product);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

   const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();

    data.append("productId", formData.productId);
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("purchasePrice", formData.purchasePrice);
    data.append("sellPrice", formData.sellPrice);
    data.append("stock", formData.stock);
    data.append("status", formData.status);

    if (formData.newImage) {
      data.append("image", formData.newImage);
    }

    await API.put(
      `/products/${id}`,
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    alert("Product Updated");

    navigate("/products");
  } catch (error) {
    console.log(error);
    alert("Update Failed");
  }
};

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Edit Product
            </h1>

            <form
                onSubmit={handleUpdate}
                className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-5"
            >
                <div className="mb-6">
                    <img
                        src={
                            formData.newImage
                                ? URL.createObjectURL(formData.newImage)
                                : `https://product-management-system-crj6.onrender.com/uploads/${formData.image}`
                        }
                        alt={formData.name}
                        className="w-40 h-40 object-cover rounded-lg border"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Change Product Image
                    </label>

                    <input
                        type="file"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                newImage: e.target.files[0],
                            })
                        }
                        className="w-full border p-3 rounded-lg cursor-pointer"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Product ID
                    </label>
                    <input
                        type="text"
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        placeholder="Product ID"
                        className="w-full border p-3 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="w-full border p-3 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Product Brand
                    </label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Brand"
                        className="w-full border p-3 rounded"
                    />
                </div>


                <div>
                    <label className="block mb-2 font-semibold">
                        Purchase Price
                    </label>
                    <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        placeholder="Purchase Price"
                        className="w-full border p-3 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Sell Price
                    </label>
                    <input
                        type="number"
                        name="sellPrice"
                        value={formData.sellPrice}
                        onChange={handleChange}
                        placeholder="Sell Price"
                        className="w-full border p-3 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Stock
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        className="w-full border p-3 rounded"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-3 rounded-lg"
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;