import { useState } from "react";
import api from "../../services/api";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/newsletter/subscribe", { email, firstName, consent });
      setStatus("success");
      setMessage("You're subscribed.");
      setEmail("");
      setFirstName("");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  if (status === "success") {
    return <p className="text-stone-100">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="First name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex-1 bg-transparent border border-stone-50/30 px-3 py-2.5 text-sm text-stone-50 placeholder:text-stone-300/60 focus:border-stone-50 outline-none"
        />
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border border-stone-50/30 px-3 py-2.5 text-sm text-stone-50 placeholder:text-stone-300/60 focus:border-stone-50 outline-none"
        />
      </div>
      <label className="flex items-start gap-2 text-xs text-stone-300/80">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        I agree to receive the Arcadia Surfaces journal by email.
      </label>
      {status === "error" && <p className="text-xs text-red-300">{message}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-stone-50 text-ink px-5 py-2.5 text-sm hover:bg-bronze hover:text-stone-50 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
