import { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import { useSeo } from "../../hooks/useSeo";

const enquiryTypes = [
  { value: "product", label: "Product" },
  { value: "sample", label: "Sample" },
  { value: "project", label: "Project" },
  { value: "bespoke-design", label: "Bespoke Design" },
  { value: "showroom", label: "Showroom" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
];

const initialForm = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  subject: "",
  enquiryType: "product",
  message: "",
  consent: false,
};

export default function Contact() {
  useSeo({
    title: "Contact",
    description: "Get in touch with Arcadia Surfaces about products, samples, projects or bespoke design.",
  });
  const location = useLocation();
  const attachedProducts = location.state?.products || [];

  const [form, setForm] = useState({
    ...initialForm,
    enquiryType: attachedProducts.length > 0 ? "product" : "other",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState([]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrors([]);

    try {
      await api.post("/contact", {
        ...form,
        products: attachedProducts.map((p) => ({
          productId: p.productId,
          name: p.name,
          productCode: p.productCode,
        })),
      });
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrors(err.errors || [err.message]);
    }
  }

  if (status === "success") {
    return (
      <div className="container-page py-24 max-w-xl">
        <h1 className="text-3xl mb-4">Thank you.</h1>
        <p className="text-ink-soft">
          Your enquiry has been received. Our team will follow up within two business days.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="text-4xl mb-3">Contact</h1>
      <p className="text-ink-soft mb-6">
        Tell us about your project and we'll route it to the right person.
      </p>

      {attachedProducts.length > 0 && (
        <div className="mb-10 border border-ink/10 p-4">
          <h2 className="text-sm font-medium mb-2">Attached from your enquiry list</h2>
          <ul className="text-sm text-ink-soft space-y-1">
            {attachedProducts.map((p) => (
              <li key={p.productId}>
                {p.name} — {p.productCode}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="First name" required>
            <input
              required
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Last name" required>
            <input
              required
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Email" required>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Company">
            <input
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Country">
            <input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Enquiry type" required>
          <select
            value={form.enquiryType}
            onChange={(e) => update("enquiryType", e.target.value)}
            className="input"
          >
            {enquiryTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Message" required>
          <textarea
            required
            minLength={5}
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className="input resize-none"
          />
        </Field>

        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-1"
          />
          I consent to Arcadia Surfaces contacting me about this enquiry.
        </label>

        {errors.length > 0 && (
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-ink text-stone-50 px-6 py-3 text-sm hover:bg-bronze transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1.5">
        {label} {required && <span className="text-bronze">*</span>}
      </span>
      {children}
    </label>
  );
}
