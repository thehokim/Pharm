import React, { useEffect, useState } from "react";
import { Package, Plus, Search, Calendar, DollarSign, Hash, Pill, AlertTriangle, CheckCircle, XCircle, Edit3, Trash2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { BASE_URL } from "../../../../utils/auth";
import Pagination from "../../../../components/layout/Pagination";

// Фармацевтический ToggleSwitch с неоновыми эффектами
const PharmaToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 border-2 ${
      checked 
        ? "bg-emerald-900/30 border-emerald-400/50" 
        : "bg-gray-800/50 border-gray-600/50"
    }`}
    style={{
      boxShadow: checked 
        ? '0 0 20px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.1)' 
        : '0 0 10px rgba(107, 114, 128, 0.2)'
    }}
    tabIndex={0}
    aria-checked={checked}
    type="button"
  >
    <div
      className={`relative w-6 h-6 rounded-full shadow-lg transform transition-all duration-300 ${
        checked ? "translate-x-6 bg-emerald-400" : "translate-x-0 bg-gray-400"
      }`}
      style={{
        boxShadow: checked 
          ? '0 0 15px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.4)' 
          : '0 0 10px rgba(107, 114, 128, 0.5)'
      }}
    >
      {checked && (
        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse opacity-50"></div>
      )}
    </div>
    
    {/* Индикатор видимости */}
    <div className={`absolute ${checked ? 'right-2' : 'left-2'} transition-all duration-300`}>
      {checked ? (
        <Eye className="w-3 h-3 text-emerald-400" 
             style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
      ) : (
        <EyeOff className="w-3 h-3 text-gray-400" />
      )}
    </div>
  </button>
);

// Бейдж категории
const CategoryBadge = ({ category, label }) => {
  const config = category === "medicine" 
    ? {
        color: "text-emerald-400",
        bg: "bg-emerald-900/20",
        border: "border-emerald-400/30",
        icon: Pill,
        glow: "#10b981"
      }
    : {
        color: "text-amber-400",
        bg: "bg-amber-900/20", 
        border: "border-amber-400/30",
        icon: Package,
        glow: "#f59e0b"
      };

  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border ${config.bg} ${config.border}`}
         style={{ boxShadow: `0 0 15px ${config.glow}20` }}>
      <IconComponent className={`w-4 h-4 ${config.color}`} 
                    style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }} />
      <span className={`text-xs font-semibold ${config.color}`}>
        {label}
      </span>
    </div>
  );
};

