import Image from "next/image";

interface Award {
  id: string;
  image_url: string;
  description: string;
}

interface CsrPost {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  excerpt: string | null;
}

interface AwardsSectionProps {
  awards?: Award[];
  csrPosts?: CsrPost[];
}

function AwardCard({ award, reverse = false }: { award?: Award; reverse?: boolean }) {
  if (award) {
    return (
      <div
        className={`overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm md:flex ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <div className="relative h-72 bg-[#F5F7FA] md:h-auto md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={award.image_url} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center p-6 md:w-1/2 md:p-10">
          <p className="text-sm leading-relaxed text-gray-500 md:text-base">{award.description}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm md:flex ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
      <div className="flex h-72 items-center justify-center bg-gray-50 md:h-auto md:w-1/2">
        <Image src="/icon/awardsicon.svg" alt="Award" width={120} height={120} className="h-28 w-28 object-contain" />
      </div>
      <div className="space-y-2 p-6 md:flex md:w-1/2 md:flex-col md:justify-center md:p-10">
        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-3/5 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

function CsrCard({ post }: { post?: CsrPost }) {
  if (post) {
    return (
      <a href={`/blog/${post.slug}`} className="flex flex-col gap-3 group">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image_url} alt={post.title} className="aspect-square w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="aspect-square w-full rounded-xl bg-gray-200" />
        )}
        <h3 className="font-medium text-primary group-hover:underline">{post.title}</h3>
        {post.excerpt && <p className="text-sm leading-relaxed text-gray-500">{post.excerpt}</p>}
      </a>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-3/5 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function AwardsSection({ awards, csrPosts }: AwardsSectionProps) {
  const displayAwards = awards && awards.length > 0 ? awards : [undefined, undefined, undefined];
  const displayCsr = csrPosts && csrPosts.length > 0 ? csrPosts : [undefined, undefined, undefined];

  return (
    <>
      {/* ── Awards & Recognition ── */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-widest text-primary md:text-4xl">
            AWARDS &amp; RECOGNITION
          </h2>
          <div className="space-y-6">
            {displayAwards.map((award, i) => (
              <AwardCard key={award?.id ?? i} award={award} reverse={i % 2 === 1} />
            ))}
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
            {displayCsr.map((post, i) => (
              <CsrCard key={post?.id ?? i} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
