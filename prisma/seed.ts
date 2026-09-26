/**
 * Seed script — Jyothilal Reji Digital Portfolio
 * All content grounded in the PRD + resume facts.
 * Run: bun prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const json = (v: unknown) => JSON.stringify(v);

/* ---------------------------------- data ---------------------------------- */

const technologies: Array<{
  name: string;
  category: string;
  description?: string;
  usedFor?: string[];
  sortOrder: number;
}> = [
  // Languages
  { name: "Python", category: "Languages", sortOrder: 1, description: "My primary language — used across data science, machine learning, backend development and automation.", usedFor: ["Data Science", "Machine Learning", "Backend Development", "Automation"] },
  { name: "SQL", category: "Languages", sortOrder: 2, description: "Query design, joins, aggregations and schema modelling for analytics and application data.", usedFor: ["Data Analysis", "Database Design", "Application Backends"] },
  { name: "JavaScript", category: "Languages", sortOrder: 3, description: "The language of everything I ship to the browser — from interaction logic to realtime clients.", usedFor: ["Frontend Development", "Interactive UI", "Realtime Clients"] },
  { name: "PHP", category: "Languages", sortOrder: 4, description: "Server-side scripting for classic full-stack web applications.", usedFor: ["Backend Development", "Web Applications"] },
  { name: "TypeScript", category: "Languages", sortOrder: 5, description: "Type-safe JavaScript at scale — every serious frontend I build starts here.", usedFor: ["Frontend Development", "Full Stack Applications"] },
  // Web
  { name: "React", category: "Web", sortOrder: 6, description: "Component-driven interfaces — including full multi-page applications with realtime state.", usedFor: ["Web Applications", "Interactive Experiences", "Mobile (via Capacitor)"] },
  { name: "HTML", category: "Web", sortOrder: 7, description: "Semantic, accessible document structure.", usedFor: ["Web Development"] },
  { name: "CSS", category: "Web", sortOrder: 8, description: "Responsive, fluid layout systems with modern CSS — grid, flexbox, clamp and custom properties.", usedFor: ["Responsive Design", "Design Systems"] },
  { name: "Django", category: "Web", sortOrder: 9, description: "Python web framework used for full e-commerce backends with MySQL.", usedFor: ["Backend Development", "E-commerce"] },
  { name: "Tailwind CSS", category: "Web", sortOrder: 10, description: "Utility-first styling for rapidly shipping polished, consistent interfaces.", usedFor: ["UI Design", "Design Systems"] },
  { name: "Supabase", category: "Web", sortOrder: 11, description: "Postgres, auth and realtime channels — the backend engine of my multiplayer applications.", usedFor: ["Realtime Systems", "Authentication", "Database"] },
  { name: "Capacitor", category: "Web", sortOrder: 12, description: "Wrapping web apps into native mobile experiences from a single codebase.", usedFor: ["Mobile Apps", "Cross-platform"] },
  // Data & ML
  { name: "Pandas", category: "Data & ML", sortOrder: 13, description: "DataFrames for cleaning, transformation and analysis.", usedFor: ["Data Wrangling", "Preprocessing"] },
  { name: "NumPy", category: "Data & ML", sortOrder: 14, description: "Numerical computing foundation for every ML pipeline I build.", usedFor: ["Numerical Computing", "Feature Engineering"] },
  { name: "Scikit-learn", category: "Data & ML", sortOrder: 15, description: "Classical ML — Random Forest, SVM and KNN models trained and evaluated in production-style pipelines.", usedFor: ["Model Training", "Evaluation"] },
  { name: "TensorFlow", category: "Data & ML", sortOrder: 16, description: "Deep learning framework for neural network workflows.", usedFor: ["Deep Learning"] },
  { name: "Keras", category: "Data & ML", sortOrder: 17, description: "High-level neural network API on top of TensorFlow.", usedFor: ["Deep Learning"] },
  // ML algorithms
  { name: "Random Forest", category: "ML Algorithms", sortOrder: 18, description: "Ensemble method — my strongest performer on the wind quality dataset.", usedFor: ["Classification", "Regression"] },
  { name: "SVM", category: "ML Algorithms", sortOrder: 19, description: "Support vector machines for high-dimensional classification.", usedFor: ["Classification"] },
  { name: "KNN", category: "ML Algorithms", sortOrder: 20, description: "Instance-based learning for pattern classification.", usedFor: ["Classification"] },
  { name: "Neural Networks", category: "ML Algorithms", sortOrder: 21, description: "Multi-layer networks for complex non-linear patterns.", usedFor: ["Deep Learning"] },
  { name: "CNN", category: "ML Algorithms", sortOrder: 22, description: "Convolutional networks — spatial feature extraction.", usedFor: ["Computer Vision"] },
  { name: "RNN", category: "ML Algorithms", sortOrder: 23, description: "Recurrent networks for sequential data.", usedFor: ["Sequence Modeling"] },
  // Visualization
  { name: "Power BI", category: "Visualization", sortOrder: 24, description: "Interactive business dashboards that improved decision-making efficiency by 20% during my internship.", usedFor: ["Business Intelligence", "Dashboards"] },
  { name: "Matplotlib", category: "Visualization", sortOrder: 25, description: "Programmatic plotting for exploration and reporting.", usedFor: ["Data Storytelling"] },
  { name: "Seaborn", category: "Visualization", sortOrder: 26, description: "Statistical visualisation built on matplotlib.", usedFor: ["Statistical Graphics"] },
  // Tools
  { name: "Git", category: "Tools", sortOrder: 27, description: "Version control for everything I ship.", usedFor: ["Source Control", "Collaboration"] },
  { name: "AWS", category: "Tools", sortOrder: 28, description: "Cloud fundamentals — deployment and managed services.", usedFor: ["Cloud", "Deployment"] },
  { name: "Jupyter", category: "Tools", sortOrder: 29, description: "Notebook-driven experimentation and analysis.", usedFor: ["Exploration", "Prototyping"] },
  { name: "Google Colab", category: "Tools", sortOrder: 30, description: "Cloud notebooks for GPU-backed ML experiments.", usedFor: ["ML Experimentation"] },
  { name: "WAMP", category: "Tools", sortOrder: 31, description: "Local PHP/MySQL development stack.", usedFor: ["Local Development"] },
  { name: "MySQL", category: "Tools", sortOrder: 32, description: "Relational database behind my PHP and Django applications — schema design, constraints and queries.", usedFor: ["Database Design", "Application Backends"] },
];

