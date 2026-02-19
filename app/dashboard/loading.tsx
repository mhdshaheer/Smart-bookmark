export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/30 selection:text-white transition-colors duration-300">
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-8">
        <div className="flex-1 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-secondary animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-secondary rounded animate-pulse" />
            <div className="h-2 w-16 bg-secondary rounded animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <div className="h-12 w-48 bg-secondary rounded-xl animate-pulse" />
              <div className="h-4 w-full bg-secondary rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
            </div>
            <div className="h-[400px] w-full bg-secondary rounded-3xl animate-pulse" />
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="h-10 w-full border-b border-border pb-6 flex justify-between">
              <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
              <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 w-full bg-secondary/50 border border-border rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
