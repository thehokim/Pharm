import React, { useEffect, useState } from "react";
import { Box, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { BASE_URL } from "../../../../utils/auth";
import Pagination from "../../../../components/layout/Pagination";

const PAGE_SIZE = 10;

const Products = () => {
  const { t } = useTranslation("product");

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");

  // Основной fetch с пагинацией
  const fetchProducts = (page = 1, pageSize = PAGE_SIZE) => {
    fetch(`${BASE_URL}/api/products?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProducts(Array.isArray(result.data) ? result.data : []);
        setMeta({
          page: (result.meta?.page ?? 0) + 1, // если сервер отдаёт 0 — смещаем на 1
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error("Ошибка загрузки продуктов:", err));
  };

  useEffect(() => {
    fetchProducts(page, PAGE_SIZE);
    // eslint-disable-next-line
  }, [page]);

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
      .then(() => {
        fetchProducts(page, PAGE_SIZE);
        setIsAddOpen(false);
      })
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
      .then(() => {
        fetchProducts(page, PAGE_SIZE);
        setIsEditOpen(false);
      })
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
        fetchProducts(page, PAGE_SIZE);
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  // Фильтрация только текущей страницы продуктов
  const filteredProducts = products.filter((item) =>
    [item.name, item.category, item.barcode]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  function getExpirationClass(expiration_date) {
    if (!expiration_date) return "";
    const days =
      (new Date(expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
    if (days < 0) return "text-red-600 font-bold";
    if (days < 30) return "text-yellow-600 font-semibold";
    return "text-green-700";
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toLocaleDateString("ru-RU");
  }

  const CATEGORY_LABELS = {
    medicine: t("category.medicine"),
    other: t("category.other"),
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <div className="bg-white flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-gray-200 gap-3">
        <div className="flex justify-center items-center gap-3">
        <div className="p-3 rounded-full bg-indigo-100">
          <Box className="text-indigo-700"/>
        </div>
        <span className="text-2xl font-semibold text-gray-800 "> {t("products")}</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-2xl focus:outline-none"
            title={t("add_product")}
          >
            <Plus size={22} />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Table (desktop), Cards (mobile) */}
      <div className="bg-white rounded-2xl border border-gray-200">
        {/* Desktop table */}
        <table className="min-w-full text-sm text-left text-gray-700 hidden md:table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <th className="px-6 py-4 rounded-tl-xl">{t("name")}</th>
              <th className="px-6 py-4">{t("category")}</th>
              <th className="px-6 py-4">{t("purchase_price")}</th>
              <th className="px-6 py-4">{t("selling_price")}</th>
              <th className="px-6 py-4">{t("stock_quantity")}</th>
              <th className="px-6 py-4">{t("barcode")}</th>
              <th className="px-6 py-4">{t("arrival_date")}</th>
              <th className="px-6 py-4">{t("expiration_date")}</th>
              <th className="px-6 py-4 text-center rounded-tr-xl">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-7 text-center text-gray-400 font-medium"
                  colSpan={9}
                >
                  {t("no_data")}
                </td>
              </tr>
            ) : (
              filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-indigo-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        item.category === "medicine"
                          ? "px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                          : "px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800"
                      }
                    >
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-green-700">
                    {item.purchase_price?.toLocaleString()} {t("soum")}
                  </td>
                  <td className="px-6 py-4 text-blue-700">
                    {item.selling_price?.toLocaleString()} {t("soum")}
                  </td>
                  <td className="px-6 py-4">{item.stock_quantity}</td>
                  <td className="px-6 py-4">{item.barcode}</td>
                  <td className="px-6 py-4">{formatDate(item.created_at)}</td>
                  <td
                    className={`px-6 py-4 ${getExpirationClass(
                      item.expiration_date
                    )}`}
                  >
                    {formatDate(item.expiration_date)}
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
              ))
            )}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="block md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-medium">{t("no_data")}</div>
          ) : (
            <div className="space-y-4 p-2">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white space-y-2 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">{item.name}</span>
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
                  </div>
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <span
                      className={
                        item.category === "medicine"
                          ? "px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                          : "px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800"
                      }
                    >
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                    <span className="text-xs text-gray-400">{item.barcode}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold">{t("purchase_price")}: </span>
                      <span className="text-green-700">{item.purchase_price?.toLocaleString()} {t("soum")}</span>
                    </div>
                    <div>
                      <span className="font-semibold">{t("selling_price")}: </span>
                      <span className="text-blue-700">{item.selling_price?.toLocaleString()} {t("soum")}</span>
                    </div>
                    <div>
                      <span className="font-semibold">{t("stock_quantity")}: </span>
                      {item.stock_quantity}
                    </div>
                    <div>
                      <span className="font-semibold">{t("arrival_date")}: </span>
                      {formatDate(item.created_at)}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">{t("expiration_date")}: </span>
                      <span className={getExpirationClass(item.expiration_date)}>
                        {formatDate(item.expiration_date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      {/* Модалки */}
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
