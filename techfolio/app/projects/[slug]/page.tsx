import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { getProjectBySlug, projects } from "../project-data";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const lhoPrintGallery = [
  {
    src: "/LHO/Handout - Foods To Avoid.png",
    alt: '"Foods to Avoid" patient handout',
    caption: '"Foods to Avoid" handout',
  },
  {
    src: "/LHO/Handout - Initial Exam .png",
    alt: '"Initial Exam" patient handout',
    caption: '"Initial Exam" handout',
  },
  {
    src: "/LHO/LHO B2B Marketing Brochure-1.png",
    alt: "Patient brochure outside spread",
    caption: "Patient brochure outside spread",
  },
  {
    src: "/LHO/LHO B2B Marketing Brochure-2.png",
    alt: "Patient brochure inside spread",
    caption: "Patient brochure inside spread",
  },
];

const lhoVideos = [
  {
    src: "https://www.youtube.com/embed/2Ne6qNakRo4?si=RR6NHucx2Ef9PMeq",
    title: "Lake Hills Orthodontics welcome video",
  },
  {
    src: "https://www.youtube.com/embed/2vMIYsWUMjE?si=TmMNI19_os3258lo",
    title: "Lake Hills Orthodontics treatment process video",
  },
];

const washingtonInitialWireframes = [
  {
    src: "/Washington State Website/Initial Wireframe.png",
    alt: "Initial homepage wireframe created in Figma",
    caption:
      "Initial homepage wireframe designed in Figma to outline content sections, navigation structure, and visual hierarchy.",
    width: 600,
    height: 726,
  },
  {
    src: "/Washington State Website/Initial Wireframe - Interior City Pages.png",
    alt: "Initial interior city page wireframe",
    caption:
      "Interior city page wireframe planned to maintain consistency and readability across the site.",
    width: 600,
    height: 788,
  },
];

const washingtonFinalWireframes = [
  {
    src: "/Washington State Website/Final Wireframe - Homepage.png",
    alt: "Final homepage wireframe",
    width: 600,
    height: 2104,
  },
  {
    src: "/Washington State Website/Final Wireframe - Interior City Pages.png",
    alt: "Final interior city page wireframe",
    width: 600,
    height: 1124,
  },
];

const washingtonInteriorPages = [
  {
    src: "/Washington State Website/Interior Page - Olympia.png",
    alt: "Olympia interior page",
    city: "Olympia",
    width: 600,
    height: 299,
  },
  {
    src: "/Washington State Website/Interior Page - Leavenworth.png",
    alt: "Leavenworth interior page",
    city: "Leavenworth",
    width: 600,
    height: 302,
  },
  {
    src: "/Washington State Website/Interior Page - Poulsbo.png",
    alt: "Poulsbo interior page",
    city: "Poulsbo",
    width: 600,
    height: 302,
  },
  {
    src: "/Washington State Website/Interior Page - Winthrop.png",
    alt: "Winthrop interior page",
    city: "Winthrop",
    width: 600,
    height: 300,
  },
];

const modCottaGallery = [
  {
    src: "/ModCotta/Image 1.png",
    alt: "ModCotta brand packaging and display image",
    width: 600,
    height: 384,
  },
  {
    src: "/ModCotta/Image 2.jpg",
    alt: "ModCotta styled brand image",
    width: 600,
    height: 400,
  },
  {
    src: "/ModCotta/Earrings 1.jpg",
    alt: "ModCotta handcrafted earrings",
    width: 600,
    height: 400,
  },
  {
    src: "/ModCotta/Earrings 2.jpg",
    alt: "ModCotta handcrafted earrings",
    width: 600,
    height: 400,
  },
  {
    src: "/ModCotta/Earrings 3.jpg",
    alt: "ModCotta handcrafted earrings",
    width: 600,
    height: 400,
  },
  {
    src: "/ModCotta/Earrings 4.jpg",
    alt: "ModCotta handcrafted earrings",
    width: 600,
    height: 400,
  },
  {
    src: "/ModCotta/Earrings 5.jpg",
    alt: "ModCotta handcrafted earrings",
    width: 600,
    height: 400,
  },
  {
    src: "/ModCotta/Business cards.png",
    alt: "ModCotta business card design",
    width: 600,
    height: 400,
  },
  {
    src: "/ModCotta/Booth Image.jpeg",
    alt: "ModCotta booth display",
    width: 600,
    height: 450,
  },
];

