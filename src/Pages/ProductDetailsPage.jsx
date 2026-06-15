import { useState } from "react";
import PageHeader from "../Components/PageHeader";
import ChatButton from "../Components/ChatButton";
import { Icon } from "../Components/Icon";
import { money } from "../utils/format";

export default function ProductDetailsPage({ product, favorite, onBack, onFavorite, onCart, onBuy, onChat }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[2]);
  const [hero, setHero] = useState(product.image);
  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-28">
      <PageHeader title="All Categories" onBack={onBack} />
      <section className="mx-auto w-[min(1280px,calc(100%-80px))] max-sm:w-[calc(100%-32px)]">
        <div className="grid gap-6 lg:grid-cols-[1fr_630px]">
          <div className="relative overflow-hidden rounded-[20px] bg-white p-5 shadow-sm">
            <button type="button" className="absolute left-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white text-[#27489f] shadow"><Icon name="cart" className="h-4 w-4" /></button>
            <button type="button" onClick={() => onFavorite(product.id)} className={`absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white shadow ${favorite ? "text-red-500" : "text-[#27489f]"}`}><Icon name="heart" filled={favorite} /></button>
            <img src={hero} alt={product.name} className="h-[296px] w-full object-contain" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[product.image, product.image, product.image].map((image, index) => (
              <button key={index} type="button" onClick={() => setHero(image)} className="rounded-[20px] bg-white p-4 shadow-sm">
                <img src={image} alt="" className="h-[260px] w-full object-contain max-lg:h-36" />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-2 border-b border-slate-300 pb-3">
          <div>
            <h1 className="text-[30px] font-bold">{product.name}</h1>
            <p className="text-sm text-slate-500">Review <span className="text-[#27489f]">({product.rating})</span></p>
          </div>
          <p className="text-[30px] font-bold text-[#27489f]">{money(product.price)}</p>
          <p className="text-sm text-slate-500 line-through">{product.oldPrice} EGP</p>
        </div>
        <section className="border-b border-slate-300 py-3">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p className="mt-2 text-lg text-slate-700">{product.description}.....Read More</p>
        </section>
        <section className="border-b border-slate-300 py-3">
          <h2 className="text-2xl font-semibold">Color</h2>
          <div className="mt-3 flex gap-4">
            {product.colors.map((item) => <button key={item} type="button" onClick={() => setColor(item)} className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ${color === item ? "ring-[#27489f]" : "ring-transparent"}`} style={{ backgroundColor: item }} aria-label="Select color" />)}
          </div>
        </section>
        <section className="py-3">
          <h2 className="text-2xl font-semibold">Size</h2>
          <div className="mt-3 flex gap-4">
            {product.sizes.map((item) => <button key={item} type="button" onClick={() => setSize(item)} className={`grid h-10 w-10 place-items-center rounded-full font-bold ${size === item ? "bg-[#27489f] text-white" : "bg-[#e8eeff] text-[#27489f]"}`}>{item}</button>)}
          </div>
        </section>
      </section>
      <div className="fixed bottom-6 left-0 right-0 z-20 mx-auto flex w-[min(1280px,calc(100%-80px))] items-center gap-5 max-sm:w-[calc(100%-32px)]">
        <button type="button" onClick={() => onBuy(product, { color, size })} className="h-11 flex-1 rounded-full bg-[#27489f] font-bold text-white">Buy Now</button>
        <button type="button" onClick={() => onCart(product, { color, size })} className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#27489f] shadow"><Icon name="cart" /></button>
      </div>
      <ChatButton onClick={onChat} />
    </main>
  );
}
