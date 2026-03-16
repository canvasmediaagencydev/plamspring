import Image from "next/image";

/** Awards & Recognition + CSR Projects sections */

const LOREM_SHORT =
  "lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod";

const LOREM_LONG =
  "lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut";

function AwardCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Icon area */}
      <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-gray-50">
        <Image
          src="/icon/awardsicon.svg"
          alt="Award"
          width={120}
          height={120}
          className="h-28 w-28 object-contain"
        />
      </div>
      {/* Text */}
      <p className="text-sm leading-relaxed text-gray-500 md:text-base">{LOREM_SHORT}</p>
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
      <p className="text-sm leading-relaxed text-gray-500 md:text-base">{LOREM_LONG}</p>
    </div>
  );
}

export default function AwardsSection() {
  return (
    <>
      {/* ── Awards & Recognition ── */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-widest text-primary md:text-4xl">
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
          <h2 className="mb-10 text-center text-2xl font-bold tracking-widest text-primary md:text-4xl">
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
