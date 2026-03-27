import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
}

interface BlogListProps {
  posts?: BlogPost[];
}

function SkeletonImage() {
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-xl bg-gray-200 md:h-64">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
    </div>
  );
}

function BlogRow({ post }: { post: BlogPost }) {
  return (
    <article className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
      {/* Image — left */}
      <div className="w-full md:w-2/5 md:shrink-0">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-52 w-full rounded-xl object-cover md:h-64"
          />
        ) : (
          <SkeletonImage />
        )}
      </div>

      {/* Text — right */}
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-primary md:text-4xl">{post.title}</h2>
        {post.excerpt && (
          <p className="text-base leading-relaxed text-gray-500 md:text-lg">{post.excerpt}</p>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-1 w-fit rounded-full border border-primary px-7 py-2 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          อ่านต่อ
        </Link>
      </div>
    </article>
  );
}

function SkeletonRow() {
  return (
    <article className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
      <div className="w-full md:w-2/5 md:shrink-0"><SkeletonImage /></div>
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </article>
  );
}

export default function BlogList({ posts }: BlogListProps) {
  const displayPosts = posts && posts.length > 0 ? posts : null;

  return (
    <section className="w-full bg-white pb-16 md:pb-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-14 px-6 md:px-12">
        {displayPosts
          ? displayPosts.map((post) => <BlogRow key={post.id} post={post} />)
          : [1, 2, 3].map((i) => <SkeletonRow key={i} />)}
      </div>
    </section>
  );
}
