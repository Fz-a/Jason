export type ProjectDetailSection =
  | {
      type: "text";
      title: string;
      body: string[];
    }
  | {
      type: "list";
      title: string;
      intro?: string;
      items: string[];
    };

export type ProjectDetail = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  cardSummary: string;
  tags: string[];
  links?: { label: string; href: string }[];
  sections: ProjectDetailSection[];
};

export const projects: ProjectDetail[] = [
  {
    slug: "streetease",
    title: "StreetEase",
    shortTitle: "StreetEase",
    summary:
      "A web-based mapping tool designed to help users understand how steep nearby streets are around a chosen address. The goal is to make it easier for people with mobility limitations, disabilities, or difficulty walking to preview the terrain around a destination before they go.",
    cardSummary:
      "In-progress accessibility-focused mapping app that helps users visualize nearby street grades around a destination through a responsive, map-first web interface.",
    tags: ["React", "Leaflet", "Accessibility", "Mapping UX"],
    links: [
      {
        label: "View Code",
        href: "https://github.com/brittnebaila/Accessibility-Map",
      },
    ],
    sections: [
      {
        type: "text",
        title: "Problem",
        body: [
          "Most map tools are designed for navigation, but they do not clearly communicate how physically demanding an area may be to walk.",
          "For someone using a mobility aid or managing limited endurance, street grade can make a major difference in whether a route feels realistic or comfortable.",
          "I wanted to explore how street geometry, elevation data, and mapping could be combined into a tool that makes terrain easier to understand at a glance.",
        ],
      },
      {
        type: "list",
        title: "What I’ve Built So Far",
        intro:
          "So far, I have built a responsive web prototype using React and Leaflet that allows users to search for a location, preview nearby streets within a selected radius, and view a color-coded street overlay representing grade difficulty.",
        items: [
          "A responsive React frontend built for web-first use",
          "Interactive map rendering with Leaflet and OpenStreetMap",
          "Address search with autocomplete suggestions",
          "Radius-based map preview centered on a selected location",
          "A color-coded street overlay concept for easier terrain scanning",
          "A lightweight backend API for search and street-grade requests",
          "Early caching and fallback handling for unreliable third-party APIs",
          "Resilience work around street lookup and elevation lookup failures",
        ],
      },
      {
        type: "text",
        title: "Technical Challenges",
        body: [
          "StreetEase has been a strong exercise in working with real-world data constraints. One of the biggest challenges has been reliability. Public mapping and elevation APIs can time out, rate-limit requests, or return incomplete street-naming data, which makes building a smooth experience much more complex than with a static demo.",
          "I’ve been working through those issues by restructuring the app to use a backend, adding caching, improving fallback behavior, and separating the frontend display logic from the data-processing pipeline.",
        ],
      },
      {
        type: "text",
        title: "What I’m Learning",
        body: [
          "This project is helping me deepen my understanding of frontend-to-backend architecture, geospatial data workflows, API resilience, and accessibility-centered product design.",
          "It has also reinforced how much product quality depends on gracefully handling messy external data, not just on building a clean interface.",
        ],
      },
    ],
  },
  {
    slug: "washington-state-website",
    title: "Washington State Website",
    shortTitle: "Washington State Website",
    summary:
      "A responsive website project created for a Front-End Web Development course at Western Governors University, designed to highlight Washington’s natural landmarks while emphasizing accessibility, usability, and clean visual structure.",
    cardSummary:
      "Responsive website built with HTML, CSS, and JavaScript to highlight Washington’s natural landmarks while improving accessibility and usability.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    sections: [
      {
        type: "text",
        title: "Project Overview",
        body: [
          "This project was created for a Front-End Web Development course at Western Governors University. The goal was to develop a fully responsive website with a homepage and individual pages for three cities.",
          "I designed, structured, and coded every part of the site by hand, incorporating accessibility, user experience, and visual design principles.",
          "The project received an Excellence Award for its clean design, responsiveness, and attention to detail.",
        ],
      },
      {
        type: "list",
        title: "My Role",
        items: [
          "Wrote semantic HTML for all pages",
          "Designed the layout and color system",
          "Created navigation and a consistent page structure",
          "Styled responsive components using CSS Flexbox and Grid",
          "Implemented accessible color contrast and scalable typography",
        ],
      },
      {
        type: "text",
        title: "From Figma to Code",
        body: [
          "Before writing a single line of code, I began by wireframing the homepage and supporting pages in Figma to establish layout, content hierarchy, and responsive behavior.",
          "This planning phase helped clarify the user experience and set a strong foundation for development. The final coded site closely follows the wireframes, with refinements made during the build process to improve readability and interaction on both desktop and mobile.",
        ],
      },
      {
        type: "text",
        title: "Final Build",
        body: [
          "The final website was built entirely from scratch using semantic HTML, CSS, and JavaScript.",
          "The design brings the original wireframes to life with a clean, responsive layout and accessible structure, while keeping the information easy to scan across devices.",
        ],
      },
    ],
  },
  {
    slug: "lake-hills-orthodontics",
    title: "Lake Hills Orthodontics",
    shortTitle: "Lake Hills Orthodontics",
    summary:
      "As the in-house designer, I create branded print and digital materials for Lake Hills Orthodontics, including brochures, forms, social media content, video, and seasonal campaigns. My work supports both patient experience and internal marketing efforts with a consistent, welcoming visual identity.",
    cardSummary:
      "In-house design and UX project including a full homepage redesign in Figma, branded patient materials, and promotional video work.",
    tags: ["Figma", "Branding", "UX", "Marketing Design"],
    sections: [
      {
        type: "text",
        title: "Homepage Redesign",
        body: [
          "As the in-house designer for Lake Hills Orthodontics, I initiated a homepage redesign to better align the site with the brand’s values and improve overall usability. The original homepage felt outdated and lacked a clear visual hierarchy.",
          "My redesign focused on simplifying the layout, making calls-to-action more prominent, and improving the mobile experience.",
          "Using Figma, I created wireframes and high-fidelity mockups with an updated type system, refined color palette, and more intuitive content flow. The design maintains the friendly, trustworthy tone of the practice while giving users faster access to key actions like scheduling appointments or learning about services.",
          "I approached this project as both a designer and a future front-end developer, thinking through how the layout would translate into code and how users would interact with it across devices.",
        ],
      },
      {
        type: "text",
        title: "Patient-Facing Print Design",
        body: [
          "To support the patient experience, I design a variety of print materials used both in-office and digitally. These include intake forms, welcome brochures, and educational handouts.",
          "Each piece is designed to be easy to read, brand-aligned, and accessible to patients of all ages.",
        ],
      },
      {
        type: "text",
        title: "Seasonal Campaigns",
        body: [
          "Throughout the year, I create custom designs for Lake Hills Orthodontics to support seasonal promotions and patient engagement.",
          "These include apparel, holiday cards, and branded visuals that reflect the practice’s friendly, community-centered tone.",
        ],
      },
    ],
  },
  {
    slug: "modcotta",
    title: "ModCotta",
    shortTitle: "ModCotta",
    summary:
      "Brand identity, photography, and eCommerce experience for a handmade jewelry brand I founded and operate.",
    cardSummary:
      "Handmade jewelry brand built from scratch, combining visual identity, eCommerce, product storytelling, and local market integration.",
    tags: ["eCommerce", "Brand Design", "Content", "Small Business"],
    links: [
      {
        label: "View Live Site",
        href: "http://modcotta.square.site",
      },
    ],
    sections: [
      {
        type: "text",
        title: "Project Overview",
        body: [
          "ModCotta is a jewelry brand I created and operate, from product design to web presence. I design and sculpt all pieces, develop brand visuals, and run the SquareUp storefront, supported by product photography and cohesive marketing assets.",
        ],
      },
      {
        type: "text",
        title: "Brand Direction",
        body: [
          "The brand aesthetic blends earthy minimalism with bold handcrafted design.",
          "Every visual decision, from the logo and palette to photography and packaging, is meant to create a cohesive and tactile brand experience.",
        ],
      },
      {
        type: "list",
        title: "My Contributions",
        items: [
          "Designed and handcrafted all jewelry pieces",
          "Branded and styled the SquareUp storefront",
          "Directed and produced product photography",
          "Created logo, packaging, and social graphics",
          "Wrote copy and managed customer communication",
        ],
      },
      {
        type: "text",
        title: "What This Project Represents",
        body: [
          "ModCotta reflects the intersection of creative direction, entrepreneurship, and digital execution.",
          "It gave me hands-on experience shaping a brand from the ground up while managing the customer-facing details that make an online storefront feel polished and consistent.",
        ],
      },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