function StreetEasePage({
  title,
  summary,
  tags,
}: {
  title: string;
  summary: string;
  tags: string[];
}) {
  return (
    <>
      <header className="mt-7 max-w-[720px]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
          Project Detail
        </p>

        <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[0.98] tracking-tight sm:text-[2.3rem] lg:text-[2.8rem]">
          {title}
        </h1>

        <p className="mt-4 max-w-[680px] text-[0.94rem] leading-7 text-[#3E514D] sm:text-[0.98rem]">
          {summary}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-3 py-1.5 text-[0.76rem] font-semibold text-[#0F4C45] sm:text-[0.82rem]"
          >
            {tag}
          </span>
        ))}
      </div>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Problem
        </h2>

        <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          <p>
            Most map tools are designed for navigation, but they do not clearly
            communicate how physically demanding an area may be to walk.
          </p>
          <p>
            For someone using a mobility aid or managing limited endurance,
            street grade can make a major difference in whether a route feels
            realistic or comfortable.
          </p>
          <p>
            I wanted to explore how street geometry, elevation data, and
            mapping could be combined into a tool that makes terrain easier to
            understand at a glance.
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center sm:p-6">
        <div>
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            What I&apos;ve Built So Far
          </h2>

          <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            <p>
              So far, I have built a responsive web prototype using React and
              Leaflet that allows users to search for a location, preview
              nearby streets within a selected radius, and view a color-coded
              street overlay representing grade difficulty.
            </p>

            <div>
              <p className="font-semibold text-[#162b26]">Current work includes:</p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "A responsive React frontend built for web-first use",
                  "Interactive map rendering with Leaflet and OpenStreetMap",
                  "Address search with autocomplete suggestions",
                  "Radius-based map preview centered on a selected location",
                  "A color-coded street overlay concept for easier terrain scanning",
                  "A lightweight backend API for search and street-grade requests",
                  "Early caching and fallback handling for unreliable third-party APIs",
                  "Resilience work around street lookup and elevation lookup failures",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5">
            <a
              href="https://github.com/brittnebaila/Accessibility-Map"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[#043439] px-5 py-2 text-[0.82rem] font-semibold text-white transition hover:opacity-90"
            >
              View Code
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]">
          <Image
            src="/StreetEase/StreetEase Initial UI.png"
            alt="StreetEase early interface"
            width={624}
            height={746}
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            Technical Challenges
          </h2>

          <p className="mt-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            StreetEase has been a strong exercise in working with real-world
            data constraints. One of the biggest challenges has been
            reliability. Public mapping and elevation APIs can time out,
            rate-limit requests, or return incomplete street-naming data, which
            makes building a smooth experience much more complex than with a
            static demo. I&apos;ve been working through those issues by
            restructuring the app to use a backend, adding caching, improving
            fallback behavior, and separating the frontend display logic from
            the data-processing pipeline.
          </p>
        </div>

        <div className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            What I&apos;m Learning
          </h2>

          <p className="mt-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            This project is helping me deepen my understanding of
            frontend-to-backend architecture, geospatial data workflows, API
            resilience, and accessibility-centered product design. It has also
            reinforced how much product quality depends on gracefully handling
            messy external data, not just on building a clean interface.
          </p>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <Image
          src="/StreetEase/StreetEase Updated UI.png"
          alt="StreetEase updated UI"
          width={1907}
          height={507}
          className="h-auto w-full rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]"
        />
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          What&apos;s Next
        </h2>

        <p className="mt-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          Next steps for StreetEase include improving the reliability of street
          and elevation data, refining how unnamed streets are handled, making
          the grade overlay denser and more accurate, and continuing to improve
          the user experience around search, feedback states, and map
          interactions.
        </p>
      </section>
    </>
  );
}

