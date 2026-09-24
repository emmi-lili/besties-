export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_20%,#ffd9e430,transparent_50%),radial-gradient(ellipse_at_90%_80%,#e0e8d420,transparent_50%)]"
      />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  )
}
