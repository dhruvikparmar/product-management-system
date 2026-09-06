import { useEffect, useState } from "react";
import API from "../services/api";

const PurchaseHistory = () => {
    const [history, setHistory] =
        useState([]);

    const [search, setSearch] =
        useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await API.get(
                "/stock-history"
            );

            setHistory(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredHistory = history.filter(
        (item) =>
            item.productName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            item.productId
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            item.supplierName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            item.billNumber
                ?.toString()
                .toLowerCase()
                .includes(search.toLowerCase())
    ) .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Purchase History
                </h1>
            </div>

            {/* Search */}
            <div className="mb-5">
                <input
                    type="text"
                    placeholder="Search Product / Supplier / Bill No..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="w-full md:w-96 border p-3 rounded-lg"
                />
            </div>

            {/* Purchase History Cards */}
            <div className="space-y-5">

                {filteredHistory.length > 0 ? (

                    filteredHistory.map((item) => (

                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow p-5 border"
                        >

                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={
                                            item.image
                                                ? `https://product-management-system-zl7f.onrender.com/uploads/${item.image}`
                                                : "https://via.placeholder.com/150"
                                        }
                                        alt={item.productName}
                                        onError={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/150";
                                        }}
                                        className="w-40 h-40 object-cover rounded-xl border"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">

                                    {/* Row 1 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Date
                                            </p>

                                            <p className="font-semibold">
                                                {new Date(
                                                    item.purchaseDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Supplier
                                            </p>

                                            <p className="font-semibold">
                                                {item.supplierName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Mobile
                                            </p>

                                            <p className="font-semibold">
                                                {item.supplierMobile}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Bill No
                                            </p>

                                            <p className="font-semibold">
                                                {item.billNumber}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Row 2 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Product ID
                                            </p>

                                            <p className="font-semibold">
                                                {item.productId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Product Name
                                            </p>

                                            <p className="font-semibold">
                                                {item.productName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Brand
                                            </p>

                                            <p className="font-semibold">
                                                {item.brand}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Row 3 */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Purchase Price
                                            </p>

                                            <p className="font-semibold text-green-600">
                                                ₹ {item.purchasePrice}/-
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Quantity
                                            </p>

                                            <p className="font-semibold">
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Total Cost
                                            </p>

                                            <p className="font-bold text-blue-600">
                                                ₹  
                                                {Number(item.purchasePrice)  *
                                                    Number(item.quantity)}/-
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>

                    ))

                ) : (

                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <div className="text-5xl mb-3">
                            📦
                        </div>

                        <h3 className="text-lg font-semibold">
                            No Purchase History Found
                        </h3>

                        <p className="text-gray-500 mt-2">
                            No matching purchase records available.
                        </p>

                    </div>

                )}

            </div>
        </div>
    );
};

export default PurchaseHistory;