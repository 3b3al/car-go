import { useState } from "react";
import PageHeader from "../Components/PageHeader";
import { Icon } from "../Components/Icon";

export default function ChatbotPage({ user, onBack, onAnalyze }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const send = () => {
    if (!message.trim()) return;
    setMessages((items) => [...items, { from: "me", text: message }, { from: "bot", text: "Send a car image and I will suggest the closest matching parts." }]);
    setMessage("");
  };
  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-7">
      <PageHeader title="Chatbot" onBack={onBack} />
      <section className="mx-auto flex min-h-[680px] w-[min(1280px,calc(100%-80px))] flex-col justify-center text-center max-sm:w-[calc(100%-32px)]">
        {messages.length ? (
          <div className="mx-auto w-full max-w-[720px] space-y-3 text-left">
            {messages.map((item, index) => <p key={index} className={`rounded-2xl px-4 py-3 ${item.from === "me" ? "ml-auto bg-[#27489f] text-white" : "bg-[#e8eeff] text-[#27489f]"}`}>{item.text}</p>)}
          </div>
        ) : <h1 className="text-[32px] font-bold text-[#1f3778]">Hi, {user.firstName || "Osama"}</h1>}
      </section>
      <div className="mx-auto flex w-[min(1280px,calc(100%-80px))] items-center gap-5 max-sm:w-[calc(100%-32px)]">
        <button type="button" onClick={() => setMessages((items) => [...items, { from: "me", text: "Voice note" }])} className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#27489f] shadow"><Icon name="mic" /></button>
        <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Ask Me..." className="h-11 min-w-0 flex-1 rounded-full border border-[#27489f] bg-white px-4 outline-none" />
        <button type="button" onClick={message.trim() ? send : onAnalyze} className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#27489f] shadow"><Icon name={message.trim() ? "check" : "plus"} /></button>
      </div>
    </main>
  );
}
