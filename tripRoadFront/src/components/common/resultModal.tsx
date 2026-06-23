interface ResultModalProps {
  title: string
  content: string
  callbackFn?: () => void
  variant?: "success" | "error" | "info"
}

function ResultModal({
  title,
  content,
  callbackFn,
  variant = "info"
}: ResultModalProps) {
  const colorClass = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-sky-600"
  }[variant]

  return (
    <div
      className="fixed inset-0 z-[1055] flex items-center justify-center bg-black/45 px-4"
      onClick={callbackFn}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1.5 ${colorClass}`} />

        <div className="px-6 pb-5 pt-6">
          <h2 className="text-lg font-bold text-neutral-900">
            {title}
          </h2>

          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-600">
            {content}
          </p>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className={`rounded-md px-5 py-2 text-sm font-semibold text-white hover:opacity-90 ${colorClass}`}
              onClick={callbackFn}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultModal