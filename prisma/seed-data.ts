/**
 * Shared portfolio content — single source of truth.
 *
 * Consumed by:
 *   - prisma/seed.ts                     (local SQLite seeding via Prisma)
 *   - scripts/generate-supabase-sql.ts   (db/supabase-setup.sql for production Postgres)
 *
 * Content grounded in the resume + owner-confirmed corrections (Sept 2026):
 *   - ONTIME24 (ot24.ae) is the LIVE production project — worked full-stack for
 *     one year, April 2025 to March 2026.
 *   - Quicky is an UNSHIPPED solo hobby project, in active development.
 *     Quicky Ludo and Spin the Bottle are FEATURES of Quicky, not separate projects.
 *   - Doctor Appointment Booking and Online Shoe Store are COLLEGE projects.
 *   - Skills include basic Flutter; languages include basic Hindi.
 */

export const json = (v: unknown) => JSON.stringify(v);

/* --------------------------------- types ---------------------------------- */

export interface TechSeed {
  id: string;
  name: string;
  category: string;
  description?: string;
  usedFor?: string[];
  sortOrder: number;
}

export interface ProjectSeed {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  category: string;
  year: string | null;
  featured: boolean;
  accentColor: string | null;
  roleNote: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  sortOrder: number;
  description: string | null;
  idea: string | null;
  problem: string | null;
  solution: string | null;
  howItWorks: string | null; // JSON [{title, detail}]
  features: string | null; // JSON [{title, detail}]
  challenges: string | null;
  whatIBuilt: string | null;
  result: string | null;
  architecture: string | null; // comma-separated diagram keys
  metrics: string | null; // JSON [{value, suffix, label}]
}

export interface ExperienceSeed {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  sortOrder: number;
  description: string | null;
  responsibilities: string | null; // JSON string[]
  highlights: string | null; // JSON [{value, suffix, label}]
}

export interface EducationSeed {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  startDate: string;
  endDate: string;
  cgpa: string | null;
  description: string | null;
  sortOrder: number;
}

export interface CertificationSeed {
  id: string;
  title: string;
  issuer: string;
  date: string | null;
  url: string | null;
  sortOrder: number;
}

/* ------------------------------- technologies ------------------------------ */

