import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterServer from "../../components/FooterServer";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("title, excerpt").eq("slug", slug).single();
  if (!data) return {};
  return { title: `${data.title} | Palm Springs`, description: data.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [postRes] = await Promise.all([
    supabase.from("posts").select("*").eq("slug", slug).eq("is_published", true).single(),
  ]);

  if (!postRes.data) notFound();
  const post = postRes.data;

  const isCsr = post.type === "csr";
  const backHref = isCsr ? "/about" : "/blog";
  const backLabel = isCsr ? "← กลับหน้า About Us" : "← กลับหน้า Blog";
  const badgeLabel = isCsr ? "CSR Projects" : "Blog";
  const badgeClass = isCsr
    ? "bg-green-100 text-green-700"
    : "bg-blue-100 text-[#09418C]";

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <Navbar />

      {/* Hero cover */}
      {post.cover_image_url && (
        <div className="relative h-72 w-full overflow-hidden md:h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <main className="mx-auto max-w-3xl px-6 py-10 md:px-8 md:py-14">
        {/* Back link */}
        <Link
          href={backHref}
          className="mb-6 inline-block text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          {backLabel}
        </Link>

        {/* Badge + date */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {badgeLabel}
          </span>
          {publishedDate && (
            <span className="text-sm text-gray-400">{publishedDate}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-5 text-3xl font-bold leading-snug text-primary md:text-4xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-8 border-l-4 border-primary pl-5 text-lg leading-relaxed text-gray-500">
            {post.excerpt}
          </p>
        )}

        {/* Divider */}
        <hr className="mb-8 border-gray-200" />

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-primary
            prose-p:leading-relaxed prose-p:text-gray-700
            prose-a:text-primary prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-primary prose-blockquote:text-gray-500
            prose-ul:text-gray-700 prose-ol:text-gray-700
            prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>

      <FooterServer />
    </>
  );
}
