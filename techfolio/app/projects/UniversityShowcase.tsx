"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import type { ProjectImage } from "./project-data";
import {
  type ShowcaseSpread,
  type UniversityShowcase,
  universityShowcases,
} from "./university-showcases";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#7A8A86]">
      {children}
    </p>
  );
}

function DocImage({
  image,
  className = "",
  frameClassName = "bg-[#F5F5F3]",
  imgClassName = "h-auto w-full object-contain",
  priority = false,
}: {
  image: ProjectImage;
  className?: string;
  frameClassName?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div className={`overflow-hidden ${frameClassName}`}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          quality={95}
          priority={priority}
          sizes="(max-width: 720px) 100vw, 720px"
          className={`${imgClassName} [image-rendering:auto]`}
        />
      </div>
      {image.caption ? (
        <figcaption className="mt-2.5 text-center text-[0.66rem] font-medium tracking-[0.06em] text-[#8A9692]">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Spread({ spread }: { spread: ShowcaseSpread }) {
  switch (spread.type) {
    case "product-hero":
      return (
        <section className="border-b border-black/[0.06] px-6 py-12 sm:px-10 sm:py-14">
          {spread.kicker ? <Eyebrow>{spread.kicker}</Eyebrow> : null}
          <h2 className="mt-4 text-center text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#111] sm:text-[2.35rem]">
            {spread.title}
          </h2>
          {spread.subtitle ? (
            <p className="mx-auto mt-3 max-w-[26rem] text-center text-[0.92rem] leading-7 text-[#5C6763]">
              {spread.subtitle}
            </p>
          ) : null}
          <DocImage
            image={spread.image}
            className={`mx-auto mt-9 ${spread.image.width / spread.image.height > 1.2 ? "max-w-none" : "max-w-[420px]"}`}
            frameClassName="overflow-hidden rounded-[1rem] bg-[#F5F5F3]"
            imgClassName={
              spread.image.width / spread.image.height > 1.2
                ? "h-auto w-full object-cover"
                : "h-auto w-full object-contain"
            }
          />
        </section>
      );

    case "cover":
      return (
        <section className="border-b border-black/[0.06] px-8 py-12 sm:px-12 sm:py-14">
          <Eyebrow>{spread.kicker}</Eyebrow>
          <h2 className="mt-5 whitespace-pre-line text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#111] sm:text-[2.45rem]">
            {spread.title}
          </h2>
          <p className="mt-4 max-w-[34rem] text-[0.92rem] leading-7 text-[#5C6763]">
            {spread.subtitle}
          </p>
          {spread.image ? (
            <DocImage image={spread.image} className="mt-8" />
          ) : null}
        </section>
      );

    case "prose":
      return (
        <section className="border-b border-black/[0.06] px-8 py-11 sm:px-12">
          {spread.eyebrow ? <Eyebrow>{spread.eyebrow}</Eyebrow> : null}
          <h3
            className={`text-[1.2rem] font-semibold tracking-[-0.02em] text-[#111] sm:text-[1.35rem] ${spread.eyebrow ? "mt-3" : ""}`}
          >
            {spread.heading}
          </h3>
          <div className="mt-4 max-w-[34rem] space-y-3.5 text-[0.9rem] leading-7 text-[#4A5551]">
            {spread.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      );

    case "feature-list":
      return (
        <section className="border-b border-black/[0.06] px-8 py-11 sm:px-12">
          <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[#111] sm:text-[1.35rem]">
            {spread.heading}
          </h3>
          <ul className="mt-5 space-y-0 text-[0.9rem] leading-7 text-[#4A5551]">
            {spread.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-b border-black/[0.05] py-3 last:border-0"
              >
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#111]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "image-full":
      return (
        <section className="border-b border-black/[0.06] px-8 py-11 sm:px-12">
          {spread.eyebrow ? <Eyebrow>{spread.eyebrow}</Eyebrow> : null}
          {spread.heading ? (
            <h3
              className={`text-[1.2rem] font-semibold tracking-[-0.02em] text-[#111] sm:text-[1.35rem] ${spread.eyebrow ? "mt-3" : ""}`}
            >
              {spread.heading}
            </h3>
          ) : null}
          {spread.body?.length ? (
            <div className="mt-4 max-w-[34rem] space-y-3 text-[0.9rem] leading-7 text-[#4A5551]">
              {spread.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          <DocImage
            image={spread.image}
            className={spread.heading || spread.body ? "mt-7" : ""}
            frameClassName={
              spread.imageTone === "dark"
                ? "overflow-hidden rounded-[1.15rem] bg-[#111] ring-1 ring-black/[0.08]"
                : "overflow-hidden rounded-[1.15rem] bg-[#F5F5F3] ring-1 ring-black/[0.04]"
            }
            priority
          />
        </section>
      );

    case "hardware-stage":
      return (
        <section className="border-b border-black/[0.06] bg-[#FAFAF8] px-6 py-12 sm:px-10 sm:py-14">
          <Eyebrow>{spread.eyebrow}</Eyebrow>
          <h3 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.02em] text-[#111] sm:text-[1.55rem]">
            {spread.heading}
          </h3>
          <div className="mt-4 max-w-[34rem] space-y-3 text-[0.9rem] leading-7 text-[#4A5551]">
            {spread.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <DocImage
            image={spread.boards}
            className="mt-9"
            frameClassName="rounded-sm bg-white ring-1 ring-black/[0.04]"
          />
          <DocImage
            image={spread.layout}
            className="mt-6"
            frameClassName="rounded-sm bg-[#0B0B0B] ring-1 ring-black/[0.08]"
          />
        </section>
      );

    case "duo": {
      const soft = spread.tone === "soft";
      const cover = spread.mediaFit === "cover";

      if (soft) {
        return (
          <section className="border-b border-black/[0.06] bg-[#EEF0ED] px-5 py-14 sm:px-9 sm:py-16">
            <div className="mx-auto max-w-[34rem] text-center">
              {spread.eyebrow ? <Eyebrow>{spread.eyebrow}</Eyebrow> : null}
              {spread.heading ? (
                <h3
                  className={`text-[1.55rem] font-semibold tracking-[-0.03em] text-[#111] sm:text-[1.75rem] ${spread.eyebrow ? "mt-3" : ""}`}
                >
                  {spread.heading}
                </h3>
              ) : null}
              {spread.body?.length ? (
                <div className="mt-4 space-y-2.5 text-[0.88rem] leading-7 text-[#5A6561]">
                  {spread.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {spread.images.map((image, index) => {
                const [label, detail] = (image.caption ?? "")
                  .split(/\s*—\s*/)
                  .map((part) => part.trim());
                return (
                  <article
                    key={image.src + (image.caption ?? "")}
                    className="flex flex-col overflow-hidden rounded-[1.15rem] bg-white shadow-[0_18px_40px_rgba(22,43,38,0.07)] ring-1 ring-black/[0.04]"
                  >
                    <div className="flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8A9692]">
                        {label || `Panel ${index + 1}`}
                      </p>
                      <p className="text-[0.62rem] font-medium tracking-[0.08em] text-[#B0BAB6]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                    <div
                      className={`relative ${cover ? "aspect-[4/5] sm:aspect-[3/4]" : "flex aspect-[4/3] items-center justify-center px-4 py-3 sm:px-5"}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className={
                          cover
                            ? "h-full w-full object-cover"
                            : "max-h-full w-full object-contain"
                        }
                      />
                    </div>
                    {detail || image.caption ? (
                      <div className="border-t border-black/[0.05] px-4 py-3.5 sm:px-5">
                        <p className="text-[0.78rem] font-medium leading-5 tracking-[0.01em] text-[#3E4A46]">
                          {detail || image.caption}
                        </p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        );
      }

      return (
        <section className="border-b border-black/[0.06] px-6 py-12 sm:px-10 sm:py-14">
          {spread.eyebrow ? <Eyebrow>{spread.eyebrow}</Eyebrow> : null}
          {spread.heading ? (
            <h3
              className={`text-[1.35rem] font-semibold tracking-[-0.02em] text-[#111] sm:text-[1.55rem] ${spread.eyebrow ? "mt-3" : ""}`}
            >
              {spread.heading}
            </h3>
          ) : null}
          {spread.body?.length ? (
            <div className="mt-4 max-w-[34rem] space-y-3 text-[0.9rem] leading-7 text-[#4A5551]">
              {spread.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          <div
            className={`grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 ${spread.heading || spread.body ? "mt-8" : ""}`}
          >
            {spread.images.map((image) => (
              <DocImage
                key={image.src + (image.caption ?? "")}
                image={image}
                frameClassName="rounded-sm bg-white ring-1 ring-black/[0.04]"
              />
            ))}
          </div>
        </section>
      );
    }

    case "quad": {
      const cover = spread.mediaFit !== "contain";
      return (
        <section className="border-b border-black/[0.06] bg-[#EEF0ED] px-5 py-14 sm:px-9 sm:py-16">
          <div className="mx-auto max-w-[34rem] text-center">
            <Eyebrow>{spread.eyebrow}</Eyebrow>
            <h3 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-[#111] sm:text-[1.75rem]">
              {spread.heading}
            </h3>
            <div className="mt-4 space-y-2.5 text-[0.88rem] leading-7 text-[#5A6561]">
              {spread.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
            {spread.images.map((image, index) => {
              const [label, detail] = (image.caption ?? "")
                .split(/\s*—\s*/)
                .map((part) => part.trim());
              return (
                <article
                  key={image.src + (image.caption ?? "")}
                  className="flex flex-col overflow-hidden rounded-[1.05rem] bg-white shadow-[0_14px_32px_rgba(22,43,38,0.06)] ring-1 ring-black/[0.04]"
                >
                  <div className="flex items-center justify-between px-3 pt-3 sm:px-4 sm:pt-4">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#8A9692]">
                      {label || `0${index + 1}`}
                    </p>
                    <p className="text-[0.58rem] font-medium tracking-[0.08em] text-[#B0BAB6]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <div className={`relative ${cover ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className={
                        cover
                          ? "h-full w-full object-cover"
                          : "h-full w-full object-contain p-2"
                      }
                    />
                  </div>
                  {detail ? (
                    <div className="border-t border-black/[0.05] px-3 py-2.5 sm:px-4 sm:py-3">
                      <p className="text-[0.72rem] font-medium leading-4 tracking-[0.01em] text-[#3E4A46]">
                        {detail}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      );
    }

    case "system-map":
      return (
        <section className="border-b border-black/[0.06] px-5 py-12 sm:px-9 sm:py-14">
          <div className="mx-auto max-w-[36rem] text-center">
            <Eyebrow>{spread.eyebrow}</Eyebrow>
            <h3 className="mt-3 text-[1.45rem] font-semibold tracking-[-0.03em] text-[#111] sm:text-[1.7rem]">
              {spread.heading}
            </h3>
            <div className="mt-4 space-y-2.5 text-[0.88rem] leading-7 text-[#5A6561]">
              {spread.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {spread.columns.map((column) => (
              <article
                key={column.title}
                className="rounded-[1.05rem] bg-[#F6F7F5] px-4 py-5 ring-1 ring-black/[0.04] sm:px-5"
              >
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8A9692]">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-white px-3 py-2 text-[0.78rem] font-medium leading-5 text-[#3E4A46] ring-1 ring-black/[0.04]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {spread.diagram ? (
            <DocImage
              image={spread.diagram}
              className="mt-8"
              frameClassName="overflow-hidden rounded-[1rem] bg-[#111] ring-1 ring-black/[0.08]"
            />
          ) : null}
        </section>
      );

    case "phones":
      return (
        <section className="border-b border-black/[0.06] px-6 py-12 sm:px-10 sm:py-14">
          <Eyebrow>{spread.eyebrow}</Eyebrow>
          <h3 className="mt-3 text-center text-[1.35rem] font-semibold tracking-[-0.02em] text-[#111] sm:text-[1.55rem]">
            {spread.heading}
          </h3>
          <div className="mx-auto mt-4 max-w-[28rem] space-y-3 text-center text-[0.9rem] leading-7 text-[#4A5551]">
            {spread.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mx-auto mt-9 flex max-w-[380px] items-end justify-center gap-4 sm:gap-5">
            {spread.images.map((image) => (
              <figure key={image.src + (image.caption ?? "")} className="w-[42%]">
                <div className="overflow-hidden rounded-[1.1rem] bg-[#F5F5F3] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.06]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="h-auto w-full rounded-[0.85rem] object-contain"
                  />
                </div>
                {image.caption ? (
                  <figcaption className="mt-2.5 text-center text-[0.64rem] font-medium tracking-[0.08em] text-[#8A9692]">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      );

    case "split": {
      const imageFirst = spread.imageSide !== "right";
      return (
        <section className="border-b border-black/[0.06] px-8 py-11 sm:px-12">
          <div
            className={`grid grid-cols-1 items-center gap-6 sm:gap-8 ${
              imageFirst
                ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
                : "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            }`}
          >
            {imageFirst ? <DocImage image={spread.image} /> : null}
            <div>
              <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[#111] sm:text-[1.35rem]">
                {spread.heading}
              </h3>
              <div className="mt-4 space-y-3.5 text-[0.9rem] leading-7 text-[#4A5551]">
                {spread.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            {!imageFirst ? <DocImage image={spread.image} /> : null}
          </div>
        </section>
      );
    }

    case "cinema-hero":
      return (
        <section className="bg-white">
          <div className="px-6 pb-6 pt-12 text-center sm:px-10 sm:pb-8 sm:pt-14">
            <p className="text-[0.7rem] font-medium tracking-[0.08em] text-[#5C5C5C]">
              {spread.kicker}
            </p>
            <h2 className="mt-2 whitespace-pre-line text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#171a20] sm:text-[2.5rem]">
              {spread.title}
            </h2>
            <p className="mx-auto mt-3 max-w-[26rem] text-[0.92rem] font-normal leading-6 text-[#5C5C5C]">
              {spread.subtitle}
            </p>
          </div>
          <div className="relative aspect-[16/10] w-full bg-[#F4F4F4]">
            <Image
              src={spread.image.src}
              alt={spread.image.alt}
              width={spread.image.width}
              height={spread.image.height}
              priority
              quality={95}
              sizes="(max-width: 720px) 100vw, 720px"
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      );

    case "quote-band":
      return (
        <section className="bg-white px-8 py-12 text-center sm:px-12 sm:py-14">
          <p className="mx-auto max-w-[28rem] text-[1.15rem] font-medium leading-8 tracking-[-0.02em] text-[#171a20]">
            {spread.quote}
          </p>
          <p className="mt-4 text-[0.7rem] font-medium tracking-[0.12em] text-[#8E8E8E]">
            {spread.meta}
          </p>
        </section>
      );

    case "mosaic":
      return (
        <section className="bg-white">
          <div className="px-6 pb-6 pt-12 text-center sm:px-10 sm:pb-8 sm:pt-14">
            <p className="text-[0.7rem] font-medium tracking-[0.08em] text-[#5C5C5C]">
              {spread.eyebrow}
            </p>
            <h3 className="mt-2 text-[1.75rem] font-medium tracking-[-0.03em] text-[#171a20] sm:text-[2.1rem]">
              {spread.heading}
            </h3>
            <div className="mx-auto mt-3 max-w-[28rem] space-y-2 text-[0.92rem] leading-6 text-[#5C5C5C]">
              {spread.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {[spread.feature, spread.side].map((image) => (
              <figure key={image.src + (image.caption ?? "")} className="relative">
                <div className="relative aspect-[4/5] bg-[#F4F4F4] sm:aspect-[3/4]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    quality={95}
                    sizes="(max-width: 720px) 100vw, 360px"
                    className="h-full w-full object-cover"
                  />
                </div>
                {image.caption ? (
                  <figcaption className="absolute bottom-3 left-3 rounded bg-white/90 px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.06em] text-[#171a20]">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      );

    default:
      return null;
  }
}

export function ShowcaseDocument({
  item,
  sectionLabel = "University",
  className = "",
}: {
  item: UniversityShowcase;
  sectionLabel?: string;
  className?: string;
}) {
  return (
    <article
      className={`bg-white text-[#111] ${className || "shadow-[0_24px_80px_rgba(0,0,0,0.28)]"}`}
    >
      <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-3.5 sm:px-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
          Product Brief
        </p>
        <p className="text-[0.62rem] font-medium tracking-[0.1em] text-[#8A9692]">
          {sectionLabel}
        </p>
      </div>
      {item.spreads.map((spread, index) => (
        <Spread key={`${spread.type}-${index}`} spread={spread} />
      ))}
      <footer className="px-8 py-10 text-center sm:px-12">
        <p className="text-[0.64rem] font-medium tracking-[0.16em] text-[#8A9692]">
          End of brief
        </p>
      </footer>
    </article>
  );
}

/** Scrollable page feed — theme-matched, no modal cards. */
export function ShowcaseInlineFeed({
  items,
  sectionLabel = "Brief",
  className = "mt-8",
}: {
  items: UniversityShowcase[];
  sectionLabel?: string;
  className?: string;
}) {
  return (
    <div className={`${className} space-y-6 sm:space-y-8`}>
      {items.map((item, index) => (
        <ThemeStorySection
          key={item.id}
          item={item}
          index={index}
          sectionLabel={sectionLabel}
        />
      ))}
    </div>
  );
}

function ThemeStorySection({
  item,
  index,
  sectionLabel,
}: {
  item: UniversityShowcase;
  index: number;
  sectionLabel: string;
}) {
  const hero = item.spreads.find((s) => s.type === "product-hero");
  const heroImage =
    hero && hero.type === "product-hero" ? hero.image : undefined;

  return (
    <section className="overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] shadow-[0_12px_28px_rgba(22,43,38,0.05)]">
      <div className="border-b border-[#0F4C45]/10 px-5 py-4 sm:px-7 sm:py-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#0F4C45]">
          {sectionLabel} · {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="mt-2 text-[1.35rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.55rem]">
          {item.title}
        </h2>
        <p className="mt-1.5 text-[0.86rem] leading-6 text-[#4D5D59]">
          {item.subtitle}
        </p>
      </div>

      {heroImage ? (
        <div className="border-b border-[#0F4C45]/10 bg-[#F7F1E8]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            className="h-auto w-full object-cover"
          />
          {heroImage.caption ? (
            <p className="px-5 py-3 text-[0.72rem] leading-5 text-[#6A7A76] sm:px-7">
              {heroImage.caption}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-0 px-5 py-2 sm:px-7 sm:py-3">
        {item.spreads.map((spread, spreadIndex) => (
          <ThemeSpread
            key={`${spread.type}-${spreadIndex}`}
            spread={spread}
            skipHeroImage
          />
        ))}
      </div>
    </section>
  );
}

function ThemeSpread({
  spread,
  skipHeroImage = false,
}: {
  spread: ShowcaseSpread;
  skipHeroImage?: boolean;
}) {
  switch (spread.type) {
    case "product-hero":
      if (skipHeroImage) {
        return spread.subtitle ? (
          <div className="border-b border-[#0F4C45]/08 py-5 last:border-0">
            <p className="max-w-[40rem] text-[0.9rem] leading-7 text-[#3E514D]">
              {spread.subtitle}
            </p>
          </div>
        ) : null;
      }
      return null;

    case "prose":
      return (
        <div className="border-b border-[#0F4C45]/08 py-5 last:border-0">
          {spread.eyebrow ? (
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]">
              {spread.eyebrow}
            </p>
          ) : null}
          <h3
            className={`text-[1.08rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.15rem] ${
              spread.eyebrow ? "mt-2" : ""
            }`}
          >
            {spread.heading}
          </h3>
          <div className="mt-3 max-w-[40rem] space-y-3 text-[0.9rem] leading-7 text-[#3E514D]">
            {spread.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      );

    case "feature-list":
      return (
        <div className="border-b border-[#0F4C45]/08 py-5 last:border-0">
          <h3 className="text-[1.08rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.15rem]">
            {spread.heading}
          </h3>
          <ul className="mt-3 space-y-2">
            {spread.items.map((line) => (
              <li
                key={line}
                className="flex gap-2.5 text-[0.88rem] leading-6 text-[#3E514D]"
              >
                <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#0F4C45]/5" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "duo":
      return (
        <div className="border-b border-[#0F4C45]/08 py-5 last:border-0">
          {spread.eyebrow ? (
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]">
              {spread.eyebrow}
            </p>
          ) : null}
          {spread.heading ? (
            <h3
              className={`text-[1.08rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.15rem] ${
                spread.eyebrow ? "mt-2" : ""
              }`}
            >
              {spread.heading}
            </h3>
          ) : null}
          {spread.body?.length ? (
            <div className="mt-3 max-w-[40rem] space-y-2 text-[0.9rem] leading-7 text-[#3E514D]">
              {spread.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {spread.images.map((image) => (
              <figure
                key={image.src}
                className="overflow-hidden rounded-[0.85rem] border border-[#0F4C45]/10 bg-[#F7F1E8]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full object-cover"
                />
                {image.caption ? (
                  <figcaption className="px-3 py-2.5 text-[0.72rem] text-[#6A7A76]">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      );

    case "image-full":
      return (
        <div className="border-b border-[#0F4C45]/08 py-5 last:border-0">
          {spread.eyebrow ? (
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]">
              {spread.eyebrow}
            </p>
          ) : null}
          {spread.heading ? (
            <h3
              className={`text-[1.08rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.15rem] ${
                spread.eyebrow ? "mt-2" : ""
              }`}
            >
              {spread.heading}
            </h3>
          ) : null}
          {spread.body?.length ? (
            <div className="mt-3 max-w-[40rem] space-y-2 text-[0.9rem] leading-7 text-[#3E514D]">
              {spread.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          <figure className="mt-4 overflow-hidden rounded-[0.85rem] border border-[#0F4C45]/10 bg-[#F7F1E8]">
            <Image
              src={spread.image.src}
              alt={spread.image.alt}
              width={spread.image.width}
              height={spread.image.height}
              className="h-auto w-full object-cover"
            />
            {spread.image.caption ? (
              <figcaption className="px-3 py-2.5 text-[0.72rem] text-[#6A7A76]">
                {spread.image.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      );

    default:
      return null;
  }
}

function ShowcaseCard({
  item,
  featured = false,
  index = 0,
  onOpen,
}: {
  item: UniversityShowcase;
  featured?: boolean;
  index?: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${index * 70}ms` }}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] text-left shadow-[0_12px_28px_rgba(22,43,38,0.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(22,43,38,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C45] motion-safe:animate-[uniCardIn_0.55s_ease_both] ${
        featured ? "min-h-[320px] sm:min-h-[380px]" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#F7F1E8] ${
          featured ? "min-h-[220px] flex-1 sm:min-h-0" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={item.cardImage.src}
          alt={item.cardImage.alt}
          width={item.cardImage.width}
          height={item.cardImage.height}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,28,24,0.55)] via-[rgba(10,28,24,0.08)] to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      </div>

      <div
        className={`relative z-[1] border-t border-[#0F4C45]/08 bg-[#DDE7DE] ${
          featured ? "p-5 sm:p-6" : "p-4 sm:p-5"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]">
            Open brief
          </p>
          <span
            aria-hidden
            className="text-[0.85rem] text-[#0F4C45] transition duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </div>
        <h2
          className={`mt-2 font-extrabold leading-snug tracking-tight text-[#162b26] ${
            featured
              ? "text-[1.18rem] sm:text-[1.28rem]"
              : "text-[1.02rem] sm:text-[1.08rem]"
          }`}
        >
          {item.title}
        </h2>
        <p
          className={`mt-2 leading-5 text-[#4D5D59] ${
            featured ? "text-[0.84rem]" : "text-[0.78rem]"
          }`}
        >
          {item.subtitle}
        </p>
      </div>
    </button>
  );
}

export function UniversityShowcase({
  items = universityShowcases,
  sectionLabel = "University",
  className = "mt-8",
  layout = "grid",
  columns = 3,
}: {
  items?: UniversityShowcase[];
  sectionLabel?: string;
  className?: string;
  layout?: "grid" | "bento";
  /** Grid column count on sm+ when layout is grid. Use 3 with 2 items to left-align. */
  columns?: 2 | 3;
} = {}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const titleId = useId();
  const active = items.find((item) => item.id === activeId) ?? null;
  const isBento = layout === "bento" && items.length >= 3;
  const [featured, ...rest] = items;
  const gridCols =
    columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

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
    <>
      {isBento ? (
        <div
          className={`${className} grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-4`}
        >
          <div className="lg:row-span-2">
            <ShowcaseCard
              item={featured}
              featured
              index={0}
              onOpen={() => setActiveId(featured.id)}
            />
          </div>
          {rest.map((item, index) => (
            <ShowcaseCard
              key={item.id}
              item={item}
              index={index + 1}
              onOpen={() => setActiveId(item.id)}
            />
          ))}
        </div>
      ) : (
        <div
          className={`${className} grid grid-cols-1 gap-4 ${gridCols} sm:gap-5`}
        >
          {items.map((item, index) => (
            <ShowcaseCard
              key={item.id}
              item={item}
              index={index}
              onOpen={() => setActiveId(item.id)}
            />
          ))}
        </div>
      )}

      {active ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,22,20,0.62)] p-3 backdrop-blur-[2px] sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setActiveId(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-[720px] flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <h2
                id={titleId}
                className="truncate text-[0.82rem] font-semibold tracking-[0.04em] text-white/90"
              >
                {active.title}
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
              <ShowcaseDocument item={active} sectionLabel={sectionLabel} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
