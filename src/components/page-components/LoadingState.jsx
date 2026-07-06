export function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20"
      role="status"
      aria-live="polite"
      aria-label="Loading articles"
    >
      <div
        className="size-10 animate-spin rounded-full border-4 border-[#26231e] border-r-transparent border-b-transparent"
        aria-hidden="true"
      />
      <p className="text-[16px] font-medium text-[#26231e]">Loading...</p>
    </div>
  );
}
