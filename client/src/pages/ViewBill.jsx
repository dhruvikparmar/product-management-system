import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const ViewBill = () => {
  const { id } = useParams();

  const [sale, setSale] = useState(null);

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const res = await API.get(`/sales/${id}`);
      setSale(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!sale) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div>

      <div id="sales-bill" className="bg-white rounded-xl shadow-lg p-6">

        <div className="flex justify-between items-start border-b pb-5 mb-5">

          <div>

            <h1 className="text-4xl font-bold">
              POOJA TOYS
            </h1>

            <p className="text-gray-600 mt-2">
              Rajkot, Gujarat
            </p>

            <p className="text-gray-600">
              Sales Invoice
            </p>

          </div>

          <button
            onClick={() => window.print()}
            className="print-btn bg-green-600 hover:bg-green-700 cursor-pointer text-white px-5 py-2 rounded-lg"
          >
            Print Bill
          </button>

        </div>

        {/* Customer Details */}

        <div className="border-b pb-5 mb-5">

          <div className="grid grid-cols-2 gap-y-4">

            <div>
              <span className="font-bold">
                Customer Name :
              </span>

              <span className="ml-2">
                {sale.customerName}
              </span>
            </div>

            <div className="text-right">
              <span className="font-bold">
                Invoice No :
              </span>

              <span className="ml-2 text-blue-600 font-semibold">
                {sale.billNo}
              </span>
            </div>

            <div>
              <span className="font-bold">
                Mobile Number :
              </span>

              <span className="ml-2">
                {sale.phoneNumber}
              </span>
            </div>

            <div className="text-right">
              <span className="font-bold">
                Date :
              </span>

              <span className="ml-2">
                {new Date(
                  sale.createdAt
                ).toLocaleDateString("en-IN")}
              </span>
            </div>

          </div>

        </div>

        {/* Product Table */}

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead>

              <tr className="bg-gray-100">

                <th className="border p-3">
                  Product
                </th>

                <th className="border p-3 text-center">
                  Qty
                </th>

                <th className="border p-3 text-center">
                  Rate
                </th>

                <th className="border p-3 text-center">
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {sale.items.map(
                (item, index) => (
                  <tr key={index}>

                    <td className="border p-3">
                      {item.productName}
                    </td>

                    <td className="border p-3 text-center">
                      {item.quantity}
                    </td>

                    <td className="border p-3 text-center">
                      ₹{item.price}
                    </td>

                    <td className="border p-3 text-center font-semibold">
                      ₹{item.total}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Totals */}

        <div className="flex justify-end mt-8">

          <div className="w-80">

            <div className="flex justify-between py-2">

              <span>
                Sub Total
              </span>

              <span>
                ₹
                {sale.items.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.total),
                  0
                )}
              </span>

            </div>

            <div className="flex justify-between py-2">

              <span>
                Discount
              </span>

              <span>
                ₹{sale.discount || 0}
              </span>

            </div>

            <div className="flex justify-between py-3 border-t text-3xl font-bold text-green-600">

              <span className="text-green-600">
                Grand Total
              </span>

              <span>
                ₹{sale.grandTotal}
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

export default ViewBill;