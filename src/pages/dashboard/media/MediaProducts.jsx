import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../utils/auth";
import { useTranslation } from "react-i18next";

const MediaProducts = () => {
  const { t } = useTranslation("media");
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/products?visible_for_media=true`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(t("error"));
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token, t]);

  if (loading) return <div className="p-6">{t("loading")}</div>;
  if (error) return <div className="p-6 text-red-500">{t("error")}: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("title")}</h1>
        {products.length === 0 ? (
          <div className="text-gray-500">{t("no_products")}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer flex flex-col"
                onClick={() => setSelected(p)}
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-t-xl text-gray-400 text-4xl">
                    <span>📦</span>
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-semibold text-lg text-gray-800 mb-1">{p.name}</h2>
                  <div className="text-xs text-gray-500 mb-2">{t("category")}: {p.category}</div>
                  <div className="text-xs text-gray-500 mb-2">{t("barcode")}: {p.barcode}</div>
                  <div className="text-sm text-indigo-700 font-bold mb-2">{t("price")}: {p.selling_price?.toLocaleString()} сум</div>
                  <button
                    className="mt-auto text-blue-600 hover:underline text-sm font-medium"
                    onClick={e => { e.stopPropagation(); setSelected(p); }}
                  >{t("details")}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setSelected(null)}
              title={t("close")}
            >×</button>
            <h2 className="text-2xl font-bold mb-4">{selected.name}</h2>
            {selected.image_url && (
              <img src={selected.image_url} alt={selected.name} className="mb-4 w-full h-60 object-contain rounded-xl bg-gray-100" />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selected).map(([key, value]) => (
                <div key={key}>
                  <span className="font-semibold text-gray-700">{t(key, key)}:</span> {String(value)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaProducts; 