function ModCottaPage({
  title,
  summary,
  tags,
}: {
  title: string;
  summary: string;
  tags: string[];
}) {
  return (
    <>
      <header className="mt-7 max-w-[720px]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
          Project Detail
        </p>

        <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[0.98] tracking-tight sm:text-[2.3rem] lg:text-[2.8rem]">
          {title}
        </h1>

        <p className="mt-4 max-w-[680px] text-[0.94rem] leading-7 text-[#3E514D] sm:text-[0.98rem]">
          {summary}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-3 py-1.5 text-[0.76rem] font-semibold text-[#0F4C45] sm:text-[0.82rem]"
          >
            {tag}
          </span>
        ))}
      </div>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Project Overview
        </h2>

        <p className="mt-3.5 max-w-[760px] text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          ModCotta is a jewelry brand I created and operate, from design to
          web presence. I design and sculpt all pieces, develop brand visuals,
          and run the SquareUp storefront, showcasing product photography and
          cohesive marketing assets.
        </p>

        <div className="mt-5">
          <a
            href="http://modcotta.square.site"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[#043439] px-5 py-2 text-[0.82rem] font-semibold text-white transition hover:opacity-90"
          >
            View ModCotta Live Site
          </a>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center sm:p-6">
        <div className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]">
          <Image
            src="/ModCotta/ModCotta Brand Board.png"
            alt="ModCotta brand board"
            width={1920}
            height={3910}
            className="h-auto w-full"
          />
        </div>

        <div>
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            Brand Direction
          </h2>

          <p className="mt-3.5 text-[0.96rem] leading-7 text-[#3E514D] sm:text-[1rem] sm:leading-8 lg:text-[1.18rem] lg:leading-[2rem]">
            The brand aesthetic blends earthy minimalism with bold handcrafted
            design. This board showcases the logo, color palette, typography,
            and visual inspiration that guide the ModCotta experience.
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
        <div className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            My Contributions
          </h2>

          <ul className="mt-4 space-y-2.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            {[
              "Designed and handcrafted all jewelry pieces",
              "Branded and styled the SquareUp storefront",
              "Directed and produced product photography",
              "Created logo, packaging, and social graphics",
              "Wrote copy and managed all customer communications",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]">
            <div className="relative w-full pt-[177.78%]">
              <iframe
                title="ModCotta brand video"
                src="https://www-ccv.adobe.io/v1/player/ccv/DHotRIqIxup/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View"
                className="absolute inset-0 h-full w-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Product and Brand Gallery
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modCottaGallery.map((item) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8] xl:aspect-[3/2]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full xl:h-full xl:object-cover"
              />
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

