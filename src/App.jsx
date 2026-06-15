import { useEffect, useMemo, useState } from "react";
import TopBar from "./Components/TopBar";
import ChatButton from "./Components/ChatButton";
import { categories, products as allProducts } from "./Lib/appData";
import { STORAGE_KEYS, clearStore, readStore, writeStore } from "./Storage/localStorag";
import SplashPage from "./Pages/SplashPage";
import OnboardingPage from "./Pages/OnboardingPage";
import { LoginPage, SignUpPage } from "./Pages/AuthPages";
import OtpPage from "./Pages/OtpPage";
import HomeStorePage from "./Pages/HomeStorePage";
import CategoriesPage from "./Pages/CategoriesPage";
import FavoritesPage from "./Pages/FavoritesPage";
import ProductListPage from "./Pages/ProductListPage";
import ProductDetailsPage from "./Pages/ProductDetailsPage";
import ProfilePage from "./Pages/ProfilePage";
import CartPage from "./Pages/CatrtPage";
import CheckoutPage from "./Pages/CheckoutPage";
import ChatbotPage from "./Pages/ChatBot";
import AiFixingPage from "./Pages/AiFixingPage";
import { demoUser } from "./Lib/appData";

function makeLine(product, options = {}) {
  return {
    lineId: `${product.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    productId: product.id,
    qty: 1,
    color: options.color || product.colors?.[0],
    size: options.size || product.sizes?.[0],
  };
}

export default function App() {
  const [boot, setBoot] = useState("dark");
  const [page, setPage] = useState("signup");
  const [otpInitial, setOtpInitial] = useState("");
  const [user, setUser] = useState(() => readStore(STORAGE_KEYS.user, null));
  const [users, setUsers] = useState(() => readStore(STORAGE_KEYS.users, []));
  const [cart, setCart] = useState(() => readStore(STORAGE_KEYS.cart, []));
  const [favorites, setFavorites] = useState(() => readStore(STORAGE_KEYS.favorites, []));
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(18);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(allProducts[0].id);
  const [orderDone, setOrderDone] = useState(false);

  useEffect(() => {
    const first = setTimeout(() => setBoot("light"), 1000);
    const second = setTimeout(() => {
      setBoot("ready");
      setPage(readStore(STORAGE_KEYS.onboarded, false) ? (user ? "home" : "signup") : "onboarding");
    }, 2100);
    return () => {
      clearTimeout(first);
      clearTimeout(second);
    };
  }, []);

  useEffect(() => writeStore(STORAGE_KEYS.user, user), [user]);
  useEffect(() => writeStore(STORAGE_KEYS.users, users), [users]);
  useEffect(() => writeStore(STORAGE_KEYS.cart, cart), [cart]);
  useEffect(() => writeStore(STORAGE_KEYS.favorites, favorites), [favorites]);

  const cartItems = useMemo(() => cart.map((item) => ({
    ...item,
    product: allProducts.find((product) => product.id === item.productId) || allProducts[0],
  })), [cart]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const selectedProduct = allProducts.find((product) => product.id === selectedProductId) || allProducts[0];

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allProducts.filter((product) => {
      const categoryMatch = selectedCategory ? product.categoryId === selectedCategory.id : true;
      const searchMatch = !query || [product.name, product.categoryId, product.description].join(" ").toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [search, selectedCategory]);

  const homeProducts = filteredProducts.slice(0, visible);

  const go = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeOnboarding = () => {
    writeStore(STORAGE_KEYS.onboarded, true);
    go(user ? "home" : "signup");
  };

  const openProduct = (product) => {
    setSelectedProductId(product.id);
    go("details");
  };

  const toggleFavorite = (productId) => {
    setFavorites((items) => (items.includes(productId) ? items.filter((id) => id !== productId) : [...items, productId]));
  };

  const addToCart = (product, options = {}) => {
    setCart((items) => [...items, makeLine(product, options)]);
  };

  const buyNow = (product, options = {}) => {
    addToCart(product, options);
    go("cart");
  };

  const changeQty = (lineId, delta) => {
    setCart((items) => items
      .map((item) => (item.lineId === lineId ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
      .filter((item) => item.qty > 0));
  };

  const handleSignup = (form) => {
    const nextUser = { ...demoUser, ...form, email: form.email.trim().toLowerCase() };
    setUsers((items) => [...items.filter((item) => item.email !== nextUser.email), nextUser]);
    setUser(nextUser);
    go("home");
  };

  const handleLogin = (form) => {
    const found = users.find((item) => item.email === form.email.trim().toLowerCase() && item.password === form.password);
    setUser(found || { ...demoUser, email: form.email.trim().toLowerCase() });
    go("home");
  };

  const handleSocial = (provider) => {
    const socialUser = { ...demoUser, firstName: provider, lastName: "User", email: `${provider.toLowerCase()}@cargo.local` };
    setUser(socialUser);
    go("home");
  };

  const logout = () => {
    setUser(null);
    clearStore(STORAGE_KEYS.user);
    go("login");
  };

  const pageWithShell = (active, content) => (
    <main className="min-h-screen bg-[#fbfbfc]">
      <TopBar active={active} search={search} cartCount={cartCount} onSearch={setSearch} onCart={() => go("cart")} onNavigate={(target) => {
        if (target === "categories") setSelectedCategory(null);
        go(target);
      }} />
      {content}
      <ChatButton onClick={() => go("chat")} />
    </main>
  );

  if (boot === "dark") return <SplashPage variant="dark" />;
  if (boot === "light") return <SplashPage variant="light" />;
  if (page === "onboarding") return <OnboardingPage onFinish={completeOnboarding} />;
  if (page === "signup") return <SignUpPage onSubmit={handleSignup} onLogin={() => go("login")} onSocial={handleSocial} />;
  if (page === "login") return <LoginPage onSubmit={handleLogin} onSignup={() => go("signup")} onSocial={handleSocial} onOtp={(email) => { setOtpInitial(email); go("otp"); }} />;
  if (page === "otp") return <OtpPage initial={otpInitial} onBack={() => go("login")} onDone={() => go("login")} />;
  if (page === "cart") return <CartPage items={cartItems} onBack={() => go("home")} onQty={changeQty} onDeleteAll={() => setCart([])} onFavorite={toggleFavorite} onBuy={() => cartItems.length ? go("checkout") : go("home")} onChat={() => go("chat")} />;
  if (page === "checkout") return <CheckoutPage items={cartItems} onBack={() => go("cart")} onQty={changeQty} onOrder={() => { setCart([]); setOrderDone(true); setTimeout(() => { setOrderDone(false); go("home"); }, 1200); }} />;
  if (page === "chat") return <ChatbotPage user={user || demoUser} onBack={() => go("home")} onAnalyze={() => go("ai")} />;
  if (page === "ai") return <AiFixingPage products={allProducts} favorites={favorites} onBack={() => go("chat")} onProduct={openProduct} onFavorite={toggleFavorite} />;
  if (page === "details") {
    return <ProductDetailsPage product={selectedProduct} favorite={favorites.includes(selectedProduct.id)} onBack={() => go(selectedCategory ? "productList" : "home")} onFavorite={toggleFavorite} onCart={addToCart} onBuy={buyNow} onChat={() => go("chat")} />;
  }
  if (page === "productList") {
    const title = selectedCategory?.title || "Rims";
    return <ProductListPage title={title} products={filteredProducts} favorites={favorites} search={search} onSearch={setSearch} onBack={() => go("categories")} onCart={() => go("cart")} onFavorite={toggleFavorite} onProduct={openProduct} />;
  }
  if (page === "categories") {
    return pageWithShell("categories", <CategoriesPage categories={categories} onOpen={(category) => { setSelectedCategory(category); go("productList"); }} />);
  }
  if (page === "favorites") {
    return pageWithShell("favorites", <FavoritesPage products={allProducts} favorites={favorites} onFavorite={toggleFavorite} onProduct={openProduct} onBrowse={() => go("home")} />);
  }
  if (page === "profile") {
    return pageWithShell("profile", <ProfilePage user={user || demoUser} onSave={(nextUser) => setUser(nextUser)} onLogout={logout} onChat={() => go("chat")} />);
  }

  return pageWithShell("home", (
    <>
      <HomeStorePage
        products={homeProducts}
        favorites={favorites}
        onFavorite={toggleFavorite}
        onProduct={openProduct}
        onLoadMore={() => setVisible((value) => value + 6)}
        canLoadMore={homeProducts.length < filteredProducts.length}
        onBrand={(brand) => setSearch(brand)}
      />
      {orderDone ? <div className="fixed inset-x-0 top-8 z-50 mx-auto w-fit rounded-full bg-[#16aa78] px-6 py-3 font-bold text-white shadow">Order placed successfully</div> : null}
    </>
  ));
}
