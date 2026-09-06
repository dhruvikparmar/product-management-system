import { useEffect, useState } from "react";
import API from "../services/api";

const Sales = () => {
    const [products, setProducts] = useState([]);

    const [customerName, setCustomerName] =
        useState("");

    const [phoneNumber, setPhoneNumber] =
        useState("");

    const [searchProduct, setSearchProduct] =
        useState("");

    const [saleDate, setSaleDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [discount, setDiscount] =
        useState(0);

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get(
                "/products"
            );

            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleProductChange = (
        index,
        productId
    ) => {
        const selectedProduct =
            products.find(
                (p) => p._id === productId
            );

        const updatedItems = [...items];

        updatedItems[index] = {
            ...updatedItems[index],
            productId:
                selectedProduct._id,
            productName:
                selectedProduct.name,
            price:
                selectedProduct.sellPrice,
            quantity: 1,
            total:
                selectedProduct.sellPrice,
            availableStock:
                selectedProduct.stock,
        };

        setItems(updatedItems);
    };

    const handleQuantityChange = (
        index,
        qty
    ) => {
        const updatedItems = [...items];

        updatedItems[index].quantity =
            Number(qty);

        updatedItems[index].total =
            updatedItems[index].price *
            Number(qty);

        setItems(updatedItems);
    };

    const filteredProducts =
        products.filter(
            (product) =>
                product.name
                    .toLowerCase()
                    .includes(
                        searchProduct.toLowerCase()
                    ) ||
                product.productId
                    .toLowerCase()
                    .includes(
                        searchProduct.toLowerCase()
                    )
        );

    const suggestions =
        searchProduct.trim() === ""
            ? []
            : filteredProducts.slice(0, 8);

    const addToBill = () => {
        const product = filteredProducts[0];

        if (!product) {
            alert("Product not found");
            return;
        }

        const alreadyAdded = items.find(
            (item) => item.productId === product._id
        );

        if (alreadyAdded) {
            alert("Product already added");
            return;
        }

        setItems([
            ...items,
            {
                productId: product._id,
                productCode: product.productId,
                productName: product.name,
                image: product.image,
                brand: product.brand,

                availableStock: product.stock,

                purchasePrice: product.purchasePrice,

                price: Number(product.sellPrice),

                quantity: 1,

                total: Number(product.sellPrice),
            },
        ]);

        setSearchProduct("");
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                productId: "",
                productName: "",
                price: 0,
                quantity: 1,
                total: 0,
            },
        ]);
    };

    const removeItem = (index) => {
        const updatedItems =
            items.filter(
                (_, i) => i !== index
            );

        setItems(updatedItems);
    };

    const subTotal =
        items.reduce(
            (sum, item) =>
                sum + Number(item.total),
            0
        );

    const grandTotal =
        subTotal - discount;

    const handleSubmit = async () => {
        if (!customerName.trim()) {
            alert("Customer Name Required");
            return;
        }

        if (phoneNumber.length !== 10) {
            alert("Phone Number must be 10 digits");
            return;
        }

        if (items.length === 0) {
            alert("Please add product");
            return;
        }
        try {
            console.log(items);
            await API.post("/sales", {
                customerName,
                phoneNumber,
                saleDate,
                discount,
                items,
                grandTotal:
                    items.reduce(
                        (sum, item) => sum + item.total,
                        0
                    ) - discount,
            });

            alert(
                "Sale Saved Successfully"
            );

            setCustomerName("");
            setPhoneNumber("");

            setItems([
                {
                    productId: "",
                    productName: "",
                    price: 0,
                    quantity: 1,
                    total: 0,
                },
            ]);
            setDiscount(0);
            setSaleDate(
                new Date()
                    .toISOString()
                    .split("T")[0]
            );

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data
                    ?.message ||
                "Failed"
            );
        }

    };


 const addCustomProduct = () => {

  setItems([
    ...items,
    {
      custom: true,
      productId: null,
      productName: "",
      brand: "-",
      image: "",
      availableStock: 99999,
      purchasePrice: 0,
      price: 0,
      quantity: 1,
      total: 0,
    },
  ]);

};

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                New Sale
            </h1>

            <div className="bg-white rounded-xl shadow p-6">

                {/* Customer */}

                <div className="grid md:grid-cols-2 gap-5 mb-6">

                    <div>
                        <label className="block mb-2 font-medium">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(
                                    e.target.value
                                )
                            }
                            className="w-full border p-3 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                );

                                if (value.length <= 10) {
                                    setPhoneNumber(value);
                                }
                            }}
                            placeholder="Enter 10 digit mobile number"
                            className="w-full border p-3 rounded-lg"
                        />
                        {phoneNumber &&
                            phoneNumber.length < 10 && (
                                <p className="text-red-500 text-sm mt-1">
                                    Phone number must contain 10 digits
                                </p>
                            )}
                    </div>

                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Sale Date
                    </label>

                    <input
                        type="date"
                        value={saleDate}
                        onChange={(e) =>
                            setSaleDate(e.target.value)
                        }
                        className="w-full border p-3 rounded-lg"
                    />
                </div>

                {/* Search Product */}
                <div className="relative flex flex-col md:flex-row gap-3 mb-6">

                    <div className="flex-1 relative">

                        <input
                            type="text"
                            placeholder="Search Product Name or Product ID..."
                            value={searchProduct}
                            onChange={(e) =>
                                setSearchProduct(e.target.value)
                            }
                            className="w-full mt-2 border p-3 rounded-lg"
                        />

                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">

                                {suggestions.map((product) => (
                                    <div
                                        key={product._id}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setSearchProduct(
                                                `${product.productId} - ${product.name}`
                                            );
                                        }}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
                                    >
                                        <img
                                            src={`https://product-management-system-zl7f.onrender.com/uploads/${product.image}`}
                                            alt=""
                                            className="w-10 h-10 rounded object-cover"
                                        />

                                        <div>
                                            <p className="font-medium">
                                                {product.productId}
                                            </p>
                                            <p className="font-medium">
                                                {product.quantity}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {product.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                    <button
                        onClick={() => {
                            if (!selectedProduct) {
                                alert("Select Product First");
                                return;
                            }

                            const alreadyAdded =
                                items.find(
                                    (item) =>
                                        item.productId ===
                                        selectedProduct._id
                                );

                            if (alreadyAdded) {
                                alert(
                                    "Product already added"
                                );
                                return;
                            }

                            setItems([
                                ...items,
                                {
                                    productId:
                                        selectedProduct._id,

                                    productCode:
                                        selectedProduct.productId,

                                    productName:
                                        selectedProduct.name,

                                    image:
                                        selectedProduct.image,

                                    brand:
                                        selectedProduct.brand,

                                    availableStock:
                                        selectedProduct.stock,

                                    purchasePrice:
                                        selectedProduct.purchasePrice,

                                    price:
                                        Number(
                                            selectedProduct.sellPrice
                                        ),

                                    quantity: 1,

                                    total:
                                        Number(
                                            selectedProduct.sellPrice
                                        ),
                                },
                            ]);

                            setSearchProduct("");
                            setSelectedProduct(null);
                        }}
                        className="bg-green-600 mt-2 cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                    >
                        + Add Product
                    </button>

                </div>

                {/* Items */}
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-xl p-4 mb-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-8 items-center">

                            {/* Image */}
                            <div>
                                {
                                    item.custom ?

                                        <div className="w-24 h-24 flex items-center justify-center border rounded-lg bg-gray-100">
                                            Custom
                                        </div>

                                        :

                                        <img
                                            src={`https://product-management-system-zl7f.onrender.com/uploads/${item.image}`}
                                            alt=""
                                            className="w-24 h-24 object-cover rounded-lg border"
                                        />
                                }
                            </div>

                            {/* Product */}
                            <div>
                                {
                                    item.custom ?

                                        <input
                                            type="text"
                                            placeholder="Enter Product Name"
                                            value={item.productName}
                                            onChange={(e) => {

                                                const updated = [...items];

                                                updated[index].productName =
                                                    e.target.value;

                                                setItems(updated);

                                            }}
                                            className="border p-2 rounded-lg w-full"
                                        />

                                        :

                                        <h3 className="font-bold text-xl">
                                            {item.productName}
                                        </h3>
                                }

                                <p className="text-sm text-gray-500">
                                    ID : {item.productCode}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Brand : {item.brand}
                                </p>
                            </div>

                            {/* Available */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Available
                                </label>

                                <p className="font-bold text-green-600 text-lg">
                                    {item.availableStock}
                                </p>
                            </div>

                            {/* Purchase */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Purchase
                                </label>

                                <p className="font-bold text-orange-600 text-lg">
                                    ₹{item.purchasePrice}
                                </p>
                            </div>

                            {/* Selling */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Selling
                                </label>

                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => {
                                        const updated = [...items];

                                        updated[index].price =
                                            Number(e.target.value);

                                        updated[index].total =
                                            updated[index].price *
                                            updated[index].quantity;

                                        setItems(updated);
                                    }}
                                    className="w-full border p-2 rounded-lg"
                                />
                            </div>

                            {/* Qty */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Qty
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max={item.availableStock}
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const qty = Number(e.target.value);

                                        if (
                                            !item.custom &&
                                            qty > item.availableStock
                                        ) {
                                            alert("Quantity exceeds available stock");
                                            return;
                                        }

                                        const updated = [...items];

                                        updated[index].quantity = qty;

                                        updated[index].total =
                                            updated[index].price * qty;

                                        setItems(updated);
                                    }}
                                    className="w-full border p-2 rounded-lg"
                                />
                            </div>

                            {/* Total */}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Total
                                </label>

                                <p className="font-bold text-blue-600 text-xl">
                                    ₹{item.total}
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={() => removeItem(index)}
                            className="bg-red-500 hover:bg-red-600 text-white mt-3 px-5 py-2 rounded-lg"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {/* Add Item */}

                <button
                    onClick={addItem}
                    className="bg-green-600 hover:bg-green- cursor-pointer text-white px-5 py-2 rounded-lg mb-6"
                >
                    + Add Item
                </button>

                {/* Custom Product */}
                <button
                    type="button"
                    onClick={addCustomProduct}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2 rounded-lg ml-2"
                >
                    + Custom Product
                </button>

                {/* Grand Total */}
                <div className="flex flex-col items-end gap-3 mb-6">

                    <div>
                        <label className="mr-3">
                            Discount
                        </label>

                        <input
                            type="number"
                            value={discount}
                            onChange={(e) =>
                                setDiscount(
                                    Number(e.target.value)
                                )
                            }
                            className="border p-2 rounded w-32"
                        />
                    </div>

                    <h2 className="text-xl font-semibold">
                        Total :
                        ₹
                        {items.reduce(
                            (sum, item) =>
                                sum + item.total,
                            0
                        )}
                    </h2>

                    <h2 className="text-3xl font-bold text-green-600">
                        Grand Total :
                        ₹
                        {items.reduce(
                            (sum, item) =>
                                sum + item.total,
                            0
                        ) - discount}
                    </h2>

                </div>

                {/* Save */}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-3 rounded-lg"
                >
                    Save Sale
                </button>

            </div>

        </div>
    );
};

export default Sales;