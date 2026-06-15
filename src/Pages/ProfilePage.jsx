import { useState } from "react";
import FormField from "../Components/FormField";
import ChatButton from "../Components/ChatButton";
import trendCar from "../assets/trend-car-01.png";
export default function ProfilePage({ user, onSave, onLogout, onChat }) {
  const [form, setForm] = useState(user);
  const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  return (
    <div className="mx-auto w-[min(1280px,calc(100%-80px))] pb-16 pt-9 max-sm:w-[calc(100%-32px)]">
      <section className="text-center">
        <img src={trendCar} alt="Profile car" className="mx-auto h-[240px] w-[240px] rounded-full border-2 border-[#27489f] object-cover" />
        <h1 className="mt-5 text-[32px] font-bold">{form.firstName} {form.lastName}</h1>
        <p className="text-xl text-slate-500">{form.email}</p>
      </section>
      <div className="mt-9 border-t border-slate-300 pt-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="First Name" value={form.firstName || ""} onChange={update("firstName")} placeholder="Enter First Name" />
          <FormField label="Last Name" value={form.lastName || ""} onChange={update("lastName")} placeholder="Enter Last Name" />
        </div>
        <div className="mt-5 space-y-5">
          <FormField label="Phone Number" value={form.phone || ""} onChange={update("phone")} placeholder="+1 (555) 123-4567" />
          <FormField label="E-Mail" value={form.email || ""} onChange={update("email")} placeholder="example@gmail.com" />
          <FormField label="Password" value={form.password || ""} onChange={update("password")} placeholder="At least 8 - Digital Characters" type="password" />
          <FormField label="Language" value={form.language || ""} onChange={update("language")} placeholder="English" />
        </div>
        <button type="button" onClick={() => onSave(form)} className="mt-5 h-11 w-full rounded-full bg-[#27489f] font-bold text-white">Save Changes</button>
        <button type="button" onClick={onLogout} className="mt-6 h-11 w-full rounded-full border border-red-500 font-bold text-red-500">Log Out</button>
      </div>
      <ChatButton onClick={onChat} />
    </div>
  );
}
