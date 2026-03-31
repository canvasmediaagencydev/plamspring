import Navbar from "../components/Navbar";
import FooterServer from "../components/FooterServer";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "โครงการของเรา | Palm Springs",
  description: "รวมโครงการบ้านคุณภาพจาก Palm Springs เชียงใหม่",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("project_pages")
    .select("id, name, subtitle, hero_image_url, slug")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <>
      <Navbar />
      <main>
        {/* Hero banner */}
        <section className="relative mt-16 flex h-[200px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-primary md:mt-20 md:h-[280px]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-[10%] top-[15%] h-40 w-40 rounded-full bg-white/30" />
            <div className="absolute bottom-[10%] right-[15%] h-56 w-56 rounded-full bg-white/20" />
          </div>
          <div className="relative z-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 md:text-sm">
              Our Projects
            </p>
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              โครงการของเรา
            </h1>
          </div>
        </section>

        {/* Projects grid */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(projects ?? []).map((project) => (
              <Link
                key={project.id}
                href={project.slug ? `/projects/${project.slug}` : "#"}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Project image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {project.hero_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.hero_image_url}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="h-12 w-12 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                          />
                        </svg>
                      </div>
                    </>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />
                </div>
                {/* Card content */}
                <div className="flex flex-1 flex-col items-center justify-center px-4 py-5 text-center md:py-6">
                  <h3 className="text-lg font-bold tracking-wide text-primary md:text-xl">
                    {project.name}
                  </h3>
                  {project.subtitle && (
                    <p className="mt-1 text-xs font-medium tracking-[0.2em] text-gray-400">
                      {project.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <FooterServer />
    </>
  );
}
