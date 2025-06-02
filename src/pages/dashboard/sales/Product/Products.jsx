import React, { useEffect, useState } from "react";
import { Box, Plus, Search } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { BASE_URL } from "../../../../utils/auth";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const token = localStorage.getItem("token");

  const fetchProducts = () => {
    fetch(`${BASE_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Ошибка загрузки продуктов:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (product) => {
    fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка добавления");
        return res.json();
      })
      .then(() => fetchProducts())
      .catch((err) => alert(err.message));
  };

  const handleEditProduct = (updatedProduct) => {
    if (!editingProduct?.id) return;

    fetch(`${BASE_URL}/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка обновления");
        return res.json();
      })
      .then(() => fetchProducts())
      .catch((err) => alert(err.message));
  };

  const handleDeleteProduct = () => {
    if (!deletingProduct?.id) return;

    fetch(`${BASE_URL}/api/products/${deletingProduct.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления");
        return res.json();
      })
      .then(() => {
        fetchProducts();
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <Box /> Каталог товаров
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-3 py-3 rounded-full hover:bg-gray-900 transition"
          >
            <Plus size={16} />
          </button>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск товаров..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Название</th>
              <th className="px-6 py-4 bg-gray-100">Категория</th>
              <th className="px-6 py-4 bg-gray-100">Закупка</th>
              <th className="px-6 py-4 bg-gray-100">Продажа</th>
              <th className="px-6 py-4 bg-gray-100">Остаток</th>
              <th className="px-6 py-4 bg-gray-100">Штрих-код</th>
              <th className="px-6 py-4 bg-gray-100">Срок годности</th>
              <th className="px-6 py-4 bg-gray-100 text-center rounded-tr-xl">Действия</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4 text-green-700">{item.purchase_price.toLocaleString()} сум</td>
                <td className="px-6 py-4 text-blue-700">{item.selling_price.toLocaleString()} сум</td>
                <td className="px-6 py-4">{item.stock_quantity}</td>
                <td className="px-6 py-4">{item.barcode}</td>
                <td className="px-6 py-4">{item.expiration_date}</td>
                <td className="px-6 py-4 flex justify-center">
                  <ActionMenu
                    onEdit={() => {
                      setEditingProduct(item);
                      setIsEditOpen(true);
                    }}
                    onDelete={() => {
                      setDeletingProduct(item);
                      setIsDeleteOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddProduct}
      />

      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={editingProduct}
        onSubmit={handleEditProduct}
      />

      <DeleteProductModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteProduct}
        product={deletingProduct}
      />
    </div>
  );
};

export default Products;
//дата приход срок годности