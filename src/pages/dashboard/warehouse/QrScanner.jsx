import React, { useState } from "react";
import { QrReader } from "react-qr-reader"; // ✅ правильный импорт
import { useTranslation } from "react-i18next";

const QrScanner = () => {
  const { t } = useTranslation("warehouse");
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError(t("scan_error"));
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">{t("qr_scanner")}</h2>
      <p className="text-gray-600">{t("scan_info")}</p>

      <div className="w-full max-w-md">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </div>

      {scanResult && (
        <div className="bg-white shadow p-4 rounded-xl">
          <h3 className="font-semibold mb-2">{t("scan_result")}</h3>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">{scanResult}</pre>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default QrScanner;