function LakeHillsPage({
  title,
  summary,
  tags,
}: {
  title: string;
  summary: string;
  tags: string[];
}) {
  return (
    <>
      <header className="mt-7 max-w-[720px]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
          Project Detail
        </p>

        <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[0.98] tracking-tight sm:text-[2.3rem] lg:text-[2.8rem]">
          {title}
        </h1>

        <p className="mt-4 max-w-[680px] text-[0.94rem] leading-7 text-[#3E514D] sm:text-[0.98rem]">
          {summary}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-3 py-1.5 text-[0.76rem] font-semibold text-[#0F4C45] sm:text-[0.82rem]"
          >
            {tag}
          </span>
        ))}
      </div>

      <section className="mt-8 grid grid-cols-1 gap-5 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-center sm:p-6">
        <div className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]">
          <Image
            src="/LHO/LHO Homepage.png"
            alt="Lake Hills Orthodontics homepage redesign"
            width={1920}
            height={4980}
            className="h-auto w-full"
          />
        </div>

        <div>
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            Homepage Redesign (Figma Project)
          </h2>

          <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            <p>
              As the in-house designer for Lake Hills Orthodontics, I initiated
              a homepage redesign to better align the site with the brand&apos;s
              values and improve overall usability. The original homepage felt
              outdated and lacked a clear visual hierarchy.
            </p>
            <p>
              My redesign focused on simplifying the layout, making
              calls-to-action more prominent, and improving the mobile
              experience.
            </p>
            <p>
              Using Figma, I created wireframes and high-fidelity mockups with
              an updated type system, refined color palette, and more intuitive
              content flow. The design maintains the friendly, trustworthy tone
              of the practice while giving users faster access to key actions
              like scheduling appointments or learning about services.
            </p>
            <p>
              This project allowed me to apply UX design principles in a
              real-world setting while preparing the layout for future
              development. I approached it as both a designer and a future
              front-end developer, thinking through how the layout would
              translate into code and how users would interact with it across
              devices.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Patient-Facing Print Design
        </h2>

        <p className="mt-3.5 max-w-[760px] text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          To support the patient experience, I design a variety of print
          materials that are used in-office and digitally. These include intake
          forms, welcome brochures, and holiday cards. Each piece is designed
          to be easy to read, brand-aligned, and accessible to patients of all
          ages.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lhoPrintGallery.map((item) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={3300}
                height={2550}
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Seasonal Campaigns
        </h2>

        <p className="mt-3.5 max-w-[760px] text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          Throughout the year, I create custom designs for Lake Hills
          Orthodontics to support seasonal promotions and patient engagement.
          These include apparel, holiday cards, and branded visuals that
          reflect the practice&apos;s friendly, community-centered tone.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
          <figure className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8] lg:self-start">
            <Image
              src="/LHO/Christmas Card 2022 - Finalized Version for Print.png"
              alt="Lake Hills Orthodontics holiday card design"
              width={1500}
              height={2100}
              className="h-auto w-full"
            />
            <figcaption className="px-4 py-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
              Concept, photography, and design for a custom holiday card using
              Photoshop and Illustrator.
            </figcaption>
          </figure>

          <div className="grid grid-cols-1 gap-4">
            <figure className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]">
              <div className="bg-[#D6D1C7] p-3 sm:p-4">
                <Image
                  src="/LHO/Camp Smile.png"
                  alt="Camp Smile seasonal campaign illustration"
                  width={4168}
                  height={2917}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="px-4 py-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
                Custom illustrated graphic created in Adobe Illustrator for
                Lake Hills Orthodontics&apos; summer campaign.
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]">
              <Image
                src="/LHO/Camp Smile Shirt.png"
                alt="Camp Smile T-shirt design"
                width={621}
                height={662}
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
                T-shirt design featuring original vector artwork, created in
                Illustrator for a seasonal patient giveaway.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Brand Video
        </h2>

        <p className="mt-3.5 max-w-[760px] text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          I created these promotional videos for Lake Hills Orthodontics as
          part of a larger in-house branding effort. The projects included
          scripting, video editing, motion timing, and visual integration with
          the existing brand identity. They were used across the practice&apos;s
          website and social media to welcome new patients and explain
          different treatment processes.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {lhoVideos.map((video) => (
            <div
              key={video.src}
              className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]"
            >
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src={video.src}
                  title={video.title}
                  allow="autoplay; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Reflection
        </h2>

        <p className="mt-3.5 max-w-[780px] text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          Working on the Lake Hills Orthodontics brand has given me real-world
          experience managing diverse design projects across print, digital,
          and video. From patient materials to seasonal campaigns and a
          homepage redesign in Figma, I&apos;ve strengthened my ability to create
          cohesive, user-friendly visuals that align with both brand values and
          business goals. This work deepened my understanding of how thoughtful
          design directly supports both client experience and team workflows.
        </p>
      </section>
    </>
  );
}