const tech = (
  name: string,
  category: string,
  sortOrder: number,
  description?: string,
  usedFor?: string[],
): TechSeed => ({
  id: `t_${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  name,
  category,
  sortOrder,
  description,
  usedFor,
});

export const technologies: TechSeed[] = [
  // Languages
  tech("Python", "Languages", 1, "My primary language — used across data science, machine learning, backend development and automation.", ["Data Science", "Machine Learning", "Backend Development", "Automation"]),
  tech("SQL", "Languages", 2, "Query design, joins, aggregations and schema modelling for analytics and application data.", ["Data Analysis", "Database Design", "Application Backends"]),
  tech("JavaScript", "Languages", 3, "The language of everything I ship to the browser — from interaction logic to realtime clients.", ["Frontend Development", "Interactive UI", "Realtime Clients"]),
  tech("PHP", "Languages", 4, "Server-side scripting for classic full-stack web applications.", ["Backend Development", "Web Applications"]),
  tech("TypeScript", "Languages", 5, "Type-safe JavaScript at scale — every serious frontend I build starts here.", ["Frontend Development", "Full Stack Applications"]),
  // Web
  tech("React", "Web", 6, "Component-driven interfaces — including full multi-page applications with realtime state.", ["Web Applications", "Interactive Experiences", "Mobile (via Capacitor)"]),
  tech("HTML", "Web", 7, "Semantic, accessible document structure.", ["Web Development"]),
  tech("CSS", "Web", 8, "Responsive, fluid layout systems with modern CSS — grid, flexbox, clamp and custom properties.", ["Responsive Design", "Design Systems"]),
  tech("Django", "Web", 9, "Python web framework used for full e-commerce backends with MySQL.", ["Backend Development", "E-commerce"]),
  tech("Tailwind CSS", "Web", 10, "Utility-first styling for rapidly shipping polished, consistent interfaces.", ["UI Design", "Design Systems"]),
  tech("Supabase", "Web", 11, "Postgres, auth and realtime channels — the backend engine of my multiplayer applications.", ["Realtime Systems", "Authentication", "Database"]),
  // Mobile
  tech("Capacitor", "Mobile", 12, "Wrapping web apps into native mobile experiences from a single codebase.", ["Mobile Apps", "Cross-platform"]),
  tech("Flutter", "Mobile", 33, "Basic working knowledge — cross-platform mobile apps from a single codebase. Currently strengthening it alongside my Capacitor experience.", ["Mobile Development", "Cross-platform Apps"]),
  // Data & ML
  tech("Pandas", "Data & ML", 13, "DataFrames for cleaning, transformation and analysis.", ["Data Wrangling", "Preprocessing"]),
  tech("NumPy", "Data & ML", 14, "Numerical computing foundation for every ML pipeline I build.", ["Numerical Computing", "Feature Engineering"]),
  tech("Scikit-learn", "Data & ML", 15, "Classical ML — Random Forest, SVM and KNN models trained and evaluated in production-style pipelines.", ["Model Training", "Evaluation"]),
  tech("TensorFlow", "Data & ML", 16, "Deep learning framework for neural network workflows.", ["Deep Learning"]),
  tech("Keras", "Data & ML", 17, "High-level neural network API on top of TensorFlow.", ["Deep Learning"]),
  // ML algorithms
  tech("Random Forest", "ML Algorithms", 18, "Ensemble method — my strongest performer across tabular classification problems.", ["Classification", "Regression"]),
  tech("SVM", "ML Algorithms", 19, "Support vector machines for high-dimensional classification.", ["Classification"]),
  tech("KNN", "ML Algorithms", 20, "Instance-based learning for pattern classification.", ["Classification"]),
  tech("Neural Networks", "ML Algorithms", 21, "Multi-layer networks for complex non-linear patterns.", ["Deep Learning"]),
  tech("CNN", "ML Algorithms", 22, "Convolutional networks — spatial feature extraction.", ["Computer Vision"]),
  tech("RNN", "ML Algorithms", 23, "Recurrent networks for sequential data.", ["Sequence Modeling"]),
  // Visualization
  tech("Power BI", "Visualization", 24, "Interactive business dashboards that improved decision-making efficiency by 20% during my internship.", ["Business Intelligence", "Dashboards"]),
  tech("Matplotlib", "Visualization", 25, "Programmatic plotting for exploration and reporting.", ["Data Storytelling"]),
  tech("Seaborn", "Visualization", 26, "Statistical visualisation built on matplotlib.", ["Statistical Graphics"]),
  // Tools
  tech("Git", "Tools", 27, "Version control for everything I ship.", ["Source Control", "Collaboration"]),
  tech("AWS", "Tools", 28, "Cloud fundamentals — deployment and managed services.", ["Cloud", "Deployment"]),
  tech("Jupyter", "Tools", 29, "Notebook-driven experimentation and analysis.", ["Exploration", "Prototyping"]),
  tech("Google Colab", "Tools", 30, "Cloud notebooks for GPU-backed ML experiments.", ["ML Experimentation"]),
  tech("WAMP", "Tools", 31, "Local PHP/MySQL development stack.", ["Local Development"]),
  tech("MySQL", "Tools", 32, "Relational database behind my PHP and Django applications — schema design, constraints and queries.", ["Database Design", "Application Backends"]),
];

/* ------------------------------ project → tech ----------------------------- */

export const projectTechMap: Record<string, string[]> = {
  ot24: ["HTML", "CSS", "JavaScript", "React"],
  quicky: ["React", "TypeScript", "Supabase", "Capacitor", "Tailwind CSS", "JavaScript"],
  "doctor-appointment": ["PHP", "MySQL", "JavaScript", "HTML", "CSS", "WAMP"],
  "online-shoe-store": ["Django", "Python", "MySQL", "HTML", "CSS"],
};

/* --------------------------------- projects -------------------------------- */

export const projects: ProjectSeed[] = [
  {
    id: "p_ot24",
    title: "ONTIME24",
    slug: "ot24",
    tagline: "Live production platform for a UAE business — ot24.ae",
    category: "Client · Live Production",
    year: "2025–2026",
    featured: true,
    accentColor: "#a3e635",
    roleNote: "Full-stack developer — one year, concept to live production",
    githubUrl: null,
    liveUrl: "https://ot24.ae",
    sortOrder: 1,
    description:
      "The flagship: a live, production platform serving a real UAE business at ot24.ae. Built and maintained full-stack for a full year — April 2025 to March 2026 — covering the complete chain: interface, business logic, data and deployment.",
    idea:
      "A UAE business needed a digital platform it could rely on — not a one-off brochure page, but a living system that represents the business online every single day. The goal was a fast, professional, mobile-first experience that earns customer trust from the first load and keeps earning it through a year of real-world use.",
    problem:
      "Production client work is a different discipline from personal projects. The platform has to work for real visitors on real devices — mostly phones, on varied networks, every day. Requirements evolve as the business learns. Load speed, mobile layout, search visibility and reliability aren't nice-to-haves; they are the product. And the client's reputation rides on all of it, continuously, for as long as the platform stays live.",
    solution:
      "Over twelve months I designed, built and maintained the platform end-to-end: information architecture, responsive mobile-first frontend, business logic, data handling and deployment — live at ot24.ae. The work ran in continuous cycles: ship, watch how real visitors actually use it, fix, improve, extend. That loop — repeated for a year — is what turns a website into a platform a business can operate on.",
    howItWorks: json([
      { title: "Understand the business", detail: "Started from what the business actually does and what its customers need to find or do — the platform is shaped around that, never around a template." },
      { title: "Architect the experience", detail: "Planned page structure, content hierarchy and mobile-first layouts before writing code — so every visitor path leads somewhere useful." },
      { title: "Build & ship", detail: "Implemented the full stack — responsive frontend, business logic and data — and deployed it live at ot24.ae." },
      { title: "Operate & iterate", detail: "A year of production maintenance: monitoring, fixes, performance tuning and feature updates as the business grew — the loop that keeps a live platform healthy." },
    ]),
    features: json([
      { title: "Live in production", detail: "Serving real visitors at ot24.ae — a public, verifiable deployment that a real business depends on every day." },
      { title: "Mobile-first & responsive", detail: "Built for the phone-majority audience of a UAE business, scaling cleanly up to tablets, desktops and ultrawides." },
      { title: "Performance-minded", detail: "Fast loads and lean assets — speed treated as a feature, because slow pages cost real customers." },
      { title: "Continuous iteration", detail: "Twelve months of updates, refinements and maintenance — the platform evolved with the business instead of aging past it." },
      { title: "End-to-end ownership", detail: "One developer responsible for the whole chain: design, code, data, deployment and live operations." },
    ]),
    challenges:
      "The long haul changes how you engineer. In month one you optimise for launch; by month twelve you're optimising for every change being safe on a live system — where a regression isn't a bug report, it's a customer seeing a broken page. Keeping quality consistent across a year of evolving requirements, communicating with a real client, and treating production with the respect it demands taught me more about professional software delivery than any course or personal project could.",
    whatIBuilt:
      "The complete platform as a solo full-stack developer: structure and design, the responsive frontend, the business logic and data layer, deployment, and a full year of production maintenance — live today at ot24.ae.",
    result:
      "A real business runs on software I built — publicly verifiable at ot24.ae. That's the strongest evidence I can offer: not a demo, not a portfolio piece, but a production system that survived a year of real customers, real feedback and real operations.",
    architecture: "client-delivery",
    metrics: json([
      { value: 12, suffix: " mo", label: "Live in production — Apr 2025 to Mar 2026" },
      { value: 24, suffix: "/7", label: "Platform availability at ot24.ae" },
      { value: 1, suffix: " yr", label: "Continuous development & maintenance" },
    ]),
  },
  {
    id: "p_quicky",
    title: "Quicky",
    slug: "quicky",
    tagline: "Gamified social platform — a solo hobby project, in active development",
    category: "Hobby Project · Realtime · Mobile",
    year: "2024 — ongoing",
    featured: false,
    accentColor: "#34d399",
    roleNote: "Solo hobby project — design, architecture, frontend, backend. Unshipped; in active development.",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 2,
    description:
      "Quicky is the project I build for the love of building it: a gamified social platform where connection happens inside realtime games — Spin the Bottle and Ludo — wrapped in chat, friends, gifts and a coin economy, running as one codebase across responsive web and native mobile via Capacitor. Not shipped yet — still in active development.",
    idea:
      "Most social apps follow the same tired loop: swipe a profile, match, type a message, hope for a reply. Quicky throws that loop away. The idea is simple — people bond through play, not through profiles. So Quicky is designed as a place where connection happens *inside* interactive experiences: you join a room, a game starts, and within two minutes you're laughing with strangers who are about to become friends.",
    problem:
      "Icebreaking is the hardest part of meeting people online. Text-first apps create pressure: every message feels like an interview question, and most conversations die within a few lines. Existing multiplayer social games are fragmented — separate apps, separate accounts, no persistent social graph. There was no single platform where games, chat, friends and a light economy (coins, gifts) lived together in one realtime experience that also worked on mobile.",
    solution:
      "I designed and built Quicky as a complete product: a React + TypeScript web application wrapped with Capacitor for mobile, powered by Supabase for Postgres data, authentication and realtime channels. The platform centers on room-based experiences — players are allocated into dynamic rooms where the two flagship games, Spin the Bottle and Quicky Ludo, run in realtime. Around the games sits a full social layer: chat, friend systems, gifts, coins, status, themes and an admin console for moderation and content management.",
    howItWorks: json([
      { title: "Join or get matched", detail: "Users authenticate and enter matchmaking — random room allocation places them into a live session with other players, no manual lobby wrangling required." },
      { title: "Spin the Bottle rounds", detail: "Twelve players seat around one table. A spin requests server-generated parameters (target, duration, rotations), every client replays the same animation, and the response system resolves mutual, partial or rejected outcomes live for the whole room." },
      { title: "Quicky Ludo matches", detail: "Four players share one authoritative board. Dice are generated and validated server-side, moves are checked against board rules before commit, and the turn manager handles timeouts and disconnects automatically." },
      { title: "Play in realtime", detail: "Every action — a bottle spin, a dice roll, a chat message — propagates to all players through Supabase realtime channels within milliseconds, replayed as identical deterministic animations on every screen." },
      { title: "Connect socially", detail: "Outcomes inside games (mutual matches, gifts, co-op wins) feed the social graph: friend requests, chat threads and status updates persist across sessions." },
      { title: "Progress & return", detail: "Coins, gifts and community features create a light progression loop that rewards coming back — managed and balanced from the admin console." },
    ]),
    features: json([
      { title: "Gamified connections", detail: "Matching happens through play — mutual and partial outcomes inside games become social connections." },
      { title: "Realtime multiplayer rooms", detail: "Dynamic room creation and random allocation with synchronised game state for every connected player." },
      { title: "Spin the Bottle — 12-player rooms", detail: "The signature game: twelve players around one table, physics-feel bottle spins rendered from server parameters, and a response state machine resolving mutual / partial / rejected outcomes in realtime." },
      { title: "Quicky Ludo — server-authoritative", detail: "Full multiplayer Ludo with automatic turn rotation, disconnect recovery and dice generated server-side — clients send intents, never outcomes, so the match can't be manipulated." },
      { title: "Chat & room chat", detail: "Realtime messaging inside rooms and in persistent friend threads." },
      { title: "Friend system", detail: "Requests, acceptance and friend lists that persist across games and sessions." },
      { title: "Coins & gifts economy", detail: "An in-app economy with a gift catalogue, balances and reward flows." },
      { title: "Status & themes", detail: "Player status and profile themes for self-expression." },
      { title: "Admin console", detail: "Moderation, content and economy management behind an authenticated admin panel." },
      { title: "Mobile + web", detail: "One codebase — responsive web experience wrapped as a native app with Capacitor." },
    ]),
    challenges:
      "The core engineering challenge was authoritative realtime state. With up to twelve players acting simultaneously inside a room, the system must decide whose action is truth, apply it exactly once, and reflect it on every screen — without desync, duplication or cheating. I solved this by making the database the referee: game mutations are validated server-side against the canonical room state, and clients never write final state, only intents. Coordinating twelve clients taught me why explicit state machines matter — early race conditions produced ghost states (a bottle spinning while a response was pending), and locking each game into server-validated states eliminated an entire class of bugs. The third challenge was Capacitor — keeping one codebase that feels native on phones while remaining a first-class web app, which meant disciplined responsive design and careful handling of touch targets, safe areas and viewport behaviour.",
    whatIBuilt:
      "The entire platform, solo, as a hobby project: information architecture, interaction design, the React + TypeScript frontend, the Supabase data model (auth, database, realtime), both game engines — Spin the Bottle's response state machine and Ludo's authoritative rules engine — the social and economy layers, the admin console, and the Capacitor mobile build.",
    result:
      "Quicky isn't shipped — and I'm honest about that. It's the project I keep reaching for between client work: the place where I engineer the hardest problems I can find — authoritative realtime state, cheat-resistant game servers, one codebase on every screen — with zero shortcuts and no one else to defer to.",
    architecture: "quicky-system,bottle-realtime,ludo-multiplayer",
    metrics: json([
      { value: 12, suffix: "", label: "Players per realtime room" },
      { value: 2, suffix: "", label: "Multiplayer games engineered" },
      { value: 1, suffix: "", label: "Codebase — web + mobile" },
      { value: 100, suffix: "%", label: "Server-authoritative game state" },
    ]),
  },
  {
    id: "p_doctor_appointment",
    title: "Doctor Appointment Booking",
    slug: "doctor-appointment",
    tagline: "Online appointment management — built in college",
    category: "College Project · Full Stack",
    year: "2023",
    featured: false,
    accentColor: "#f87171",
    roleNote: "College project — built during my BCA; frontend, PHP backend, MySQL schema",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 3,
    description:
      "A college-built full-stack web application for managing doctor appointments — patients book online, doctors manage schedules, and PHP + MySQL keeps every record consistent. My first serious lesson in database integrity.",
    idea:
      "Clinics lose time to phone-call booking: missed calls, double-booked slots, paper registers. As a college project I took on this boring-but-valuable problem to learn what 'full-stack' actually means — a clean online booking interface backed by a database you can trust.",
    problem:
      "Appointment management is a data-integrity problem. Two patients must never hold the same slot; a cancelled visit must free the slot immediately; doctor schedules, patient details and booking history must stay consistent — with validation on both the client and the server.",
    solution:
      "I built the system with vanilla JavaScript on the frontend for booking flow and validation, PHP for server-side logic and MySQL as the source of truth. The schema separates doctors, patients, slots and appointments so integrity is enforced by the database — unique constraints make double-booking impossible — and the interface lets patients browse doctor information, pick a free slot and confirm in a few clicks.",
    howItWorks: json([
      { title: "Browse doctors", detail: "Patients view doctor profiles, specialisations and availability." },
      { title: "Pick a slot", detail: "The interface shows free time slots — taken slots are locked at the database level." },
      { title: "Confirm booking", detail: "Details are validated client- and server-side before the appointment is written." },
      { title: "Manage", detail: "Appointments can be viewed and cancelled — freeing the slot instantly for the next patient." },
    ]),
    features: json([
      { title: "Appointment booking", detail: "Patient-facing flow for browsing and confirming time slots." },
      { title: "Doctor information", detail: "Profiles, specialisation and availability surfaced to patients." },
      { title: "Patient interaction", detail: "Booking history and cancellation with immediate slot release." },
      { title: "MySQL database", detail: "Normalised schema with constraints that make invalid states unrepresentable." },
      { title: "Dual validation", detail: "Client-side UX checks plus server-side enforcement in PHP." },
    ]),
    challenges:
      "Building this taught me where validation really lives. Every rule I trusted the browser to enforce, I had to re-implement in PHP — because anything arriving at the server is hostile until proven otherwise. Designing the schema so a double-booking is *impossible* (rather than detecting it after the fact) was the lesson that shaped how I think about backends.",
    whatIBuilt:
      "The complete application as a college project: HTML/CSS/JS frontend, PHP backend logic and the MySQL database design.",
    result:
      "A dependable full-stack CRUD application with real integrity constraints — the foundation of my database-first thinking, and the reason schema design still comes first in everything I build.",
    architecture: "booking-flow",
    metrics: json([{ value: 3, suffix: "", label: "Connected entities — doctors, patients, slots" }]),
  },
  {
    id: "p_online_shoe_store",
    title: "Online Shoe Store",
    slug: "online-shoe-store",
    tagline: "E-commerce with inventory management — built in college",
    category: "College Project · E-commerce",
    year: "2023",
    featured: false,
    accentColor: "#fb923c",
    roleNote: "College project — built during my BCA; Django backend, storefront, database design",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 4,
    description:
      "A college-built Django e-commerce system for footwear — catalogue, cart, checkout and order management supporting 50+ daily transactions across 50+ products in inventory.",
    idea:
      "E-commerce is the most honest test of full-stack ability: catalogue, cart, orders, inventory and money all have to work together. A shoe store was the perfect college scope — familiar products, real complexity.",
    problem:
      "A store has to keep two promises at once: shoppers get a fast, clear path from product to paid order, and the business gets accurate inventory. Stock must decrement exactly once per order; the catalogue must stay consistent as products and variants multiply; the order flow must survive abandoned carts and repeated clicks without duplicating records.",
    solution:
      "I built the store on Django with Python — leveraging its ORM for a clean data model of products, variants, cart items and orders — with MySQL behind it. The storefront (HTML/CSS with Django templates) walks customers through product browsing, cart and checkout, while the backend enforces transactional order creation: inventory decrements atomically with order submission, so stock can never drift out of sync with sales.",
    howItWorks: json([
      { title: "Browse the catalogue", detail: "Customers explore 50+ products with variants, details and imagery." },
      { title: "Add to cart", detail: "Cart state persisted per session — edit quantities freely before committing." },
      { title: "Checkout", detail: "Order submission wraps inventory checks and order creation in one transaction." },
      { title: "Order & inventory", detail: "Stock decrements atomically; order records land in MySQL for management." },
    ]),
    features: json([
      { title: "Product catalogue", detail: "50+ products with variants and structured details." },
      { title: "Cart & checkout", detail: "Session cart with a clear path to completed order." },
      { title: "Inventory management", detail: "Stock levels enforced transactionally — no overselling." },
      { title: "50+ daily transactions", detail: "Order flow built and demonstrated to handle real transaction volume." },
      { title: "Django admin", detail: "Management interface for products, stock and orders out of the box." },
    ]),
    challenges:
      "The subtle bug class in e-commerce is *duplication* — a double-clicked checkout, a retried request, a stale cart page. Learning to make destructive operations idempotent, and to let the database transaction boundary define 'an order happened exactly once', was the real education of this project.",
    whatIBuilt:
      "The storefront, the Django application logic, the MySQL schema and the order/inventory pipeline end-to-end — as a college project during my BCA.",
    result:
      "A working e-commerce system demonstrated at 50+ daily transactions with 50+ managed products — proof, built in college, that I could deliver transactional business systems rather than just pages.",
    architecture: "commerce-flow",
    metrics: json([
      { value: 50, suffix: "+", label: "Daily transactions supported" },
      { value: 50, suffix: "+", label: "Products in managed inventory" },
    ]),
  },
];

/* -------------------------------- experience ------------------------------- */

export const experience: ExperienceSeed[] = [
  {
    id: "e_ontime24",
    company: "ONTIME24",
    role: "Full Stack Developer",
    location: "Remote · UAE",
    startDate: "Apr 2025",
    endDate: "Mar 2026",
    current: false,
    sortOrder: 1,
    description:
      "One year of continuous full-stack development on ONTIME24 — the live platform at ot24.ae serving a real UAE business. Built, deployed and maintained the production system end-to-end, iterating with the client as the business grew.",
    responsibilities: json([
      "Full-stack web development",
      "Production deployment & live operations",
      "Responsive, mobile-first frontend engineering",
      "Continuous maintenance & feature iteration",
    ]),
    highlights: json([{ value: 12, suffix: " mo", label: "Live in production at ot24.ae" }]),
  },
  {
    id: "e_luminar",
    company: "Luminar Technolab",
    role: "Data Science Intern",
    location: "Kochi, Ernakulam",
    startDate: "May 2024",
    endDate: "Present",
    current: true,
    sortOrder: 2,
    description:
      "Hands-on data science internship at one of Kerala's leading technology training and solution providers — working on real ML pipelines and business intelligence deliverables.",
    responsibilities: json([
      "Machine learning model development",
      "Automated data preprocessing",
      "Data analysis",
      "Power BI dashboard development",
      "Web application optimisation",
    ]),
    highlights: json([
      { value: 30, suffix: "%", label: "Prediction accuracy improvement" },
      { value: 15, suffix: "%", label: "Reduction in data cleaning time" },
      { value: 20, suffix: "%", label: "Improvement in decision-making efficiency" },
    ]),
  },
];

/* --------------------------------- education ------------------------------- */

export const education: EducationSeed[] = [
  {
    id: "edu_bca",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Mar Augusthinose College",
    location: "Ramapuram, Kerala",
    startDate: "Jun 2021",
    endDate: "Mar 2024",
    cgpa: "7.46 / 10",
    description:
      "Three-year undergraduate degree covering programming fundamentals, data structures, databases, web development and application design — the formal foundation beneath everything on this site.",
    sortOrder: 1,
  },
];

/* ------------------------------- certifications ---------------------------- */

export const certifications: CertificationSeed[] = [
  { id: "cert_ds", title: "Data Science Foundations", issuer: "Great Learning", date: null, url: null, sortOrder: 1 },
  { id: "cert_powerbi", title: "Data Visualisation With Power BI", issuer: "Great Learning", date: null, url: null, sortOrder: 2 },
];

/* --------------------------------- settings -------------------------------- */

export const settings: Array<[string, string]> = [
  ["contact.email", "jyothilalreji@gmail.com"],
  ["contact.github", "https://github.com/jyothilalreji"],
  ["contact.linkedin", "https://www.linkedin.com/in/jyothilal-reji"],
  ["contact.location", "Kerala, India · Working with clients worldwide"],
  ["languages", json([{ name: "English", level: "Fluent" }, { name: "Malayalam", level: "Native" }, { name: "Hindi", level: "Basic" }])],
];
