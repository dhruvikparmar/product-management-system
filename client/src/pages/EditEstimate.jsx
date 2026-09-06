import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditEstimate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    fetchEstimate();
  }, []);

  const fetchEstimate = async () => {
    try {
      const res = await API.get(`/estimates/${id}`);

      setEstimate(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateItem = (
    index,
    field,
    value
  ) => {
    const updatedItems = [
      ...estimate.items,
    ];

    updatedItems[index][field] =
      value;

    updatedItems[index].total =
      Number(
        updatedItems[index].price
      ) *
      Number(
        updatedItems[index].quantity
      );

    setEstimate({
      ...estimate,
      items: updatedItems,
    });
  };

  const removeItem = (index) => {
    const updatedItems =
      estimate.items.filter(
        (_, i) => i !== index
      );

    setEstimate({
      ...estimate,
      items: updatedItems,
    });
  };

  const addItem = () => {
    setEstimate({
      ...estimate,
      items: [
        ...estimate.items,
        {
          productId: "",
          productName: "",
          price: 0,
          quantity: 1,
          total: 0,
        },
      ],
    });
  };

  const subtotal =
    estimate?.items?.reduce(
      (sum, item) =>
        sum + Number(item.total),
      0
    ) || 0;

  const discountAmount =
    estimate?.discountType ===
    "percentage"
      ? subtotal *
        (Number(
          estimate.discountValue
        ) /
          100)
      : Number(
          estimate?.discountValue ||
            0
        );

  const grandTotal =
    subtotal - discountAmount;

  const handleUpdate =
    async () => {
      try {
        await API.put(
          `/estimates/${id}`,
          {
            ...estimate,
            grandTotal,
          }
        );

        alert(
          "Estimate Updated Successfully"
        );

        navigate(
          "/estimate-history"
        );
      } catch (error) {
        console.log(error);
      }
    };

  if (!estimate)
    return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Edit Estimate
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        {/* Customer */}

        <div className="grid md:grid-cols-3 gap-5 mb-6">

          <div>
            <label className="block mb-2">
              Customer Name
            </label>

            <input
              type="text"
              value={
                estimate.customerName
              }
              onChange={(e) =>
                setEstimate({
                  ...estimate,
                  customerName:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">
              Mobile Number
            </label>

            <input
              type="text"
              value={
                estimate.customerMobile
              }
              onChange={(e) =>
                setEstimate({
                  ...estimate,
                  customerMobile:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">
              Date
            </label>

            <input
              type="date"
              value={
                estimate.estimateDate?.split(
                  "T"
                )[0]
              }
              onChange={(e) =>
                setEstimate({
                  ...estimate,
                  estimateDate:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

        </div>

        {/* Products */}

        <div className="space-y-4">

          {estimate.items.map(
            (item, index) => (
              <div
                key={index}
                className="grid md:grid-cols-5 gap-4 border p-4 rounded-xl"
              >

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
                  className="border p-3 rounded"
                  placeholder="Product Name"
                />

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
                  className="border p-3 rounded"
                  placeholder="Price"
                />

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
                  className="border p-3 rounded"
                  placeholder="Quantity"
                />

                <input
                  type="text"
                  value={`₹${item.total}`}
                  readOnly
                  className="border p-3 rounded bg-gray-100"
                />

                <button
                  onClick={() =>
                    removeItem(index)
                  }
                  className="bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-lg"
                >
                  Remove
                </button>

              </div>
            )
          )}

        </div>

        <button
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2 rounded-lg mt-5"
        >
          + Add Item
        </button>

        {/* Discount */}

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <select
            value={
              estimate.discountType
            }
            onChange={(e) =>
              setEstimate({
                ...estimate,
                discountType:
                  e.target.value,
              })
            } 
            className="border p-3 rounded-lg cursor-pointer"
          >
            <option value="amount">
              Amount ₹
            </option>

            <option value="percentage">
              Percentage %
            </option>
          </select>

          <input
            type="number"
            value={
              estimate.discountValue
            }
            onChange={(e) =>
              setEstimate({
                ...estimate,
                discountValue:
                  e.target.value,
              })
            }
            className="border p-3 rounded-lg"
            placeholder="Discount"
          />

        </div>

        {/* Total */}

        <div className="text-right mt-8">

          <h3 className="text-lg">
            Subtotal : ₹{subtotal}
          </h3>

          <h3 className="text-lg text-red-500">
            Discount : ₹
            {discountAmount}
          </h3>

          <h2 className="text-3xl font-bold text-green-600">
            Grand Total : ₹
            {grandTotal}
          </h2>

        </div>

        <button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-3 rounded-lg mt-6"
        >
          Update Estimate
        </button>

      </div>
    </div>
  );
};

export default EditEstimate;