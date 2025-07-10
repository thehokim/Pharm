import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// USER
import userru from "./Localization/userru.json";
import useruz from "./Localization/useruz.json";
import useruzcryl from "./Localization/useruzcryl.json";

// SUPPLIER
import supplierru from "./Localization/supplierru.json";
import supplieruz from "./Localization/supplieruz.json";
import supplieruzcryl from "./Localization/supplieruzcryl.json";

// BOOKING
import bookingru from "./Localization/bookinru.json";
import bookinguz from "./Localization/bookinguz.json";
import bookinguzcryl from "./Localization/bookinguzcryl.json";

// CLIENT
import clientru from "./Localization/clientru.json";
import clientuz from "./Localization/clientuz.json";
import clientuzcryl from "./Localization/clientuzcryl.json";

// HOME (Admin)
import homeru from "./pages/dashboard/admin/Home/Localization/homeru.json";
import homeuz from "./pages/dashboard/admin/Home/Localization/homeuz.json";
import homeuzcryl from "./pages/dashboard/admin/Home/Localization/homeuzcryl.json";

// SALES HOME (добавь этот namespace!)
import sales_homeru from "./pages/dashboard/sales/Home/Localization/sales_homeru.json";
import sales_homeuz from "./pages/dashboard/sales/Home/Localization/sales_homeuz.json";
import sales_homeuzcryl from "./pages/dashboard/sales/Home/Localization/sales_homeuzcryl.json";

import home_accountantuz from "./pages/dashboard/accountant/Home/Localization/home_accountantuz.json";
import home_accountantru from "./pages/dashboard/accountant/Home/Localization/home_accountantru.json";
import home_accountantuzcryl from "./pages/dashboard/accountant/Home/Localization/home_accountantuzcryl.json";

// ORDER
import orderru from "./pages/dashboard/admin/Order/Localization/orderru.json";
import orderuz from "./pages/dashboard/admin/Order/Localization/orderuz.json";
import orderuzcryl from "./pages/dashboard/admin/Order/Localization/orderuzcryl.json";

// PRODUCT
import productru from "./pages/dashboard/admin/Product/Localization/productru.json";
import productuz from "./pages/dashboard/admin/Product/Localization/productuz.json";
import productuzcryl from "./pages/dashboard/admin/Product/Localization/productuzcryl.json";

// SETTINGS
import settingru from "./pages/dashboard/admin/Settings/Localization/settingru.json";
import settinguz from "./pages/dashboard/admin/Settings/Localization/settinguz.json";
import settinguzcryl from "./pages/dashboard/admin/Settings/Localization/settinguzcryl.json";

// ANALYTICS
import analyticsru from "./Localization/analyticsru.json";
import analyticsuz from "./Localization/analyticsuz.json";
import analyticsuzcryl from "./Localization/analyticsuzcryl.json";

// LOGS
import logsru from "./pages/dashboard/admin/LogsAdmin/Localization/logsru.json";
import logsuz from "./pages/dashboard/admin/LogsAdmin/Localization/logsuz.json";
import logsuzcryl from "./pages/dashboard/admin/LogsAdmin/Localization/logsuzcryl.json";

// NOTIF
import notifru from "./pages/dashboard/admin/Notif/Localization/notifru.json";
import notifuz from "./pages/dashboard/admin/Notif/Localization/notifuz.json";
import notifuzcryl from "./pages/dashboard/admin/Notif/Localization/notifuzcryl.json";

// SIDEBAR
import sidebarru from "./components/layout/Locals/sidebarru.json";
import sidebaruz from "./components/layout/Locals/sidebaruz.json";
import sidebaruzcryl from "./components/layout/Locals/sidebaruzcryl.json";

import acc_debt_ru from "./pages/dashboard/accountant/Debts/Localization/acc_debt_ru.json";
import acc_debt_uz from "./pages/dashboard/accountant/Debts/Localization/acc_debt_uz.json";
import acc_debt_uzcryl from "./pages/dashboard/accountant/Debts/Localization/acc_debt_uzcryl.json"

import acc_rept_ru from "./pages/dashboard/accountant/Reports/Localization/acc_rept_ru.json";
import acc_rept_uz from "./pages/dashboard/accountant/Reports/Localization/acc_rept_uz.json";
import acc_rept_uzcryl from "./pages/dashboard/accountant/Reports/Localization/acc_rept_uzcryl.json"

import acc_tax_ru from "./pages/dashboard/accountant/Taxes/Localization/acc_tax_ru.json";
import acc_tax_uz from "./pages/dashboard/accountant/Taxes/Localization/acc_tax_uz.json";
import acc_tax_uzcryl from "./pages/dashboard/accountant/Taxes/Localization/acc_tax_uzcryl.json"

// --- Добавляй новые разделы по аналогии выше ---

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        user: userru,
        supplier: supplierru,
        booking: bookingru,
        client: clientru,
        home: homeru,
        order: orderru,
        product: productru,
        settings: settingru,
        analytics: analyticsru,
        logs: logsru,
        notif: notifru,
        sidebar: sidebarru,
        sales_home: sales_homeru, // добавлено
        home_accountant: home_accountantru,
        acc_debt:acc_debt_ru,
        acc_rept: acc_rept_ru,
        acc_tax: acc_tax_ru
      },
      uz: {
        user: useruz,
        supplier: supplieruz,
        booking: bookinguz,
        client: clientuz,
        home: homeuz,
        order: orderuz,
        product: productuz,
        settings: settinguz,
        analytics: analyticsuz,
        logs: logsuz,
        notif: notifuz,
        sidebar: sidebaruz,
        sales_home: sales_homeuz, // добавлено
        home_accountant: home_accountantuz,
        acc_debt:acc_debt_uz,
        acc_rept: acc_rept_uz,
        acc_tax: acc_tax_uz
        
      },
      uzcryl: {
        user: useruzcryl,
        supplier: supplieruzcryl,
        booking: bookinguzcryl,
        client: clientuzcryl,
        home: homeuzcryl,
        order: orderuzcryl,
        product: productuzcryl,
        settings: settinguzcryl,
        analytics: analyticsuzcryl,
        logs: logsuzcryl,
        notif: notifuzcryl,
        sidebar: sidebaruzcryl,
        sales_home: sales_homeuzcryl, // добавлено
        home_accountant: home_accountantuzcryl,
        acc_debt: acc_debt_uzcryl,
        acc_rept: acc_rept_uzcryl,
        acc_tax: acc_tax_uzcryl
      }
    },
    lng: "ru",
    fallbackLng: "ru",
    ns: [
      "user",
      "supplier",
      "booking",
      "client",
      "home",
      "order",
      "product",
      "settings",
      "analytics",
      "logs",
      "notif",
      "sidebar",
      "sales_home", // добавлен новый namespace
      "home_accountant",
      "acc_debt",
      "acc_rept",
      "acc_tax"
      // добавляй сюда новые разделы при необходимости
    ],
    defaultNS: "user",
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
