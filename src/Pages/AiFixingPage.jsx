import PageHeader from "../Components/PageHeader";
import ProductCard from "../Components/ProductCard";
import trendCar01 from "../assets/trend-car-01.png";
export default function AiFixingPage({ products, favorites, onBack, onProduct, onFavorite }) {
  const headlightProducts = products.filter((product) => product.categoryId === "headlights").slice(0, 6);
  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-7">
      <PageHeader title="Chatbot" onBack={onBack} />
      <section className="mx-auto w-[min(1280px,calc(100%-80px))] max-sm:w-[calc(100%-32px)]">
        <div className="grid grid-cols-2 gap-16 max-lg:grid-cols-1">
          <img src={trendCar01} alt="Uploaded damaged car" className="h-[300px] w-full rounded-[18px] object-cover object-left-top" />
          <div className="text-right">
            <div className="relative inline-block">
              <img src={trendCar01} alt="AI damage result" className="h-[310px] rounded-[18px] object-cover object-right-top" />
              <span className="absolute right-5 top-5 rounded-full bg-[#f4c542] px-4 py-2 font-bold text-white">Led Damage</span>
            </div>
            <p className="mt-5 inline-block rounded-full bg-[#e8eeff] px-5 py-2 font-bold text-[#27489f]">Led Damage for Volkswagen Car Need to Get Fixed</p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {headlightProducts.map((product) => (
            <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onOpen={onProduct} onFavorite={onFavorite} />
          ))}
        </div>
      </section>
    </main>
  );
}
