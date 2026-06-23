const PendingModal = () => {
  return (
    <div
      className="fixed inset-0 z-[1055] flex items-center justify-center bg-black/45 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="처리 중"
    >
      <div className="flex w-full max-w-xs flex-col items-center rounded-lg bg-white px-8 py-8 shadow-2xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-sky-600" />

        <div className="mt-4 text-base font-bold text-neutral-900">
          처리 중입니다
        </div>

        <div className="mt-1 text-sm text-neutral-500">
          잠시만 기다려주세요.
        </div>
      </div>
    </div>
  )
}

export default PendingModal