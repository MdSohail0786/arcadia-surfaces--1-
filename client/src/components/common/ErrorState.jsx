export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-ink-soft max-w-[40ch]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm border border-ink/30 px-4 py-2 hover:bg-ink hover:text-stone-50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
