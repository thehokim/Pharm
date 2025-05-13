import React, { useState } from "react";
import { Box, Plus, Search } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

const initialProducts = [
  {
    name: "Парацетамол",
    category: "Жаропонижающее",
    price: 4500,
    stock: 120,
    incoming: 1500000,
    outgoing: 750000,
    active: true,
  },
  {
    name: "Амоксициллин",
    category: "Антибиотик",
    price: 7200,
    stock: 30,
    incoming: 980000,
    outgoing: 620000,
    active: true,
  },
  {
    name: "Нурофен",
    category: "Болеутоляющее",
    price: 8800,
    stock: 0,
    incoming: 250000,
    outgoing: 250000,
    active: false,
  },
  {
    name: "Цитрамон",
    category: "Обезболивающее",
    price: 3000,
    stock: 65,
    incoming: 860000,
    outgoing: 420000,
    active: true,
  },
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.name === editingProduct.name ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = () => {
    setProducts((prev) => prev.filter((p) => p.name !== deletingProduct.name));
    setIsDeleteOpen(false);
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
              <th className="px-6 py-4 bg-gray-100">Цена</th>
              <th className="px-6 py-4 bg-gray-100">Остаток</th>
              <th className="px-6 py-4 bg-gray-100">Приход</th>
              <th className="px-6 py-4 bg-gray-100">Расход</th>
              <th className="px-6 py-4 bg-gray-100">Статус</th>
              <th className="px-6 py-4 bg-gray-100 text-center rounded-tr-xl">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((item, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.price.toLocaleString()} сум</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4 text-green-600">
                  {item.incoming.toLocaleString()} сум
                </td>
                <td className="px-6 py-4 text-red-500">
                  {item.outgoing.toLocaleString()} сум
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.active ? "Активен" : "Неактивен"}
                  </span>
                </td>
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
