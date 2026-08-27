export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">TREADVILLE</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--parchment)]/60">
            Premium African products — coffee, tea, horticulture, and grains — sourced across Kenya.
          </p>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/60">
          <p>Nairobi, Kenya</p>
          <p className="mt-2">info@treadville.co.ke</p>
          <p className="mt-2">+254 722 479985</p>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/40">
          <p>30+ years in Kenyan agriculture</p>
          <p className="mt-2">SCA 80+ · KEPHIS · SGS · USDA</p>
        </div>
      </div>
    </footer>
  );
}
