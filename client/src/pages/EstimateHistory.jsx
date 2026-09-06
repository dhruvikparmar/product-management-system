import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EstimateHistory = () => {
    const [estimates, setEstimates] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchEstimates();
    }, []);

    const fetchEstimates = async () => {
        try {

            const res =
                await API.get(
                    "/estimates"
                );

            setEstimates(
                res.data
            );

        } catch (error) {
            console.log(error);
        }
    };

    const deleteEstimate = async (id) => {

        const confirmDelete =
            window.confirm(
                "Delete this estimate?"
            );

        if (!confirmDelete) return;

        try {

            await API.delete(
                `/estimates/${id}`
            );

            fetchEstimates();

            alert(
                "Estimate Deleted Successfully"
            );

        } catch (error) {

            console.log(error);

        }

    };

    const filteredEstimates =
        estimates.filter(
            (estimate) =>
                estimate.customerName
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                estimate.customerMobile
                    ?.includes(search) ||
                estimate.estimateNo
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );

    const downloadPDF = (estimate) => {

        const doc = new jsPDF();

        // HEADER

        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.8);
        doc.line(14, 40, 195, 40);

        doc.setFontSize(22);
        doc.setFont(undefined, "bold");

        doc.setTextColor(220, 38, 38);
        doc.text("POOJA TOYS", 14, 20);

        doc.setTextColor(0, 0, 0);

        doc.setFontSize(10);
        doc.text("Rajkot, Gujarat", 14, 28);

        doc.setTextColor(100);
        doc.text("Estimate", 14, 34);

        doc.setTextColor(0);

        // CUSTOMER INFO BOX

        doc.setFontSize(11);

        // Row 1

        doc.setFont(undefined, "bold");
        doc.text("Customer Name :", 14, 55);

        doc.setFont(undefined, "normal");
        doc.text(
            estimate.customerName,
            55,
            55
        );

        doc.setFont(undefined, "bold");
        doc.text("Estimate No :", 120, 55);

        doc.setFont(undefined, "normal");
        doc.text(
            estimate.estimateNo,
            155,
            55
        );

        // Row 2

        doc.setFont(undefined, "bold");
        doc.text("Mobile Number :", 14, 68);

        doc.setFont(undefined, "normal");
        doc.text(
            estimate.customerMobile,
            55,
            68
        );

        doc.setFont(undefined, "bold");
        doc.text("Date :", 120, 68);

        doc.setFont(undefined, "normal");
        doc.text(
            new Date(
                estimate.estimateDate
            ).toLocaleDateString("en-IN"),
            155,
            68
        );

        // TABLE

        autoTable(doc, {
            startY: 80,

            head: [
                [
                    "Product",
                    "Qty",
                    "Rate",
                    "Amount",
                ],
            ],

            body: estimate.items.map(
                (item) => [
                    item.productName,
                    item.quantity,
                    item.price,
                    item.total,
                ]
            ),

            theme: "grid",

            styles: {
                fontSize: 10,
                // halign: "center",
            },

            headStyles: {
                fillColor: [59, 130, 246],
                textColor: 255,
            },
        });

        const subTotal =
            estimate.items.reduce(
                (sum, item) =>
                    sum + Number(item.total),
                0
            );

        const finalY =
            doc.lastAutoTable.finalY + 15;

        doc.setFontSize(11);

        doc.text(
            "Sub Total",
            120,
            finalY
        );

        doc.text(
            `${subTotal}`,
            180,
            finalY,
            {
                align: "right",
            }
        );

        doc.text(
            "Discount",
            120,
            finalY + 12
        );

        doc.text(
            estimate.discountType ===
                "percentage"
                ? `${estimate.discountValue}%`
                : `${estimate.discountValue}`,
            180,
            finalY + 12,
            {
                align: "right",
            }
        );

        doc.setDrawColor(
            37,
            99,
            235
        );

        doc.line(
            120,
            finalY + 18,
            180,
            finalY + 18
        );

        doc.setFontSize(18);

        doc.setTextColor(
            220,
            38,
            38
        );

        doc.setFont(
            undefined,
            "bold"
        );

        doc.text(
            "Grand Total = ",
            120,
            finalY + 32
        );

        doc.text(
            `${estimate.grandTotal} /-`,
            180,
            finalY + 32,
            {
                align: "right",
            }
        );

        doc.setTextColor(0);

        const noteY =
            finalY + 55;

        doc.line(
            14,
            noteY - 10,
            195,
            noteY - 10
        );

        doc.setFont(undefined, "bold");
        doc.text(
            "Note",
            14,
            noteY
        );

        doc.setFont(undefined, "normal");

        doc.text(
            "• Goods once sold will not be returned or exchanged.",
            14,
            noteY + 10
        );

        doc.save(
            `${estimate.estimateNo}.pdf`
        );
    };

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Estimate History
            </h1>

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Search Estimate No, Customer, Mobile..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="w-full md:w-96 border p-3 rounded-lg"
                />

            </div>

            <div className="space-y-4">

                {filteredEstimates.map(
                    (estimate) => (

                        <div
                            key={estimate._id}
                            className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Estimate No
                                    </p>

                                    <p className="font-bold text-blue-600">
                                        {estimate.estimateNo}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Customer
                                    </p>

                                    <p className="font-semibold text-lg">
                                        {estimate.customerName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Mobile
                                    </p>

                                    <p>
                                        {estimate.customerMobile}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Date
                                    </p>

                                    <p>
                                        {new Date(
                                            estimate.estimateDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Total
                                    </p>

                                    <p className="font-bold text-green-600 text-xl">
                                        {estimate.grandTotal}
                                    </p>
                                </div>

                                <div className="col-span-2">

                                    <div className="flex justify-end gap-2">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/estimate/${estimate._id}`
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/edit-estimate/${estimate._id}`
                                                )
                                            }
                                            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded-lg"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                downloadPDF(estimate)
                                            }
                                            className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                                        >
                                            PDF
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteEstimate(
                                                    estimate._id
                                                )
                                            }
                                            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>
                        </div>

                    )
                )}

            </div>

        </div>
    );
};

export default EstimateHistory;