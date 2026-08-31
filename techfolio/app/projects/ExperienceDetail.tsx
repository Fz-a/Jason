import Image from "next/image";
import type { ProjectDetail, ProjectDetailBlock, ProjectImage } from "./project-data";

function ProjectImageFigure({
  image,
  className = "",
}: {
  image: ProjectImage;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8] ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="h-auto w-full"
      />
      {image.caption ? (
        <figcaption className="px-4 py-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
          {image.caption}
        </figcaption>
      ) : null}
    </div>
  );
}

function TextCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
      <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BlockRenderer({ block }: { block: ProjectDetailBlock }) {
  switch (block.type) {
    case "text":
      return (
        <TextCard title={block.title}>
          <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            {block.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </TextCard>
      );

    case "list":
      return (
        <TextCard title={block.title}>
          {block.intro ? (
            <p className="mt-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
              {block.intro}
            </p>
          ) : null}
          <ul
            className={`space-y-2.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7 ${block.intro ? "mt-4" : "mt-3.5"}`}
          >
            {block.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </TextCard>
      );

    case "split-list-image":
      return (
        <section className="grid grid-cols-1 gap-5 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center sm:p-6">
          <div>
            <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
              {block.title}
            </h2>
            {block.intro ? (
              <p className="mt-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
                {block.intro}
              </p>
            ) : null}
            <ul className="mt-4 space-y-2.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <ProjectImageFigure image={block.image} />
        </section>
      );

    case "split-image-text":
      return (
        <section className="grid grid-cols-1 gap-5 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center sm:p-6">
          <ProjectImageFigure image={block.image} />
          <div>
            <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
              {block.title}
            </h2>
            <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
              {block.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      );

    case "two-column":
      return (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {[block.left, block.right].map((column) => (
            <TextCard key={column.title} title={column.title}>
              <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
                {column.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </TextCard>
          ))}
        </section>
      );

    case "figure":
      return (
        <section className="overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <Image
            src={block.image.src}
            alt={block.image.alt}
            width={block.image.width}
            height={block.image.height}
            className="h-auto w-full rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]"
          />
          {block.image.caption ? (
            <p className="mt-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
              {block.image.caption}
            </p>
          ) : null}
        </section>
      );

    case "gallery":
      return (
        <section className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          {block.title ? (
            <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
              {block.title}
            </h2>
          ) : null}
          <div
            className={`grid grid-cols-1 gap-4 ${block.title ? "mt-5" : ""} ${block.columns === 2 ? "sm:grid-cols-2" : ""}`}
          >
            {block.images.map((image) => (
              <ProjectImageFigure key={image.src} image={image} />
            ))}
          </div>
        </section>
      );

    default:
      return null;
  }
}

export function ExperienceDetail({ project }: { project: ProjectDetail }) {
  return (
    <>
      <header className="mt-7 max-w-[720px]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
          Project Detail
        </p>

        <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[0.98] tracking-tight sm:text-[2.3rem] lg:text-[2.8rem]">
          {project.title}
        </h1>

        <p className="mt-4 max-w-[680px] text-[0.94rem] leading-7 text-[#3E514D] sm:text-[0.98rem]">
          {project.summary}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-3 py-1.5 text-[0.76rem] font-semibold text-[#0F4C45] sm:text-[0.82rem]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {project.blocks.map((block, index) => (
          <BlockRenderer key={`${block.type}-${index}`} block={block} />
        ))}
      </div>
    </>
  );
}
