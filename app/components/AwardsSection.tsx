/** Awards & Recognition + CSR Projects sections */

const LOREM_SHORT =
  "lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod";

const LOREM_LONG =
  "lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut";

/** Medal icon — inline SVG, no external dependency */
function MedalIcon() {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ribbon left */}
      <path d="M38 10 L28 38 L38 32 L45 38 L38 10Z" fill="#c7d4f5" />
      {/* Ribbon right */}
      <path d="M52 10 L62 38 L52 32 L45 38 L52 10Z" fill="#c7d4f5" />
      {/* Circle */}
      <circle cx="45" cy="55" r="22" fill="#dce6fc" stroke="#a3b8f5" strokeWidth="2" />
      {/* Star */}
      <polygon
        points="45,38 47.9,47.6 58,47.6 49.5,53.4 52.5,63 45,57.2 37.5,63 40.5,53.4 32,47.6 42.1,47.6"
        fill="#a3b8f5"
      />
      {/* Sparkles */}
      <circle cx="20" cy="30" r="2" fill="#a3b8f5" opacity="0.6" />
      <circle cx="70" cy="25" r="1.5" fill="#a3b8f5" opacity="0.5" />
      <circle cx="15" cy="55" r="1.5" fill="#a3b8f5" opacity="0.4" />
    </svg>
  );
}

function AwardCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Icon area */}
      <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-gray-50">
        <MedalIcon />
      </div>
      {/* Text */}
      <p className="text-xs leading-relaxed text-gray-500">{LOREM_SHORT}</p>
    </div>
  );
}

function CsrCard() {
  return (
    <div className="flex flex-col gap-3">
      {/* Skeleton image */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gray-200">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </div>
      {/* Text */}
      <p className="text-xs leading-relaxed text-gray-500">{LOREM_LONG}</p>
    </div>
  );
}

export default function AwardsSection() {
  return (
    <>
      {/* ── Awards & Recognition ── */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-widest text-primary md:text-3xl">
            AWARDS &amp; RECOGNITION
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <AwardCard />
            <AwardCard />
            <AwardCard />
          </div>
        </div>
      </section>

      {/* ── CSR Projects ── */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-widest text-primary md:text-3xl">
            CSR PROJECTS
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <CsrCard />
            <CsrCard />
            <CsrCard />
          </div>
        </div>
      </section>
    </>
  );
}
