import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const ViewEstimate = () => {

    const { id } = useParams();

    const [estimate, setEstimate] =
        useState(null);

    useEffect(() => {
        fetchEstimate();
    }, []);

    const fetchEstimate =
        async () => {
            try {

                const res =
                    await API.get(
                        `/estimates/${id}`
                    );

                setEstimate(
                    res.data
                );

            } catch (error) {
                console.log(error);
            }
        };

    if (!estimate) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <div
                id="estimate-bill"
                className="max-w-5xl mx-auto bg-white p-8 border rounded-xl"
            >
                {/* Estimate Details */}
                <div className="flex justify-between items-start border-b pb-5 mb-5">

                    <div>

                        <h1 className="text-4xl font-bold">
                            POOJA TOYS
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Rajkot, Gujarat
                        </p>

                        <p className="text-gray-600">
                            Estimate / Quotation
                        </p>

                    </div>

                    <button
                        onClick={() => window.print()}
                        className="print-btn bg-green-600 hover:bg-green-700 cursor-pointer text-white px-5 py-2 rounded-lg"
                    >
                        Print
                    </button>

                </div>

                {/* Customer Details */}
                <div className="grid md:grid-cols-2 gap-6 border-b pb-5 mb-5">

                    <div>

                        <p>
                            <strong>Customer :</strong>
                            {" "}
                            {estimate.customerName}
                        </p>

                        <p className="mt-2">
                            <strong>Mobile :</strong>
                            {" "}
                            {estimate.customerMobile}
                        </p>

                    </div>

                    <div className="md:text-right">

                        <p>
                            <strong>Estimate No :</strong>
                            {" "}
                            {estimate.estimateNo}
                        </p>

                        <p className="mt-2">
                            <strong>Date :</strong>
                            {" "}   
                            {new Date(
                                estimate.estimateDate
                            ).toLocaleDateString("en-IN")}
                        </p>

                    </div>

                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">

                    <table className="w-full border">

                        <thead className="bg-gray-100">

                            <tr>
                                <th className="p-3 border">
                                    Product
                                </th>

                                <th className="p-3 border text-center">
                                    Qty
                                </th>

                                <th className="p-3 border text-center">
                                    Rate
                                </th>

                                <th className="p-3 border text-center">
                                    Amount
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {estimate.items.map(
                                (item, index) => (

                                    <tr
                                        key={index}
                                        className="border-t"
                                    >

                                        <td className="p-3 border">
                                            {item.productName}
                                        </td>

                                        <td className="p-3 border text-center">
                                            {item.quantity}
                                        </td>

                                        <td className="p-3 border text-center">
                                            ₹{item.price}
                                        </td>

                                        <td className="p-3 border text-center font-semibold">
                                            ₹{item.total}
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

                {/* Grand Total */}
                <div className="mt-8 flex justify-end">

                    <div className="w-full md:w-80">

                        <div className="flex justify-between py-2">

                            <span className="font-medium">
                                Sub Total
                            </span>

                            <span className="font-semibold">
                                ₹
                                {estimate.items.reduce(
                                    (sum, item) =>
                                        sum + Number(item.total),
                                    0
                                )}
                            </span>

                        </div>

                        <div className="flex justify-between py-2">

                            <span className="font-medium">
                                Discount
                            </span>

                            <span className="text-red-500 font-semibold">
                                {estimate.discountType === "percentage"
                                    ? `${estimate.discountValue}%`
                                    : `₹${estimate.discountValue}`}
                            </span>

                        </div>

                        <div className="flex justify-between py-3 border-t-2 border-green-500 text-3xl font-bold text-green-600">

                            <span>
                                Grand Total
                            </span>

                            <span>
                                ₹{estimate.grandTotal}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Note */}
                <div className="mt-12 border-t pt-5">

                    <h3 className="font-bold text-lg mb-2">
                        Note
                    </h3>

                    <ul className="text-gray-600 space-y-1">

                        <li>
                            • Goods once sold will not be returned or exchanged.
                        </li>
                    </ul>

                </div>

            </div>

        </div>
    );
};

export default ViewEstimate;