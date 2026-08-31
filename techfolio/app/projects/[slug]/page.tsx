import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { ExperienceDetail } from "../ExperienceDetail";
import { getProjectBySlug, projects } from "../project-data";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main
      className={`${montserrat.className} min-h-screen bg-[#F7F1E8] text-[#162b26]`}
    >
      <div className="sticky top-0 z-50">
        <div className="mx-auto w-full max-w-[980px] px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="pt-4 sm:pt-5">
            <div className="flex justify-center">
              <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-1 rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] p-1.5 shadow-[0_12px_28px_rgba(22,43,38,0.06)]">
                <Link
                  href="/"
                  aria-label="Home"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#0F4C45] transition hover:bg-[#0F4C45]/8"
                >
                  <Image
                    src="/home.png"
                    alt=""
                    width={18}
                    height={18}
                    className="h-[1.05rem] w-[1.05rem] object-contain"
                  />
                </Link>
                {projects.map((navProject) => (
                  <Link
                    key={navProject.slug}
                    href={`/projects/${navProject.slug}/`}
                    className={`cursor-pointer rounded-full px-3.5 py-2 text-[0.72rem] font-semibold transition sm:px-4 sm:text-[0.78rem] ${
                      navProject.slug === project.slug
                        ? "bg-[#043439] text-white shadow-[0_10px_24px_rgba(4,52,57,0.2)]"
                        : "text-[#0F4C45] hover:bg-[#0F4C45]/8"
                    }`}
                  >
                    {navProject.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[980px] px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-9">
        {project.links?.length ? (
          <div className="flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-full bg-[#043439] px-3.5 py-1.5 text-[0.82rem] font-semibold text-white transition hover:opacity-90 sm:px-4 sm:text-[0.88rem]"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}

        <ExperienceDetail project={project} />
      </div>

      <footer className="border-t border-[#0F4C45]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex w-full max-w-[980px] justify-center px-4 py-6 text-center sm:px-6 md:px-8 lg:px-10">
          <p className="text-[0.72rem] font-medium tracking-[0.04em] text-[#6B7B77] sm:text-[0.78rem]">
            © 2026 Jason Chen. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </main>
  );
}
