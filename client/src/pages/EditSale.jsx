import React from 'react'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EditSale() {

const { id } = useParams();

const navigate = useNavigate();

const [products, setProducts] =
  useState([]);

const [customerName,
  setCustomerName] =
  useState("");

const [phoneNumber,
  setPhoneNumber] =
  useState("");

const [items, setItems] =
  useState([]);

const [discount,
  setDiscount] =
  useState(0);

  useEffect(() => {

  fetchProducts();
  fetchSale();

}, []);

const fetchProducts = async () => {

  const res =
    await API.get("/products");

  setProducts(res.data);
};

const fetchSale = async () => {

  const res =
    await API.get(`/sales/${id}`);

  const sale = res.data;

  setCustomerName(
    sale.customerName
  );

  setPhoneNumber(
    sale.phoneNumber
  );

  setItems(
    sale.items
  );

  setDiscount(
    sale.discount || 0
  );
};

const handleQtyChange =
(index, qty) => {

  const updated =
    [...items];

  updated[index].quantity =
    Number(qty);

  updated[index].total =
    Number(updated[index].price) *
    Number(qty);

  setItems(updated);
};

const handlePriceChange =
(index, price) => {

  const updated =
    [...items];

  updated[index].price =
    Number(price);

  updated[index].total =
    Number(price) *
    Number(updated[index].quantity);

  setItems(updated);
};

const removeItem = (index) => {

  const updated =
    items.filter(
      (_, i) => i !== index
    );

  setItems(updated);
};

const grandTotal =
  items.reduce(
    (sum, item) =>
      sum + Number(item.total),
    0
  ) - Number(discount);

  const updateSale = async () => {

  try {

    await API.put(
      `/sales/${id}`,
      {
        customerName,
        phoneNumber,
        items,
        discount,
        grandTotal,
      }
    );

    alert(
      "Sale Updated Successfully"
    );

    navigate(
      "/sales-history"
    );

  } catch (error) {

    alert(
      error.response?.data
        ?.message ||
      "Update Failed"
    );

  }
};

 return (
  <div>

    <h1 className="text-3xl font-bold mb-6">
      Edit Sale
    </h1>

    <div className="bg-white p-6 rounded-xl shadow">

      {/* CUSTOMER DETAILS */}

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
            Mobile Number
          </label>

          <input
            type="text"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

      </div>

      {/* PRODUCTS */}

      {items.map((item, index) => (

        <div
          key={index}
          className="border rounded-xl p-4 mb-4"
        >

          <div className="grid md:grid-cols-5 gap-4 items-end">

            <div>
              <label className="block mb-1 text-sm text-gray-500">
                Product
              </label>

              <input
                type="text"
                value={item.productName}
                readOnly
                className="w-full border p-3 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-500">
                Selling Price
              </label>

              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handlePriceChange(
                    index,
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-500">
                Quantity
              </label>

              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleQtyChange(
                    index,
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-500">
                Total
              </label>

              <input
                type="text"
                value={`₹${item.total}`}
                readOnly
                className="w-full border p-3 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <button
                onClick={() =>
                  removeItem(index)
                }
                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-5 py-3 rounded-lg w-full"
              >
                Remove
              </button>
            </div>

          </div>

        </div>

      ))}

      {/* DISCOUNT */}

      <div className="flex justify-end mb-4">

        <div className="w-60">

          <label className="block mb-2 font-medium">
            Discount
          </label>

          <input
            type="number"
            value={discount}
            onChange={(e) =>
              setDiscount(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />

        </div>

      </div>

      {/* TOTAL */}

      <div className="text-right mb-6">

        <h2 className="text-3xl font-bold text-green-600">
          Grand Total :
          ₹{grandTotal}
        </h2>

      </div>

      {/* BUTTONS */}

      <div className="flex gap-3">

        <button
          onClick={updateSale}
          className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-3 rounded-lg"
        >
          Update Sale
        </button>

        <button
          onClick={() =>
            navigate(
              "/sales-history"
            )
          }
          className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-6 py-3 rounded-lg"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
);
}
