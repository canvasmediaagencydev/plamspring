import Link from "next/link";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Lorem ipsum",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    title: "Lorem ipsum",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    title: "Lorem ipsum",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

function SkeletonImage() {
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-xl bg-gray-200 md:h-64">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    </div>
  );
}

function BlogRow({ title, excerpt }: { title: string; excerpt: string }) {
  return (
    <article className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
      {/* Image — left */}
      <div className="w-full md:w-2/5 md:shrink-0">
        <SkeletonImage />
      </div>

      {/* Text — right */}
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-primary md:text-3xl">{title}</h2>
        <p className="text-sm leading-relaxed text-gray-500 md:text-base">{excerpt}</p>
        <Link
          href="#"
          className="mt-1 w-fit rounded-full border border-primary px-7 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          See All
        </Link>
      </div>
    </article>
  );
}

export default function BlogList() {
  return (
    <section className="w-full bg-white pb-16 md:pb-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-14 px-6 md:px-12">
        {BLOG_POSTS.map((post) => (
          <BlogRow key={post.id} title={post.title} excerpt={post.excerpt} />
        ))}
      </div>
    </section>
  );
}
