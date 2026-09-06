import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await API.get("/sales");
      setSales(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredSales = sales.filter((sale) =>
    sale.customerName
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    sale.phoneNumber
      ?.includes(search) ||

    sale.billNo
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const deleteSale = async (id) => {

    if (
      !window.confirm(
        "Delete this bill?"
      )
    ) return;

    try {

      await API.delete(
        `/sales/${id}`
      );

      fetchSales();

      alert(
        "Bill Deleted Successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Delete Failed"
      );
    }
  };

  const downloadPDF = (sale) => {

    const doc = new jsPDF();

    // HEADER

    doc.setFontSize(24);
    doc.setFont(undefined, "bold");

    doc.setTextColor(220, 38, 38);
    doc.text("POOJA TOYS", 14, 20);

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");

    doc.text("Rajkot, Gujarat", 14, 28);

    doc.setTextColor(120);
    doc.text("Sales Invoice", 14, 34);

    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.7);
    doc.line(14, 40, 195, 40);

    // CUSTOMER DETAILS

    doc.setFontSize(11);
    doc.setTextColor(0);

    doc.setFont(undefined, "bold");
    doc.text("Customer Name :", 14, 55);

    doc.setFont(undefined, "normal");
    doc.text(
      sale.customerName || "-",
      55,
      55
    );

    doc.setFont(undefined, "bold");
    doc.text("Invoice No :", 120, 55);

    doc.setFont(undefined, "normal");
    doc.text(
      sale.billNo || `BILL-${sale._id.slice(-4).toUpperCase()}`,
      155,
      55
    );

    doc.setFont(undefined, "bold");
    doc.text("Mobile Number :", 14, 68);

    doc.setFont(undefined, "normal");
    doc.text(
      sale.phoneNumber || "-",
      55,
      68
    );

    doc.setFont(undefined, "bold");
    doc.text("Date :", 120, 68);

    doc.setFont(undefined, "normal");
    doc.text(
      new Date(
        sale.createdAt
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
          "Amount"
        ]
      ],

      body: sale.items.map(item => [
        item.productName,
        item.quantity,
        `${item.price}`,
        `${item.total}`
      ]),

      theme: "grid",

      styles: {
        fontSize: 10,
        // halign: "center",
        lineColor: [180, 180, 180],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [37, 99, 235], // Blue
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    // TOTALS

    const subTotal = sale.items.reduce(
      (sum, item) =>
        sum + Number(item.total),
      0
    );

    const finalY =
      doc.lastAutoTable.finalY + 18;

    doc.setFontSize(11);
    doc.setTextColor(0);

    doc.text(
      "Sub Total",
      120,
      finalY
    );

    doc.text(
      `${subTotal}`,
      180,
      finalY,
      { align: "right" }
    );

    doc.text(
      "Discount",
      120,
      finalY + 12
    );

    doc.setTextColor(0);

    doc.text(
      `${sale.discount || 0}`,
      180,
      finalY + 12,
      { align: "right" }
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

    // GRAND TOTAL

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
      "Grand Total =",
      120,
      finalY + 34
    );

    doc.setTextColor(
      220,
      38,
      38
    );

    doc.text(
      `${sale.grandTotal} /-`,
      185,
      finalY + 34,
      { align: "right" }
    );

    // NOTE

    const noteY =
      finalY + 58;

    doc.setDrawColor(
      37,
      99,
      235
    );

    doc.line(
      14,
      noteY - 8,
      195,
      noteY - 8
    );

    doc.setTextColor(0);

    doc.setFont(
      undefined,
      "bold"
    );

    doc.text(
      "Note",
      14,
      noteY
    );

    doc.setFont(
      undefined,
      "normal"
    );

    // doc.setTextColor(80);

    doc.text(
      "• Goods once sold will not be returned or exchanged.",
      14,
      noteY + 10
    );

    // SAVE PDF

    doc.save(
      `${sale.billNo || '-'}.pdf`
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Sales History
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Bill No, Customer, Mobile..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded-lg w-full md:w-96"
        />
      </div>

      <div className="space-y-4">
        {filteredSales.length > 0 ? (
          filteredSales.map((sale) => (
            <div
              key={sale._id}
              className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">

                <div>
                  <p className="text-gray-500 text-sm">
                    Bill No
                  </p>

                  <p className="font-bold text-blue-600 text-lg">
                    {sale.billNo || `BILL-${sale._id.slice(-4).toUpperCase()}`}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Customer
                  </p>

                  <p className="font-semibold text-lg">
                    {sale.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Mobile
                  </p>

                  <p>
                    {sale.phoneNumber}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Purchase Date
                  </p>

                  <p>
                    {new Date(
                      sale.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Grand Total
                  </p>

                  <p className="font-bold text-green-600 text-xl">
                    ₹{sale.grandTotal}
                  </p>
                </div>

                <div className="col-span-2">

                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() =>
                        navigate(
                          `/sales-history/${sale._id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/edit-sale/${sale._id}`
                        )
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        downloadPDF(sale)
                      }
                      className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                    >
                      PDF
                    </button>

                    <button
                      onClick={() =>
                        deleteSale(sale._id)
                      }
                      className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl text-center text-gray-500">
            No Sales Found
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;