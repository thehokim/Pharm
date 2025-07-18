import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Globe, User, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { setUserRole, setToken, BASE_URL } from "../utils/auth";
import LogPhoto from "../assets/login1.jpg";

const Login = ({ onLogin }) => {
  const [username, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const translations = {
    ru: {
      title: "Добро пожаловать",
      subtitle: "Войдите в свою учетную запись",
      login: "Логин",
      password: "Пароль",
      submit: "Войти",
      error: "Неверный логин или пароль",
      unknownRole: "Неизвестная роль",
      loginError: "Ошибка входа",
      welcome: "Добро пожаловать",
      showPassword: "Показать пароль",
      hidePassword: "Скрыть пароль",
      systemOnline: "Система онлайн",
      safety: "Защищено с помощью современных технологий",
      erpSystem: "ERP Система",
      control: "Управляйте вашим бизнесом эффективно с нашей современной системой",
      intuitive: "Интуитивный интерфейс",
      multilang: "Многоязычная поддержка",
      secureAuth: "Безопасная аутентификация"
    },
    uz: {
      title: "Xush kelibsiz",
      subtitle: "Hisobingizga kiring",
      login: "Login",
      password: "Parol",
      submit: "Kirish",
      error: "Noto'g'ri login yoki parol",
      unknownRole: "Noma'lum rol",
      loginError: "Kirish xatosi",
      welcome: "Xush kelibsiz",
      showPassword: "Parolni ko'rsatish",
      hidePassword: "Parolni yashirish",
      systemOnline: "Tizim online",
      safety: "Zamonaviy texnologiyalar bilan himoyalangan",
      erpSystem: "ERP Tizimi",
      control: "Biznesingizni bizning zamonaviy tizimimiz bilan samarali boshqaring",
      intuitive: "Intuitiv interfeys",
      multilang: "Ko'p tildagi qo'llab-quvvatlash",
      secureAuth: "Xavfsiz autentifikatsiya"
    },
    uzcryl: {
      title: "Хуш келибсиз",
      subtitle: "Ҳисобингизга киринг",
      login: "Логин",
      password: "Парол",
      submit: "Кириш",
      error: "Нотўғри логин ёки парол",
      unknownRole: "Номаълум рол",
      loginError: "Кириш хатоси",
      welcome: "Хуш келибсиз",
      showPassword: "Паролни кўрсатиш",
      hidePassword: "Паролни яшириш",
      systemOnline: "Тизим онлайн",
      safety: "Замонавий технологиялар билан ҳимояланган",
      erpSystem: "ERP Тизими",
      control: "Бизнеснинг бизнинг замонавий тизимимиз билан самаравий бошқаринг",
      intuitive: "Интуитив интерфейс",
      multilang: "Кўп тилдаги қўллаб-қувватлаш",
      secureAuth: "Хавфсиз аутентификация"
    }
  };

  const t = translations[language];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/api/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(t.error);
      }

      const data = await response.json();
      const { access_token, role } = data;
      
      setToken(access_token);
      setUserRole(role);
      
      if (onLogin) onLogin();
      
      switch (role) {
        case "admin":
        case "sales":
        case "accountant":
        case "warehouse":
        case "media":
          navigate(`/${role}`);
          break;
        default:
          alert(t.unknownRole);
      }
    } catch (error) {
      alert(error.message || t.loginError);
    } finally {
      setIsLoading(false);
    }
  };

  const cycleLanguage = () => {
    const languages = ["ru", "uz", "uzcryl"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const getLanguageDisplay = () => {
    switch(language) {
      case "ru": return "РУ";
      case "uz": return "UZ";
      case "uzcryl": return "ЎЗ";
      default: return "РУ";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-700 to-slate-900">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-purple-800/90 backdrop-blur-sm"></div>
        {/* Static Image with Overlay */}
        <img 
          src={LogPhoto}
          alt="Office workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold">{t.erpSystem}</h1>
            </div>
            <p className="text-xl text-white/90 leading-relaxed max-w-md">
              {t.control}
            </p>
          </div>
          <div className="space-y-4 text-white/80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{t.secureAuth}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>{t.multilang}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>{t.intuitive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative z-10 p-8 lg:p-12">
        {/* Mobile Header */}
        <div className="lg:hidden mb-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.welcome}</h1>
          <p className="text-white/70">{t.subtitle}</p>
        </div>
        {/* Language Toggle */}
        <div className="w-full max-w-md flex justify-end mb-8">
          <button
            onClick={cycleLanguage}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white font-medium group"
          >
            <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            {getLanguageDisplay()}
          </button>
        </div>
        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-lg shadow-black/50">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
              <p className="text-white/70">{t.subtitle}</p>
            </div>
            {/* Username Field */}
            <div className="relative mb-6 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <User className={`h-5 w-5 transition-colors duration-300 ${
                  focusedField === 'username' ? 'text-blue-400' : 'text-white/50'
                }`} />
              </div>
              <input
                type="text"
                placeholder={t.login}
                value={username}
                onChange={(e) => setLogin(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 hover:bg-white/10 focus:bg-white/15"
                required
              />
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                focusedField === 'username' ? 'bg-blue-500/10 border-blue-500/50' : ''
              }`}></div>
            </div>
            {/* Password Field */}
            <div className="relative mb-8 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Lock className={`h-5 w-5 transition-colors duration-300 ${
                  focusedField === 'password' ? 'text-blue-400' : 'text-white/50'
                }`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 hover:bg-white/10 focus:bg-white/15"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:bg-white/10 rounded-r-2xl transition-colors duration-300"
                title={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white/50 hover:text-white transition-colors duration-300" />
                ) : (
                  <Eye className="h-5 w-5 text-white/50 hover:text-white transition-colors duration-300" />
                )}
              </button>
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                focusedField === 'password' ? 'bg-blue-500/10 border-blue-500/50' : ''
              }`}></div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  {t.submit}
                </>
              )}
            </button>
          </div>
        </form>
        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 text-white/70">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">{t.systemOnline}</span>
          </div>
          <div className="mt-2 text-xs text-white/50">
            {t.safety}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;