const projectTechMap: Record<string, string[]> = {
  quicky: ["React", "TypeScript", "Supabase", "Capacitor", "Tailwind CSS", "JavaScript"],
  "quicky-ludo": ["React", "TypeScript", "Supabase", "Capacitor"],
  "spin-the-bottle": ["React", "TypeScript", "Supabase", "Capacitor"],
  ot24: ["HTML", "CSS", "JavaScript", "React"],
  "wind-quality-prediction": ["Python", "Scikit-learn", "Pandas", "NumPy", "Random Forest", "SVM", "Matplotlib", "Seaborn", "Jupyter"],
  "doctor-appointment": ["PHP", "MySQL", "JavaScript", "HTML", "CSS", "WAMP"],
  "online-shoe-store": ["Django", "Python", "MySQL", "HTML", "CSS"],
};

const projects = [
  {
    title: "Quicky",
    slug: "quicky",
    tagline: "Gamified social connection platform",
    category: "Full Stack · Mobile",
    year: "2024–2025",
    featured: true,
    accentColor: "#34d399",
    roleNote: "Solo developer — concept, design, architecture, frontend, backend, deployment",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 1,
    description:
      "Quicky is a gamified social connection platform built around interactive experiences instead of conventional swiping. Users meet inside realtime rooms, play games together — Spin the Bottle, Ludo — chat, send gifts, earn coins and grow a community, across responsive web and native mobile via Capacitor.",
    idea:
      "Most social apps follow the same tired loop: swipe a profile, match, type a message, hope for a reply. Quicky throws that loop away. The idea is simple — people bond through play, not through profiles. So Quicky is designed as a place where connection happens *inside* interactive experiences: you join a room, a game starts, and within two minutes you're laughing with strangers who are about to become friends.",
    problem:
      "Icebreaking is the hardest part of meeting people online. Text-first apps create pressure: every message feels like an interview question, and most conversations die within a few lines. Existing multiplayer social games are fragmented — separate apps, separate accounts, no persistent social graph. There was no single platform where games, chat, friends and a light economy (coins, gifts) lived together in one realtime experience that also worked on mobile.",
    solution:
      "I designed and built Quicky as a complete product: a React + TypeScript web application wrapped with Capacitor for mobile, powered by Supabase for Postgres data, authentication and realtime channels. The platform centers on room-based experiences — players are allocated into dynamic rooms where games like Spin the Bottle and Ludo run in realtime. Around the games sits a full social layer: chat, friend systems, gifts, coins, status, themes and an admin console for moderation and content management.",
    howItWorks: json([
      { title: "Join or get matched", detail: "Users authenticate and enter matchmaking — random room allocation places them into a live session with other players, no manual lobby wrangling required." },
      { title: "Play in realtime", detail: "Rooms host synchronised games. Every action — a bottle spin, a dice roll, a chat message — propagates to all players through Supabase realtime channels within milliseconds." },
      { title: "Connect socially", detail: "Outcomes inside games (mutual matches, gifts, co-op wins) feed the social graph: friend requests, chat threads and status updates persist across sessions." },
      { title: "Progress & return", detail: "Coins, gifts and community features create a light progression loop that rewards coming back — managed and balanced from the admin console." },
    ]),
    features: json([
      { title: "Gamified connections", detail: "Matching happens through play — mutual and partial outcomes inside games become social connections." },
      { title: "Realtime multiplayer rooms", detail: "Dynamic room creation and random allocation with synchronised game state for every connected player." },
      { title: "Spin the Bottle", detail: "12-player rooms with animated bottle spins, target selection and a response system for mutual / partial / rejected outcomes." },
      { title: "Quicky Ludo", detail: "Full multiplayer Ludo with turn management, server-authoritative dice and animated piece movement." },
      { title: "Chat & room chat", detail: "Realtime messaging inside rooms and in persistent friend threads." },
      { title: "Friend system", detail: "Requests, acceptance and friend lists that persist across games and sessions." },
      { title: "Coins & gifts economy", detail: "An in-app economy with a gift catalogue, balances and reward flows." },
      { title: "Status & themes", detail: "Player status and profile themes for self-expression." },
      { title: "Admin console", detail: "Moderation, content and economy management behind an authenticated admin panel." },
      { title: "Mobile + web", detail: "One codebase — responsive web experience wrapped as a native app with Capacitor." },
    ]),
    challenges:
      "The core engineering challenge was authoritative realtime state. With up to 12 players acting simultaneously inside a room, the system must decide whose action is truth, apply it exactly once, and reflect it on every screen — without desync, duplication or cheating. I solved this by making the database the referee: game mutations are validated server-side against the canonical room state, and clients never write final state directly, only actions. The second challenge was Capacitor — keeping one codebase that feels native on phones while remaining a first-class web app, which meant disciplined responsive design and careful handling of touch targets, safe areas and viewport behaviour.",
    whatIBuilt:
      "The entire platform, solo: information architecture, interaction design, the React + TypeScript frontend, the Supabase data model (auth, database, realtime), the game engines for Spin the Bottle and Ludo, the social and economy layers, the admin console, and the Capacitor mobile build.",
    result:
      "Quicky proves the thesis this portfolio stands on: I can take an idea and ship it as a complete, production-shaped product — realtime backend, game logic, social systems, economy, admin tooling and mobile delivery — not just a landing page.",
    architecture: "quicky-system",
    metrics: json([
      { value: 12, suffix: "", label: "Players per realtime room" },
      { value: 2, suffix: "", label: "Built-in multiplayer games" },
      { value: 1, suffix: "", label: "Codebase — web + mobile" },
    ]),
  },
  {
    title: "Quicky Ludo",
    slug: "quicky-ludo",
    tagline: "Realtime multiplayer Ludo",
    category: "Game · Realtime",
    year: "2024",
    featured: false,
    accentColor: "#fbbf24",
    roleNote: "Game engine, sync protocol, UI & animation",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 2,
    description:
      "A full multiplayer Ludo implementation inside Quicky — four players, one authoritative game state, synchronised across devices in realtime, playable on web and mobile.",
    idea:
      "Ludo is the game every Indian household knows — but playing it online with friends means either clunky legacy apps or nothing at all. I wanted the classic board to run inside Quicky as a native-feeling realtime experience: join a table, roll the dice, watch every piece move live on everyone's screen.",
    problem:
      "Multiplayer board games are a distributed-systems problem wearing a game's skin. Four clients must agree on one board. The dice must be fair and impossible to manipulate. Turns must pass correctly even when a player disconnects. Piece movement must animate identically on a budget Android phone and a desktop browser. Naive implementations trust the client — which means one modified request can ruin the match for everyone.",
    solution:
      "I built the game with a server-authoritative model: every dice roll is generated and validated server-side against the canonical game state stored in the database. Clients send *intents* (roll, pick piece), never outcomes. The turn manager advances automatically, handles timeouts and skips disconnected players. State changes broadcast over realtime channels, and every client renders deterministic animations from the same state transitions — so all four screens stay in lockstep.",
    howItWorks: json([
      { title: "Join the table", detail: "Up to four players are seated at a game table; the room prepares a fresh authoritative game state." },
      { title: "Roll the dice", detail: "A roll request is validated server-side — the dice value is generated there and broadcast to every player, then animated locally." },
      { title: "Move a piece", detail: "The player picks a piece; the server validates the move against board rules and commits the new state." },
      { title: "Synchronise", detail: "Every committed transition is broadcast through realtime channels — each device replays the same animation from the same state." },
    ]),
    features: json([
      { title: "Server-authoritative dice", detail: "Rolls are generated and validated server-side — clients can't manipulate outcomes." },
      { title: "Turn management", detail: "Automatic turn rotation with timeout handling and disconnect recovery." },
      { title: "Multiplayer synchronisation", detail: "One canonical game state, broadcast to all devices in realtime." },
      { title: "Dice & piece animation", detail: "Deterministic animations replayed identically from shared state transitions." },
      { title: "Cross-device gameplay", detail: "Same match, same board — on desktop browsers and Capacitor mobile builds." },
      { title: "Web + mobile", detail: "Playable anywhere Quicky runs." },
    ]),
    challenges:
      "The hardest part was correctness under chaos: a player closing their app mid-turn, two intents arriving in the same tick, a roll landing exactly when the state changed. I handled it by serialising every mutation through the server with version-checked writes — if the state moved on, the action is rejected and the client re-syncs rather than corrupting the match.",
    whatIBuilt:
      "The complete Ludo engine: board model and rules, server-authoritative dice and move validation, turn manager, realtime sync layer, and the animated board UI — including a playable board concept that fits in this portfolio.",
    result:
      "A genuinely cheat-resistant multiplayer board game that runs identically across web and mobile — and a concrete demonstration of my realtime systems thinking.",
    architecture: "ludo-multiplayer",
    metrics: json([
      { value: 4, suffix: "", label: "Players per match" },
      { value: 100, suffix: "%", label: "Server-authoritative rolls" },
    ]),
  },
  {
    title: "Spin The Bottle",
    slug: "spin-the-bottle",
    tagline: "12-player realtime social game",
    category: "Game · Realtime",
    year: "2024",
    featured: false,
    accentColor: "#f472b6",
    roleNote: "Realtime engine, room system, game UX",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 3,
    description:
      "The signature Quicky experience: twelve players, one spinning bottle, real reactions. A realtime social game engine with random room allocation, response systems and live outcomes.",
    idea:
      "Spin the Bottle is the original icebreaker. Digitising it means recreating not just the bottle, but the *room* — the nervous laughter when the bottle slows, the choice to answer or deflect, the moment two people match. That social physics is the product.",
    problem:
      "Twelve simultaneous players means twelve sources of truth. The bottle must spin with believable physics and land on a verifiable target. The asked player must be able to respond — and every other player must see that response land in realtime, consistently, on every device. On top of that, rooms need to assemble themselves (random allocation), stay alive when players drop, and stay engaging with chat, gifts and points running in parallel.",
    solution:
      "I modelled the game as an explicit state machine — SPINNING → TARGET_SELECTED → AWAITING_RESPONSE → RESOLVED — with every transition validated server-side and broadcast to the room. The bottle animation itself is client-side theatre derived from a server-generated result (target + duration + rotations), so it looks physical but can't be manipulated. The response system resolves outcomes as mutual, partial or rejected, and the room chat, gift and points layers run on parallel realtime channels without ever blocking the game loop.",
    howItWorks: json([
      { title: "Room assembly", detail: "Players enter matchmaking and are randomly allocated into 12-player rooms with a live, shared game state." },
      { title: "Positioning", detail: "Each player is seated around a responsive game table — their avatar placed on the circle on every screen." },
      { title: "The spin", detail: "A player spins; the server generates the target and spin parameters, and every client replays the same bottle animation." },
      { title: "Response", detail: "The targeted player responds — mutual, partial or rejected — and the outcome resolves live for the whole room." },
      { title: "Layered interaction", detail: "Room chat, gifts and points run alongside the game without interrupting it." },
    ]),
    features: json([
      { title: "12-player rooms", detail: "A full dozen players synchronised in one live session." },
      { title: "Random room allocation", detail: "Automatic matchmaking — no manual lobby coordination." },
      { title: "Bottle animation", detail: "Physics-feel spin rendered identically on every device from server parameters." },
      { title: "Response system", detail: "Mutual / partial / rejected outcomes with realtime resolution." },
      { title: "Realtime updates", detail: "Every state change lands on all screens in milliseconds." },
      { title: "Room chat & gifts", detail: "Conversation and gifting layered into the game loop." },
      { title: "Points", detail: "A scoring layer that rewards participation and wins." },
      { title: "Responsive game table", detail: "The circle scales beautifully from ultrawide to small phones." },
      { title: "Mobile ready", detail: "Full compatibility through the Capacitor build." },
    ]),
    challenges:
      "Coordinating twelve clients taught me why state machines matter. Early on, race conditions produced ghost states — a bottle spinning while a response was pending, two targets selected in one round. Locking the game into explicit, server-validated states eliminated an entire class of bugs and made the codebase easy to extend with new game types.",
    whatIBuilt:
      "The complete game engine: room system, seating model, spin protocol, response state machine, realtime fan-out, and the animated table UI — plus the chat, gift and points layers running around it.",
    result:
      "The most-played experience inside Quicky — and the clearest proof on this site that I build realtime systems, not just interfaces.",
    architecture: "bottle-realtime",
    metrics: json([
      { value: 12, suffix: "", label: "Players per room" },
      { value: 3, suffix: "", label: "Response outcomes" },
      { value: 1, suffix: "", label: "Authoritative game state" },
    ]),
  },
  {
    title: "OT24.AE",
    slug: "ot24",
    tagline: "Business website & digital experience",
    category: "Client · Web",
    year: "2025",
    featured: false,
    accentColor: "#a3e635",
    roleNote: "Design & full development — delivered for a UAE business",
    githubUrl: null,
    liveUrl: "https://ot24.ae",
    sortOrder: 4,
    description:
      "A live, business-facing website delivered for a UAE client — a complete digital presence designed and built end-to-end, from concept and content structure to responsive build and launch.",
    idea:
      "A UAE business needed more than a brochure online — it needed a digital experience that looks as professional as the service behind it. The goal: a fast, modern, mobile-first site that builds trust the moment it loads.",
    problem:
      "Small and mid-size businesses lose customers to bad first impressions online: outdated layouts, broken mobile views, slow loads. The client needed a presence that performs on every device their customers use — primarily phones — while remaining easy to keep current.",
    solution:
      "I delivered the complete website: information architecture, content structure, visual design, responsive implementation and launch. The build is mobile-first with fluid typography and layout, fast-loading assets, and interaction details — transitions, hover states, scroll reveals — that make a small business feel established.",
    howItWorks: json([
      { title: "Discover", detail: "Understood the business, its audience and what visitors need to do on the site." },
      { title: "Structure", detail: "Designed the page architecture and content hierarchy around conversion, not decoration." },
      { title: "Build", detail: "Responsive, mobile-first implementation with performance budgets from day one." },
      { title: "Launch", detail: "Deployed live and verified across devices, viewports and connection speeds." },
    ]),
    features: json([
      { title: "Responsive by default", detail: "Mobile-first layouts that scale cleanly from phones to desktops." },
      { title: "Performance-minded", detail: "Optimised assets and lean loading for fast first impressions." },
      { title: "Professional polish", detail: "Motion and interaction details tuned to feel established, not decorated." },
      { title: "Business-ready", detail: "Content structured so the client can keep it current." },
    ]),
    challenges:
      "Client work is a different discipline from personal projects: requirements are real, deadlines are real, and the definition of done is 'the client is satisfied'. Managing scope, communicating progress and shipping something a business can rely on taught me more about professionalism than any course could.",
    whatIBuilt:
      "The complete site — structure, design, code, deployment — as an independent delivery for a real business client.",
    result:
      "A live business website serving real visitors — concrete evidence that I can deliver production work for paying clients, remotely and end-to-end.",
    architecture: "client-delivery",
    metrics: json([{ value: 1, suffix: "", label: "Live client website" }]),
  },
  {
    title: "Wind Quality Prediction",
    slug: "wind-quality-prediction",
    tagline: "ML-based wind quality forecasting",
    category: "Machine Learning",
    year: "2024",
    featured: false,
    accentColor: "#22d3ee",
    roleNote: "Data pipeline, feature engineering, model training & evaluation",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 5,
    description:
      "A machine-learning system that predicts wind quality from meteorological data — built with Random Forest and SVM, achieving 85%+ accuracy and a 15% reduction in prediction error.",
    idea:
      "Wind conditions matter — for energy planning, for air quality analysis, for operations that depend on the atmosphere behaving predictably. The question: can historical meteorological data predict wind quality classes well enough to be useful?",
    problem:
      "Raw weather data is noisy, incomplete and full of interdependent variables. Hand-written rules collapse quickly. The task required a full supervised-learning pipeline: clean the data, engineer signal from the noise, train competing models, and prove — with honest evaluation — which one generalises.",
    solution:
      "I built an end-to-end pipeline in Python: loading and validating the dataset, automated preprocessing (missing values, outliers, encoding), feature engineering on meteorological variables, then training and comparing Random Forest and SVM classifiers with proper train/test discipline. Random Forest won on accuracy; careful hyperparameter work pushed prediction error down by 15% against the baseline.",
    howItWorks: json([
      { title: "Problem framing", detail: "Wind quality framed as a supervised classification task over meteorological features." },
      { title: "Dataset & preprocessing", detail: "Automated cleaning — missing values, outliers, scaling and encoding." },
      { title: "Feature engineering", detail: "Derived signal from raw weather variables to give models something to learn from." },
      { title: "Model training", detail: "Random Forest and SVM trained and tuned with cross-validation." },
      { title: "Evaluation", detail: "Accuracy, confusion analysis and error metrics compared against baseline." },
      { title: "Prediction", detail: "The final model classifies wind quality from unseen meteorological input." },
    ]),
    features: json([
      { title: "Random Forest classifier", detail: "The winning ensemble model — robust to noisy features and easy to interpret." },
      { title: "SVM baseline + comparison", detail: "Support vector machines trained side-by-side for honest model selection." },
      { title: "Automated preprocessing", detail: "Reproducible cleaning pipeline — no manual spreadsheet surgery." },
      { title: "85%+ accuracy", detail: "Verified on held-out test data, not training-set wishful thinking." },
      { title: "15% error reduction", detail: "Prediction error cut versus the initial baseline through tuning." },
    ]),
    challenges:
      "The gap between a notebook experiment and a trustworthy model is evaluation discipline. The temptation to tune against the test set is real; resisting it meant building the comparison harness first, then letting the models compete fairly. Feature engineering mattered more than model choice — the biggest accuracy jump came from better inputs, not fancier algorithms.",
    whatIBuilt:
      "The complete pipeline — data preparation, feature engineering, model training, evaluation harness and prediction interface — as an individual project.",
    result:
      "A validated classifier achieving 85%+ accuracy with a 15% error reduction — the foundation of my applied ML experience, later sharpened by internship work at Luminar Technolab.",
    architecture: "ml-pipeline",
    metrics: json([
      { value: 85, suffix: "%+", label: "Classification accuracy" },
      { value: 15, suffix: "%", label: "Reduction in prediction error" },
    ]),
  },
  {
    title: "Doctor Appointment Booking",
    slug: "doctor-appointment",
    tagline: "Online appointment management system",
    category: "Web Development",
    year: "2023",
    featured: false,
    accentColor: "#f87171",
    roleNote: "Full-stack build — frontend, PHP backend, MySQL schema",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 6,
    description:
      "A classic full-stack web application for managing doctor appointments — patients book online, doctors manage schedules, and PHP + MySQL keeps every record consistent.",
    idea:
      "Clinics lose time to phone-call booking: missed calls, double-booked slots, paper registers. The answer is boring and valuable — a clean online booking interface backed by a reliable database.",
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
      "The complete application: HTML/CSS/JS frontend, PHP backend logic and the MySQL database design.",
    result:
      "A dependable full-stack CRUD application with real integrity constraints — my foundation in classic web development, and the reason database design still comes first in everything I build.",
    architecture: "booking-flow",
    metrics: json([{ value: 3, suffix: "", label: "Connected entities — doctors, patients, slots" }]),
  },
  {
    title: "Online Shoe Store",
    slug: "online-shoe-store",
    tagline: "E-commerce with inventory management",
    category: "E-commerce",
    year: "2023",
    featured: false,
    accentColor: "#fb923c",
    roleNote: "Django backend, storefront UI, database design",
    githubUrl: null,
    liveUrl: null,
    sortOrder: 7,
    description:
      "A Django-powered e-commerce store for footwear — catalogue, cart, checkout and order management supporting 50+ daily transactions and 50+ products in inventory.",
    idea:
      "E-commerce is the most honest test of full-stack ability: catalogue, cart, orders, inventory and money all have to work together. A shoe store is a perfect scope — familiar products, real complexity.",
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
      "The storefront, the Django application logic, the MySQL schema and the order/inventory pipeline end-to-end.",
    result:
      "A working e-commerce system demonstrated at 50+ daily transactions with 50+ managed products — proof I can build transactional business systems, not just pages.",
    architecture: "commerce-flow",
    metrics: json([
      { value: 50, suffix: "+", label: "Daily transactions supported" },
      { value: 50, suffix: "+", label: "Products in managed inventory" },
    ]),
  },
];

