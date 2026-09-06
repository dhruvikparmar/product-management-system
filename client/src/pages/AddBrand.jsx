import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AddBrand = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("status", formData.status);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.post("/brands", data, {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      });

      alert("Brand Added Successfully");

      navigate("/brands");

    } catch (error) {
      console.log(error);
      alert("Failed To Add Brand");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Add Brand
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Brand Image
            </label>

            <input
              type="file"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files[0],
                })
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Brand Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Enter Brand Name"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Add Brand
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBrand;