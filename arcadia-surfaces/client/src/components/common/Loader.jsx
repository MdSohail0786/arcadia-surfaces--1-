export default function Loader({ label = "Loading" }) {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center gap-3 text-ink-soft">
      <div className="w-8 h-8 border border-ink/20 border-t-ink rounded-full animate-spin" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
