export default function MobileAppBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-ink/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href="https://play.google.com/store/apps/details?id=com.qrio.qrio"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-accent text-white text-center py-3 rounded-xl text-sm font-semibold no-underline active:scale-[0.98] transition-transform"
        >
          Download the App
        </a>
      </div>
    </div>
  )
}
