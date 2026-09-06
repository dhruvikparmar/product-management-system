import { useEffect, useState } from "react";
import API from "../services/api";

const Estimate = () => {

    const [products, setProducts] =
        useState([]);

    const [customerName,
        setCustomerName] =
        useState("");

    const [customerMobile,
        setCustomerMobile] =
        useState("");

    const [estimateDate,
        setEstimateDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [searchProduct,
        setSearchProduct] =
        useState("");

    const [selectedProduct,
        setSelectedProduct] =
        useState(null);

    const [discountType,
        setDiscountType] =
        useState("amount");

    const [discountValue,
        setDiscountValue] =
        useState(0);

    const [items,
        setItems] =
        useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts =
        async () => {
            try {

                const res =
                    await API.get(
                        "/products"
                    );

                setProducts(
                    res.data
                );

            } catch (error) {
                console.log(error);
            }
        };

    const filteredProducts =
        products.filter(
            (product) =>
                product.name
                    ?.toLowerCase()
                    .includes(
                        searchProduct.toLowerCase()
                    ) ||
                product.productId
                    ?.toLowerCase()
                    .includes(
                        searchProduct.toLowerCase()
                    )
        );

    const suggestions =
        searchProduct.trim() === ""
            ? []
            : filteredProducts.slice(0, 8);

    

    // const suggestions =
    //     searchProduct.trim() === ""
    //         ? []
    //         : filteredProducts.slice(0, 8);

    const addProduct = () => {

        if (!selectedProduct)
            return;

        setItems([
            ...items,
            {
                productId:
                    selectedProduct.productId,

                productName:
                    selectedProduct.name,

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
    };
    const addBlankItem = () => {

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
    const updateItem = (
        index,
        field,
        value
    ) => {

        const updated =
            [...items];

        updated[index][field] =
            value;

        updated[index].total =
            Number(
                updated[index].price
            ) *
            Number(
                updated[index].quantity
            );

        setItems(updated);

    };
    const subtotal =
        items.reduce(
            (sum, item) =>
                sum +
                Number(item.total),
            0
        );

    const discountAmount =
        discountType ===
            "percentage"
            ? subtotal *
            (Number(
                discountValue
            ) / 100)
            : Number(
                discountValue
            );

    const grandTotal =
        subtotal -
        discountAmount;

    const saveEstimate =
        async () => {

            try {

                await API.post(
                    "/estimates",
                    {
                        customerName,
                        customerMobile,
                        estimateDate,

                        items,

                        discountType,

                        discountValue,

                        grandTotal,
                    }
                );

                alert(
                    "Estimate Saved Successfully"
                );

            } catch (error) {

                console.log(error);

            }

        };
    return (
        <div>

            {/* Header */}

            <div className=" rounded-xl mb-6">

                <h1 className="text-3xl font-bold">
                    New Estimate
                </h1>

            </div>

            {/* Customer Details */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="grid md:grid-cols-3 gap-5">

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
                            Mobile Number
                        </label>

                        <input
                            type="text"
                            value={customerMobile}
                            onChange={(e) =>
                                setCustomerMobile(
                                    e.target.value
                                )
                            }
                            className="w-full border p-3 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Estimate Date
                        </label>

                        <input
                            type="date"
                            value={estimateDate}
                            onChange={(e) =>
                                setEstimateDate(
                                    e.target.value
                                )
                            }
                            className="w-full border p-3 rounded-lg"
                        />
                    </div>

                </div>

            </div>

            {/* Search Product */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="flex flex-col md:flex-row gap-4">

                    <div className="flex-1 relative">

                        <input
                            type="text"
                            placeholder="Search Product Name or Product ID..."
                            value={searchProduct}
                            onChange={(e) =>
                                setSearchProduct(
                                    e.target.value
                                )
                            }
                            className="w-full border p-3 rounded-lg"
                        />

                        {suggestions.length > 0 && (

                            <div className="absolute left-0 right-0 top-full bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">

                                {suggestions.map(
                                    (product) => (

                                        <div
                                            key={product._id}
                                            onClick={() => {
                                                setSelectedProduct(
                                                    product
                                                );

                                                setSearchProduct(
                                                    `${product.productId} - ${product.name}`
                                                );
                                            }}
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                                        >
                                            <p className="font-medium">
                                                {product.productId}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {product.name}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                    <button
                        onClick={addProduct}
                        className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-3 rounded-lg"
                    >
                        Add Product
                    </button>

                    <button
                        onClick={addBlankItem}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-3 rounded-lg"
                    >
                        Add Custom Item
                    </button>

                </div>

            </div>

            {/* Items */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="space-y-4">

                    {items.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-5 gap-4 border rounded-xl p-4"
                            >

                                <div>
                                    <label className="block text-sm mb-1">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            item.productName
                                        }
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "productName",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">
                                        Selling Price
                                    </label>

                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        value={
                                            item.quantity
                                        }
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">
                                        Total
                                    </label>

                                    <input
                                        type="text"
                                        value={`₹${item.total}`}
                                        readOnly
                                        className="w-full border p-2 rounded bg-gray-100"
                                    />
                                </div>

                                <div className="flex items-end">

                                    <button
                                        onClick={() => {
                                            setItems(
                                                items.filter(
                                                    (_, i) =>
                                                        i !== index
                                                )
                                            );
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

            {/* Summary */}

            <div className="bg-white rounded-xl shadow p-6">

                <div className="grid md:grid-cols-3 gap-5 mb-5">

                    <div>
                        <label className="block mb-2">
                            Discount Type
                        </label>

                        <select
                            value={discountType}
                            onChange={(e) =>
                                setDiscountType(
                                    e.target.value
                                )
                            }
                            className="w-full border p-3 rounded-lg"
                        >
                            <option value="amount">
                                Amount ₹
                            </option>

                            <option value="percentage">
                                Percentage %
                            </option>

                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">
                            Discount Value
                        </label>

                        <input
                            type="number"
                            value={discountValue}
                            onChange={(e) =>
                                setDiscountValue(
                                    e.target.value
                                )
                            }
                            className="w-full border p-3 rounded-lg"
                        />
                    </div>

                </div>

                <div className="text-right space-y-2">

                    <h3 className="text-lg">
                        Sub Total :
                        ₹{subtotal}
                    </h3>

                    <h3 className="text-lg text-red-500">
                        Discount :
                        ₹{discountAmount}
                    </h3>

                    <h2 className="text-3xl font-bold text-green-600">
                        Grand Total :
                        ₹{grandTotal}
                    </h2>

                </div>

                <div className="flex flex-wrap gap-4 mt-6">

                    <button
                        onClick={saveEstimate}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-3 rounded-lg"
                    >
                        Save Estimate
                    </button>

                    <button
                        onClick={() =>
                            window.print()
                        }
                        className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-3 rounded-lg"
                    >
                        Print Estimate
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Estimate;