function WashingtonPage({
  title,
  tags,
}: {
  title: string;
  tags: string[];
}) {
  return (
    <>
      <header className="mt-7 max-w-[720px]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
          Project Detail
        </p>

        <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[0.98] tracking-tight sm:text-[2.3rem] lg:text-[2.8rem]">
          {title}
        </h1>
      </header>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-3 py-1.5 text-[0.76rem] font-semibold text-[#0F4C45] sm:text-[0.82rem]"
          >
            {tag}
          </span>
        ))}
      </div>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Project Overview
        </h2>

        <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          <p>
            This project was created for a Front-End Web Development course at
            Western Governors University. The goal was to develop a fully
            responsive website with a homepage and individual pages for three
            cities.
          </p>
          <p>
            I designed, structured, and coded every part of the site by hand,
            incorporating accessibility, user experience, and visual design
            principles.
          </p>
          <p>
            The project received an <em>Excellence Award</em> for its clean
            design, responsiveness, and attention to detail.
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6">
        <div className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            My Role
          </h2>

          <ul className="mt-4 space-y-2.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            {[
              "Wrote semantic HTML for all pages",
              "Designed layout and color scheme",
              "Created navigation and a consistent structure",
              "Styled responsive components using CSS Flexbox and Grid",
              "Implemented accessible color contrast and scalable typography",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            From Figma to Code
          </h2>

          <p className="mt-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
            Before writing a single line of code, I began by wireframing the
            homepage and supporting pages in Figma to establish layout, content
            hierarchy, and responsive behavior. This planning phase helped
            clarify the user experience and set a strong foundation for
            development. The final coded site closely follows the wireframes,
            with refinements made during the build process to improve
            readability and interaction on both desktop and mobile.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Initial Wireframes
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {washingtonInitialWireframes.map((item) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Final Wireframes
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1fr)]">
          {washingtonFinalWireframes.map((item) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Responsive Website - Final Build
        </h2>

        <p className="mt-3.5 max-w-[760px] text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          Below are views of the final website, built entirely from scratch
          using semantic HTML, CSS, and JavaScript. The design brings the
          original Figma wireframes to life with a clean, responsive layout and
          accessible structure.
        </p>

        <div className="mt-5 overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]">
          <Image
            src="/Washington State Website/Homepage.png"
            alt="Final Washington State Website homepage"
            width={1907}
            height={958}
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-6">
        <div className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            Tools Used
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "HTML",
              "CSS",
              "JavaScript",
              "Figma",
              "Visual Studio Code",
              "Git & GitHub",
            ].map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-3 py-1.5 text-[0.76rem] font-semibold text-[#0F4C45] sm:text-[0.82rem]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 text-center shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
          <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
            Live Site + GitHub
          </h2>

          <div className="mt-4 flex flex-col items-center gap-3">
            <a
              href="https://brittnebaila.github.io/washington-state-website/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#043439] px-5 py-2 text-[0.82rem] font-semibold text-white transition hover:opacity-90"
            >
              View Website on GitHub Pages
            </a>
            <a
              href="https://github.com/brittnebaila/washington-state-website"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#0F4C45]/18 bg-[#F7F1E8] px-5 py-2 text-[0.82rem] font-semibold text-[#0F4C45] transition hover:bg-[#0F4C45] hover:text-white"
            >
              View Code on GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Interior Pages
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {washingtonInteriorPages.map((item) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-[1rem] border border-[#0F4C45]/12 bg-[#F7F1E8]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-[0.76rem] font-medium leading-5 text-[#4D5D59] sm:text-[0.8rem]">
                {item.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 text-center shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Recognition
        </h2>

        <blockquote className="mx-auto mt-4 max-w-[780px] text-[0.9rem] italic leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          &ldquo;Your Washington-state website embodies professional-grade front-end
          development: clean, semantic HTML; elegant, responsive CSS that
          brings subtle hover flourishes and precise positioning to life; and
          thoughtful JavaScript validation that anticipates user needs. The
          consistent navigation, accessible imagery, and well-researched city
          content show you kept real visitors front-of-mind, transforming a
          checklist of requirements into a cohesive, engaging experience. That
          blend of technical rigor and user-centered storytelling sets
          outstanding work apart and speaks volumes about your creativity,
          discipline, and attention to detail. You should be proud, as this
          project is a resume-worthy showcase of your skills and clear evidence
          that you can turn vision into a polished reality. Great job!&rdquo;
        </blockquote>

        <p className="mt-4 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#4D5D59] sm:text-[0.82rem]">
          Course Instructor, D277 · Western Governors University
        </p>
      </section>

      <section className="mt-8 rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6">
        <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          Reflection
        </h2>

        <p className="mt-3.5 max-w-[780px] text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
          This project strengthened my ability to plan site structure,
          implement responsive design, and refine layout decisions with
          usability and accessibility in mind. The recognition it received
          reinforced my interest in front-end development and gave me even more
          confidence in combining visual design with hands-on implementation.
        </p>
      </section>
    </>
  );
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
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C45] transition hover:bg-[#0F4C45]/8"
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
                    href={`/projects/${navProject.slug}`}
                    className={`rounded-full px-3.5 py-2 text-[0.72rem] font-semibold transition sm:px-4 sm:text-[0.78rem] ${
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
        <div className="flex flex-wrap gap-3">
          {project.links
            ?.filter((link) =>
              project.slug === "streetease" ? link.label !== "View Code" : true
            )
            .map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#043439] px-3.5 py-1.5 text-[0.82rem] font-semibold text-white transition hover:opacity-90 sm:px-4 sm:text-[0.88rem]"
              >
                {link.label}
              </a>
            ))}
        </div>

        {project.slug === "streetease" ? (
          <StreetEasePage
            title={project.title}
            summary={project.summary}
            tags={project.tags}
          />
        ) : project.slug === "modcotta" ? (
          <ModCottaPage
            title={project.title}
            summary={project.summary}
            tags={project.tags}
          />
        ) : project.slug === "lake-hills-orthodontics" ? (
          <LakeHillsPage
            title={project.title}
            summary={project.summary}
            tags={project.tags}
          />
        ) : project.slug === "washington-state-website" ? (
          <WashingtonPage title={project.title} tags={project.tags} />
        ) : (
          <>
            <header className="mt-7 max-w-[680px]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
                Project Detail
              </p>

              <h1 className="mt-3 text-[1.9rem] font-extrabold leading-[0.98] tracking-tight sm:text-[2.3rem] lg:text-[2.8rem]">
                {project.title}
              </h1>

              <p className="mt-4 max-w-[640px] text-[0.94rem] leading-7 text-[#3E514D] sm:text-[0.98rem]">
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

            <section className="mt-8 rounded-[1.25rem] border border-dashed border-[#0F4C45]/18 bg-[#F7F1E8] px-4 py-10 text-center text-[0.92rem] font-semibold text-[#6B7B77] sm:py-12">
              Project image gallery placeholder
            </section>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:gap-6">
              {project.sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 shadow-[0_12px_28px_rgba(22,43,38,0.05)] sm:p-6"
                >
                  <h2 className="text-[1.22rem] font-extrabold tracking-tight sm:text-[1.4rem]">
                    {section.title}
                  </h2>

                  {section.type === "text" ? (
                    <div className="mt-3.5 space-y-3.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4">
                      {section.intro ? (
                        <p className="text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
                          {section.intro}
                        </p>
                      ) : null}

                      <ul className="mt-4 space-y-2.5 text-[0.9rem] leading-6.5 text-[#3E514D] sm:text-[0.94rem] sm:leading-7">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="border-t border-[#0F4C45]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex w-full max-w-[980px] justify-center px-4 py-6 text-center sm:px-6 md:px-8 lg:px-10">
          <p className="text-[0.72rem] font-medium tracking-[0.04em] text-[#6B7B77] sm:text-[0.78rem]">
            © 2026 Brittne Valdivia. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </main>
  );
}