const experience = [
  {
    company: "Luminar Technolab",
    role: "Data Science Intern",
    location: "Kochi, Ernakulam",
    startDate: "May 2024",
    endDate: "Present",
    current: true,
    sortOrder: 1,
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

const education = [
  {
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

const certifications = [
  { title: "Data Science Foundations", issuer: "Great Learning", date: null, url: null, sortOrder: 1 },
  { title: "Data Visualisation With Power BI", issuer: "Great Learning", date: null, url: null, sortOrder: 2 },
];

const settings: Array<[string, string]> = [
  ["contact.email", "jyothilalreji@gmail.com"],
  ["contact.github", "https://github.com/jyothilalreji"],
  ["contact.linkedin", "https://www.linkedin.com/in/jyothilal-reji"],
  ["contact.location", "Kerala, India · Working with clients worldwide"],
  ["languages", json([{ name: "English", level: "Fluent" }, { name: "Malayalam", level: "Native" }])],
];

/* --------------------------------- runner --------------------------------- */

async function main() {
  console.log("Seeding portfolio database...");

  // Wipe in dependency-safe order
  await db.projectTechnology.deleteMany();
  await db.project.deleteMany();
  await db.technology.deleteMany();
  await db.experience.deleteMany();
  await db.education.deleteMany();
  await db.certification.deleteMany();
  await db.contactRequest.deleteMany();
  await db.siteSetting.deleteMany();

  // Technologies
  const techRows = await Promise.all(
    technologies.map((t) =>
      db.technology.create({
        data: {
          name: t.name,
          category: t.category,
          description: t.description ?? null,
          usedFor: t.usedFor ? json(t.usedFor) : null,
          sortOrder: t.sortOrder,
        },
      })
    )
  );
  const techByName = new Map(techRows.map((t) => [t.name, t.id]));
  console.log(`  ✓ ${techRows.length} technologies`);

  // Projects + links
  for (const p of projects) {
    const row = await db.project.create({
      data: {
        title: p.title,
        slug: p.slug,
        tagline: p.tagline,
        category: p.category,
        year: p.year,
        description: p.description,
        featured: p.featured,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        accentColor: p.accentColor,
        roleNote: p.roleNote,
        sortOrder: p.sortOrder,
        idea: p.idea,
        problem: p.problem,
        solution: p.solution,
        howItWorks: p.howItWorks,
        features: p.features,
        challenges: p.challenges,
        whatIBuilt: p.whatIBuilt,
        result: p.result,
        architecture: p.architecture,
        metrics: p.metrics,
      },
    });
    const names = projectTechMap[p.slug] ?? [];
    for (const name of names) {
      const techId = techByName.get(name);
      if (!techId) {
        console.warn(`    ! technology not found: ${name}`);
        continue;
      }
      await db.projectTechnology.create({ data: { projectId: row.id, technologyId: techId } });
    }
  }
  console.log(`  ✓ ${projects.length} projects with technology links`);

  for (const e of experience) {
    await db.experience.create({ data: e });
  }
  console.log(`  ✓ ${experience.length} experience entries`);

  for (const ed of education) {
    await db.education.create({ data: ed });
  }
  console.log(`  ✓ ${education.length} education entries`);

  for (const c of certifications) {
    await db.certification.create({ data: c });
  }
  console.log(`  ✓ ${certifications.length} certifications`);

  for (const [key, value] of settings) {
    await db.siteSetting.create({ data: { key, value } });
  }
  console.log(`  ✓ ${settings.length} site settings`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
