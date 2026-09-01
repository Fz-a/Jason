"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { workInternships } from "./work-showcases";

type Internship = (typeof workInternships)[number];

function InternshipBrief({ item }: { item: Internship }) {
  return (
    <article className="bg-white text-[#111] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-3.5 sm:px-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
          Internship Brief
        </p>
        <p className="text-[0.62rem] font-medium tracking-[0.1em] text-[#8A9692]">
          Work
        </p>
      </div>

      <div className="px-6 pb-2 pt-8 sm:px-10">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
          {item.role}
        </p>
        <h2 className="mt-2 text-[1.55rem] font-extrabold tracking-tight text-[#111] sm:text-[1.75rem]">
          {item.company}
        </h2>
        <p className="mt-1 text-[0.88rem] text-[#6A7A76]">{item.companyZh}</p>
      </div>

      <div className="px-6 pb-6 sm:px-10">
        <div className="overflow-hidden rounded-[0.35rem] bg-[#F5F5F3]">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            className="h-auto w-full object-contain"
          />
        </div>
        {item.image.caption ? (
          <p className="mt-3 text-[0.72rem] leading-5 text-[#8A9692]">
            {item.image.caption}
          </p>
        ) : null}
      </div>

      <div className="space-y-3.5 px-6 pb-8 sm:px-10">
        {item.brief.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-[0.92rem] leading-7 text-[#333]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="border-t border-black/[0.06] px-6 py-6 sm:px-10">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#8A9692]">
          Focus
        </p>
        <ul className="mt-3 space-y-2">
          {item.highlights.map((line) => (
            <li
              key={line}
              className="flex gap-2.5 text-[0.86rem] leading-6 text-[#3E514D]"
            >
              <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#0F4C45]/45" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="px-8 py-8 text-center sm:px-12">
        <p className="text-[0.64rem] font-medium tracking-[0.16em] text-[#8A9692]">
          End of brief
        </p>
      </footer>
    </article>
  );
}

export function WorkInternships() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const titleId = useId();
  const active =
    workInternships.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section className="mt-14">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[#0F4C45]/18" />
        <p className="shrink-0 text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#6A7A76]">
          Internships
        </p>
        <div className="h-px flex-1 bg-[#0F4C45]/18" />
      </div>
      <p className="mx-auto mt-3 max-w-[520px] text-center text-[0.84rem] leading-6 text-[#4D5D59]">
        Two earlier stops before full-time at Zongheng — open a card for the
        one-page brief.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {workInternships.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className="group cursor-pointer overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/10 bg-[#F4F0E8] text-left shadow-[0_8px_22px_rgba(22,43,38,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(22,43,38,0.1)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#E8E2D6]">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8A9692]">
                  Open brief
                </p>
                <span
                  aria-hidden
                  className="text-[0.85rem] text-[#0F4C45] transition group-hover:translate-x-0.5"
                >
                  →
                </span>
              </div>
              <h3 className="mt-1.5 text-[1.08rem] font-extrabold tracking-tight text-[#162b26]">
                {item.company}
              </h3>
              <p className="mt-0.5 text-[0.78rem] text-[#6A7A76]">
                {item.companyZh}
              </p>
              <p className="mt-3 text-[0.84rem] leading-6 text-[#3E514D]">
                {item.summary}
              </p>
            </div>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,22,20,0.62)] p-3 backdrop-blur-[2px] sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setActiveId(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <h2
                id={titleId}
                className="truncate text-[0.82rem] font-semibold tracking-[0.04em] text-white/90"
              >
                {active.company}
              </h2>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[0.74rem] font-semibold text-white transition hover:bg-white/20"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain rounded-[0.35rem] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <InternshipBrief item={active} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
