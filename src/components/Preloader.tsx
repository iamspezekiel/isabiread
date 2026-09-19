export function Preloader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <div className="flex items-baseline font-headline font-bold text-primary">
        <span className="preloader-isabiread text-7xl md:text-8xl">IsabiRead</span>
        <span className="preloader-ai text-3xl md:text-4xl">AI</span>
      </div>
    </div>
  );
}
