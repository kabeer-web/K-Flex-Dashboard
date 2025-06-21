import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const BACKEND_URL = "https://kflex-backend.vercel.app";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [alertMsg, setAlertMsg] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    setEditingProduct(product);
    setForm(
      product
        ? {
            name: product.name,
            description: product.description,
            price: product.price,
            image: null,
          }
        : {
            name: "",
            description: "",
            price: "",
            image: null,
          }
    );
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingProduct) {
        await axios.put(`${BACKEND_URL}/api/products/${editingProduct._id}`, formData);
        showAlert("Product Updated ✅");
      } else {
        await axios.post(`${BACKEND_URL}/api/products`, formData);
        showAlert("Product Added ✅");
      }
      fetchProducts();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong ❌", true);
    }
  };

  const confirmDelete = (productId) => {
    setDeleteConfirm(productId);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${deleteConfirm}`);
      showAlert("Product Deleted ✅");
      fetchProducts();
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete ❌", true);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const showAlert = (msg, error = false) => {
    setAlertMsg({ text: msg, error });
    setTimeout(() => setAlertMsg(null), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 relative">
        {alertMsg && (
          <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl text-white z-50 backdrop-blur-xl bg-opacity-80 animate-fade-in transition-all duration-300 ${
              alertMsg.error ? "bg-red-500" : "bg-[#feb500]"
            }`}
          >
            {alertMsg.text}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">K-Flex Products</h2>
          <button
            onClick={() => openModal()}
            className="bg-[#feb500] text-black px-4 py-2 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-yellow-50">
                  <td className="p-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">Rs {p.price}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openModal(p)}
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4 text-yellow-700">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded-xl"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded-xl"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded-xl"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 w-full py-2 text-white rounded-xl hover:bg-yellow-600"
                >
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
