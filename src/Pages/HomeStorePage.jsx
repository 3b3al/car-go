import { companies } from "..//Lib/homeData";
import { money } from "../utils/format";
import ProductCard from "../Components/ProductCard";
import trendCarImage from "../assets/trend-car-01.png";
import { brands } from "..//Lib/appData";

export default function HomeStorePage({ products, favorites, onFavorite, onProduct, onLoadMore, canLoadMore, onBrand }) {
  return (
    <div className="mx-auto w-[min(1280px,calc(100%-80px))] pb-12 pt-10 max-sm:w-[calc(100%-32px)]">
      <section>
        <h1 className="text-[28px] font-bold">Global Company</h1>
         <div className="mt-7 flex gap-[18px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {companies.map((company) => (
              <button
                key={company.id}
                type="button"
                className="group flex w-[112px] shrink-0 flex-col items-center gap-3"
                aria-label={`Open ${company.name}`}
              >
                <span className="grid h-[112px] w-[112px] place-items-center rounded-full bg-[#e8eeff] transition group-hover:-translate-y-1">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-[70px] max-w-[84px] object-contain"
                  />
                </span>
                <span className="text-[16px] font-bold text-[#3156aa]">{company.name}</span>
              </button>
            ))}
          </div>
      </section>
      <section className="pt-8">
        <h2 className="text-[28px] font-bold">Trends</h2>
        <div className="relative mt-5 overflow-hidden rounded-[60px] bg-gradient-to-r from-slate-900 to-slate-500 p-8 shadow-sm">
          <img src={trendCarImage} alt="Trending car" className="h-[390px] w-full rounded-[46px] object-cover object-center max-md:h-[260px]" />
          <div className="absolute bottom-12 left-12 rounded-full bg-white/95 px-5 py-2 text-sm font-bold text-[#27489f]">
            Best offer starts at {money(3500)}
          </div>
        </div>
      </section>
      <section className="pt-8">
        <h2 className="text-[28px] font-bold">Best Price</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onOpen={onProduct} />
          ))}
        </div>
        {canLoadMore && (
          <div className="mt-9 flex justify-center">
            <button type="button" onClick={onLoadMore} className="h-11 w-[270px] rounded-full bg-[#27489f] font-bold text-white">Load More..</button>
          </div>
        )}
      </section>
    </div>
  );
}