// Индикатор срока годности
const ExpirationBadge = ({ expirationDate }) => {
  const { t } = useTranslation("product");
  if (!expirationDate) return <span className="text-gray-400">-</span>;
  
  const days = (new Date(expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
  let config;
  
  if (days < 0) {
    config = {
      color: "text-red-400",
      bg: "bg-red-900/20",
      border: "border-red-400/30",
      icon: XCircle,
      glow: "#ef4444",
      label: t("expired")
    };
  } else if (days < 30) {
    config = {
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      border: "border-amber-400/30", 
      icon: AlertTriangle,
      glow: "#f59e0b",
      label: t("expiring")
    };
  } else {
    config = {
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
      border: "border-emerald-400/30",
      icon: CheckCircle,
      glow: "#10b981",
      label: t("valid")
    };
  }

  const IconComponent = config.icon;
  const formattedDate = new Date(expirationDate).toLocaleDateString("ru-RU");

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border ${config.bg} ${config.border}`}
         style={{ boxShadow: `0 0 15px ${config.glow}20` }}>
      <IconComponent className={`w-4 h-4 ${config.color}`} 
                    style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }} />
      <div className={config.color}>
        <span className="text-xs font-semibold block">{config.label}</span>
        <span className="text-xs">{formattedDate}</span>
      </div>
    </div>
  );
};

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
          page: result.meta?.page || 1,
          pageSize: result.meta?.pageSize || PAGE_SIZE,
          total: result.meta?.total || 0,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error(t("error_loading_products"), err));
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
        if (!res.ok) throw new Error(t("error_adding_product"));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl p-6 overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(16, 185, 129, 0.2)' }}>
        
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-cyan-400/10"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-emerald-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Package className="text-emerald-400 w-7 h-7" 
                           style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                  <Pill className="text-cyan-400 w-5 h-5" 
                        style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white"
                  style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>
                {t("products")}
              </h1>
              <p className="text-emerald-400 text-sm mt-1">
                Управление лекарственными препаратами
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Кнопка добавления */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg group overflow-hidden"
              style={{ 
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))'
              }}
              title={t("add_product")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-6 h-6 text-white relative z-10" />
            </button>
            
            {/* Поиск */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-cyan-400 w-5 h-5" 
                        style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
              </div>
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: searchTerm ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl overflow-hidden hidden md:block"
           style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" 
                             style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                    {t("name")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">{t("category")}</th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" 
                               style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                    {t("purchase_price")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" 
                               style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                    {t("selling_price")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-400" 
                          style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                    {t("stock_quantity")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">{t("barcode")}</th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" 
                              style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                    {t("arrival_date")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">{t("expiration_date")}</th>
                <th className="px-6 py-5 font-semibold text-gray-300 text-center">{t("visibility")}</th>
                <th className="px-6 py-5 font-semibold text-gray-300 text-center">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    className="text-center px-6 py-12"
                    colSpan={10}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Package className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        {t("no_products")}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"
                             style={{ boxShadow: '0 0 8px #10b981' }}></div>
                        <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CategoryBadge 
                        category={product.category}
                        label={CATEGORY_LABELS[product.category] || product.category}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-cyan-400 font-semibold">
                        {product.purchase_price?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-semibold">
                        {product.selling_price?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 font-semibold">
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 font-mono text-sm">
                        {product.barcode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">
                        {formatDate(product.arrival_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ExpirationBadge expirationDate={product.expiration_date} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PharmaToggleSwitch
                        checked={!!product.visible_for_media}
                        onChange={async () => {
                          try {
                            await fetch(`${BASE_URL}/api/products/${product.id}`, {
                              method: "PATCH",
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ visible_for_media: !product.visible_for_media }),
                            });
                            fetchProducts(page, PAGE_SIZE);
                          } catch (err) {
                            alert("Ошибка обновления видимости для media");
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditOpen(true);
                          }}
                          className="bg-gray-800 border border-emerald-400/30 p-2 rounded-xl text-emerald-400 hover:border-emerald-400 hover:scale-110 transition-all duration-300"
                          style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}
                          title="Редактировать"
                        >
                          <Edit3 className="w-4 h-4" 
                                style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProduct(product);
                            setIsDeleteOpen(true);
                          }}
                          className="bg-gray-800 border border-red-400/30 p-2 rounded-xl text-red-400 hover:border-red-400 hover:scale-110 transition-all duration-300"
                          style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)' }}
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" 
                                 style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden">
        {filteredProducts.length === 0 ? (
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl py-12 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <span className="text-gray-400 font-medium">{t("no_products")}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 space-y-4"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"
                         style={{ boxShadow: '0 0 8px #10b981' }}></div>
                    <span className="text-lg font-semibold text-white">{product.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsEditOpen(true);
                      }}
                      className="bg-gray-800 border border-emerald-400/30 p-2 rounded-xl text-emerald-400"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingProduct(product);
                        setIsDeleteOpen(true);
                      }}
                      className="bg-gray-800 border border-red-400/30 p-2 rounded-xl text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge 
                    category={product.category}
                    label={CATEGORY_LABELS[product.category] || product.category}
                  />
                  <span className="text-xs text-gray-400 font-mono bg-gray-800/30 px-2 py-1 rounded">
                    {product.barcode}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Закупка:</span>
                    <span className="text-cyan-400 font-semibold block">
                      {product.purchase_price?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Продажа:</span>
                    <span className="text-emerald-400 font-semibold block">
                      {product.selling_price?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Остаток:</span>
                    <span className="text-amber-400 font-semibold block">
                      {product.stock_quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Поступление:</span>
                    <span className="text-gray-300 block">
                      {formatDate(product.arrival_date)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <ExpirationBadge expirationDate={product.expiration_date} />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Видимость для media:</span>
                    <PharmaToggleSwitch
                      checked={!!product.visible_for_media}
                      onChange={async () => {
                        try {
                          await fetch(`${BASE_URL}/api/products/${product.id}`, {
                            method: "PATCH",
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ visible_for_media: !product.visible_for_media }),
                          });
                          fetchProducts(page, PAGE_SIZE);
                        } catch (err) {
                          alert("Ошибка обновления видимости для media");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          page={meta.page}
          pageSize={meta.pageSize}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Модальные окна */}
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