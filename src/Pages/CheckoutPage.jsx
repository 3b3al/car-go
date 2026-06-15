import { useMemo, useState } from "react";
import PageHeader from "../Components/PageHeader";
import CheckoutStepper from "../Components/CheckoutStepper";
import { Icon } from "../Components/Icon";
import { money } from "../utils/format";

export default function CheckoutPage({ items, onBack, onQty, onOrder }) {
  const [method, setMethod] = useState("Mastercard");
  const total = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.qty, 0), [items]);
  const discount = total * 0.06;
  const finalTotal = total - discount;
  return (
    <main className="min-h-screen bg-white">
      <div className="relative bg-[#fff5ca] py-7">
        <PageHeader title="" onBack={onBack} />
        <div className="-mt-20"><CheckoutStepper /></div>
      </div>
      <section className="mx-auto grid w-[min(1350px,calc(100%-88px))] grid-cols-[1fr_480px] gap-20 py-8 max-lg:grid-cols-1 max-sm:w-[calc(100%-32px)]">
        <div>
          <h1 className="text-2xl text-slate-500">Payment method</h1>
          <div className="mt-6 rounded bg-white p-8 shadow-[0_8px_22px_rgba(15,23,42,.18)]">
            <div className="mx-auto w-[360px] max-w-full rounded-xl border bg-white p-5 shadow">
              <div className="rounded-xl bg-[#2f64a4] p-6 text-white">
                <div className="text-right text-2xl font-bold">N Bank</div>
                <div className="mt-10 text-2xl tracking-[.2em]">1234 5678 9876 5432</div>
                <div className="mt-5 text-sm">AL HOLDER</div>
              </div>
            </div>
            <div className="mx-auto mt-8 grid max-w-[560px] gap-5">
              <label className="flex items-center justify-between text-xl">Use saved card:
                <select value={method} onChange={(event) => setMethod(event.target.value)} className="h-10 w-64 rounded bg-slate-100 px-3">
                  <option>Mastercard</option><option>Visa</option><option>American Express</option>
                </select>
              </label>
              <input className="h-10 rounded bg-slate-100 px-4" placeholder="Name on card" defaultValue="Esther Howard" />
              <input className="h-10 rounded bg-slate-100 px-4" placeholder="Card number" defaultValue="123-456-789-" />
              <div className="grid grid-cols-2 gap-16">
                <input className="h-10 rounded bg-slate-100 px-4" placeholder="MM / YY" />
                <input className="h-10 rounded bg-slate-100 px-4" placeholder="CCV" />
              </div>
              <div className="text-right text-xl font-black text-[#27489f]">VISA <span className="text-red-500">●</span><span className="text-yellow-500">●</span></div>
            </div>
          </div>
        </div>
        <aside>
          <h2 className="text-2xl text-slate-500">Order summary</h2>
          <div className="mt-6 max-h-[300px] overflow-y-auto rounded border p-2">
            {items.map((item) => (
              <div key={item.lineId} className="grid grid-cols-[100px_1fr_36px] gap-4 border-b py-2">
                <img src={item.product.image} alt="" className="h-[86px] rounded bg-slate-100 object-contain p-2" />
                <div>
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-slate-500">{item.product.description.slice(0, 38)}</p>
                  <p className="mt-3 font-bold">{money(item.product.price)}</p>
                </div>
                <div className="grid overflow-hidden rounded shadow">
                  <button type="button" onClick={() => onQty(item.lineId, 1)}><Icon name="plus" /></button>
                  <span className="grid place-items-center bg-[#fff5ca]">{item.qty}</span>
                  <button type="button" onClick={() => onQty(item.lineId, -1)}><Icon name="minus" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 space-y-5 text-2xl text-slate-600">
            <p className="flex justify-between"><span>Product total</span><span>{money(total)}</span></p>
            <hr />
            <p className="flex justify-between"><span>Discount</span><span>%6 ({money(discount)})</span></p>
            <hr />
            <p className="flex justify-between"><span>Delivery fee</span><span>Free</span></p>
            <hr />
            <p className="flex justify-between font-bold text-[#f1cb3f]"><span>Total</span><span>{money(finalTotal)}</span></p>
          </div>
          <button type="button" onClick={onOrder} className="mt-8 h-16 w-full rounded bg-[#f8d858] text-2xl font-bold text-slate-700 shadow">Order</button>
        </aside>
      </section>
    </main>
  );
}
