# GESTURAI - SIGN LANGUAGE TRANSLATION PLATFORM

**Project Report**

Prepared based on the current implementation of the GesturAI full-stack application.

## Abstract

GesturAI is a full-stack web application developed to reduce communication barriers between spoken or written language users and sign language users through an accessible text-to-sign translation workflow. The platform accepts English text input, processes the sentence using normalization, phrase matching, grammar simplification, and AI-assisted translation strategies, and returns a sequence of human sign-language video clips. The project combines a React-based frontend with an Express and MongoDB backend to deliver secure authentication, translation services, and administrative control over the sign-video catalog.

The system is designed around practical usability. A public-facing landing page introduces the platform, while authenticated users can translate text into sign videos through a dedicated workspace. The playback engine uses a double-buffered video approach so that one sign clip can be preloaded while another is playing, reducing transition latency and improving continuity. The backend maintains a searchable sign catalog, supports phrase-level matching, and includes optional Gemini-assisted semantic parsing and gloss conversion for more advanced translation paths. A separate RAG-oriented module is also included to experiment with context-aware translation improvements.

GesturAI also provides a role-based admin dashboard where authorized users can upload video assets, create or edit sign entries, review catalog contents, and monitor overall user statistics. With these capabilities, the platform moves beyond a simple dictionary and becomes a manageable translation system. The project demonstrates how modern JavaScript technologies, database-backed content management, and AI-assisted language processing can be combined to support inclusive communication and accessible digital interaction.

## Keywords

GesturAI; Sign Language Translation; Text-to-Sign System; Accessibility Platform; Human Sign Video Mapping; React 19; Vite; Node.js; Express.js; MongoDB; Mongoose; Role-Based Access Control; Token Authentication; Admin Dashboard; Video Asset Management; Phrase Matching; Grammar Simplification; Gemini-Assisted Translation; Retrieval-Augmented Translation; Multer Uploads; Rate Limiting; Error Handling; Inclusive Communication; Assistive Technology; Web-Based Translation System

## Introduction

Communication accessibility remains a major challenge in digital systems where spoken or written language dominates interaction. Many users who depend on sign language encounter limited support when consuming text-heavy interfaces, educational content, service platforms, or administrative systems. Traditional translation tools often focus on text-to-text or speech-to-text conversion, but sign language communication requires a different representation model that considers phrase structure, word order, and natural visual delivery.

GesturAI is developed as a practical response to this problem. Its goal is to convert user-entered English text into a sequence of real sign-language video clips stored in a managed catalog. Instead of generating synthetic avatars, the project uses authentic video assets and maps them to words or phrases maintained in the backend. This makes the platform suitable for real-world translation demonstrations, academic projects, accessibility showcases, and controlled domain-specific communication support.

The application is organized as a monorepo with a React frontend and an Express backend. The client handles landing, authentication, translation, playback, and administration interfaces. The server handles user management, authorization, sign catalog operations, file upload management, and translation logic. Translation is not limited to direct word lookup. The project includes rule-based grammar filtering, alias support, phrase-level matching, experimental Gemini-based semantic parsing and gloss conversion, and a separate RAG-inspired pipeline for contextual improvements.

The overall objective of GesturAI is to provide a manageable, extensible, and accessible sign translation environment that can be improved over time as the sign catalog grows and AI-assisted translation becomes more reliable.

## Introduction to the Model

The operating model of GesturAI is centered on a catalog-driven translation pipeline:

1. The user enters a sentence through the translator interface.
2. The system normalizes the text by removing punctuation, expanding contractions, and simplifying word forms.
3. The translation service attempts phrase matching first, then word-level matching with aliases and grammar-based filtering.
4. When enabled, Gemini services may attempt semantic parsing and gloss generation before falling back to rule-based processing.
5. The matched sign entries are returned as an ordered video playlist.
6. The frontend plays the videos using a stacked dual-video approach for smoother transitions.
7. Admin users can continuously improve the catalog by uploading new sign videos and mapping them to words or phrases.

This model makes the platform both user-facing and maintainable. Translation quality improves as the database becomes richer, and the application can support both deterministic matching and AI-assisted experiments.

## Performed Analysis of Existing Methodology

Existing approaches for sign-language support generally fall into a few categories:

### 1. Static Sign Dictionary Platforms

These platforms allow users to search for individual words and view a corresponding sign clip or image. They are simple and educational, but they often lack sentence-level translation, phrase matching, workflow continuity, and personalized content management.

### 2. General Language Translation Tools

Mainstream translation systems focus primarily on converting text between spoken languages. They are not built to preserve the grammar, structure, and visual representation needed for sign language delivery, and they rarely support sign-video sequencing.

### 3. Avatar-Based Sign Generation Systems

Some research and commercial solutions use animated 3D avatars to synthesize sign output. These systems can be flexible, but they often require specialized linguistic modeling and may not preserve the natural expression quality of real human signing.

### 4. Video Repository Solutions Without Admin Workflow

Some systems store sign clips and serve them as media assets, but they do not provide role-based administration, upload flows, catalog editing, user management, or structured translation logic.

### 5. AI-Only Experimental Translators

AI-first systems can attempt semantic interpretation of natural language, but if they are not grounded in a curated sign catalog, they may generate outputs that cannot actually be rendered as real sign videos. This produces a gap between linguistic interpretation and deliverable playback.

## Demerits and Disadvantages of Existing Methodologies

- Static dictionary systems are limited to isolated word search and do not provide fluid sentence playback.
- Generic translators do not preserve sign-language-specific structure or video-based output.
- Avatar systems may reduce naturalness and can be expensive or complex to implement.
- Unmanaged video repositories become difficult to scale because new sign clips cannot be organized, edited, or validated efficiently.
- AI-only systems may interpret meaning well but still fail to return playable sign assets.
- Many systems do not include secure account management or role-based access for maintaining sensitive content.

These limitations motivate the design of GesturAI as a catalog-backed, video-driven, admin-manageable translation platform with room for AI enhancement.

## Research on the Proposed Methodology

GesturAI proposes an integrated methodology that combines structured catalog management with flexible translation logic. The platform does not depend on only one translation strategy. Instead, it combines:

- deterministic phrase matching for multi-word signs such as greetings or common questions,
- rule-based word matching with alias support for singular/plural and verb-form variations,
- optional semantic parsing and gloss conversion using Gemini services,
- an experimental RAG-inspired module for context-aware filtering and translation guidance,
- human-managed sign asset uploads and catalog administration,
- and a web-based playback engine for continuous sign presentation.

This blended design improves practicality. Even if AI services are unavailable, the system still works through database-driven matching. When AI services are available and configured, the project can attempt more advanced interpretation while preserving a reliable fallback path.

## Proposed System Architecture

### Frontend Layer

The frontend is implemented using React 19 with Vite. It includes:

- a landing page for platform introduction,
- a login and registration page,
- a translator workspace for authenticated users,
- and an admin dashboard for authorized content and user management.

The client communicates with the backend through HTTP requests and stores authenticated sessions in local or session storage depending on the user’s persistence choice.

### Backend Layer

The backend is implemented with Express.js and MongoDB via Mongoose. It provides:

- authentication routes,
- current-user and admin-summary routes,
- translation endpoints,
- sign-admin routes for CRUD operations,
- file upload handling for video assets,
- translation configuration endpoints,
- and a server-side static route for sign video delivery.

### Data Layer

The database stores user and sign metadata. The current implementation includes:

- `User` documents for account identity and role,
- `SignVideo` documents for word-to-video mappings,
- and supporting catalog data loaded into an in-memory cache for efficient lookup.

### Translation Flow

The translation engine follows these steps:

1. Normalize and clean the input sentence.
2. Load the sign catalog from MongoDB with caching.
3. Attempt phrase-level matching from longest candidate to shortest.
4. Attempt word-level matching and alias resolution.
5. Filter removable grammar words where appropriate.
6. Return matched segments and unmatched words.
7. Deliver the ordered video list to the client for playback.

When Gemini is enabled, the engine first attempts semantic parsing and gloss conversion before falling back to the rule-based approach.

## Important Software Used and Their Description

### 1. React 19

React is used to build the interactive frontend of GesturAI. It manages page transitions, authentication state, the translator workspace, and the admin interface. Component-based rendering helps organize user interactions cleanly.

### 2. Vite

Vite is the frontend build tool used for development and production builds. It provides fast local development, module-based compilation, and optimized asset bundling.

### 3. Node.js

Node.js powers the backend runtime of the project. It enables JavaScript-based server development and supports asynchronous request handling for authentication, translation, database access, and file management.

### 4. Express.js

Express is the web framework used to create REST endpoints for authentication, translation, admin operations, and asset serving. It also supports middleware for CORS, JSON parsing, authorization, rate limiting, and global error handling.

### 5. MongoDB

MongoDB is used as the primary data store for users and sign-video mappings. Its document-based structure fits well with flexible catalog entries and account records.

### 6. Mongoose

Mongoose provides schema definitions and database interaction for models such as `User` and `SignVideo`. It simplifies validation, indexing, and data access patterns.

### 7. Axios

Axios is used on the frontend to call backend APIs for login, registration, translation, admin data loading, sign management, and video uploads.

### 8. Multer

Multer handles multipart file uploads on the server. It is used by admin users to upload `.mp4`, `.webm`, and `.mov` files into the sign video library.

### 9. Google Generative AI SDK

The Gemini integration is built using the Google Generative AI package. It is used for experimental semantic parsing and gloss conversion, helping the system move from direct lookup toward meaning-aware translation.

### 10. Custom Token-Based Authentication

The system uses a custom HMAC-signed token mechanism for session management. Authenticated users can access protected translation features, while admin users can access privileged catalog and summary routes.

## Result and Discussion

GesturAI successfully demonstrates a working full-stack accessibility platform for text-to-sign translation. The implemented project supports:

- user registration and login,
- role-based authentication,
- sentence input and sign-video playlist generation,
- phrase and word matching,
- unmatched-word reporting,
- smooth sequential video playback,
- admin catalog CRUD operations,
- video asset upload and preview,
- and experimental AI-enhanced translation paths.

One of the most practical strengths of the project is that it does not depend entirely on AI inference. The core rule-based translation pipeline works independently when a suitable sign catalog exists. This makes the project reliable for demonstrations and controlled deployment. The admin workflow also adds real operational value because new signs can be introduced without changing the frontend application.

The discussion also reveals several implementation realities:

- The main translator flow is functional and ready for demonstration.
- The frontend currently centralizes much of the logic in one large component, which may affect long-term maintainability.
- Gemini and RAG modules exist, but they are only partially integrated into the visible frontend workflow.
- Linting currently reports a few cleanup issues, though the client production build completes successfully.
- Security and deployment hardening can be improved further before production use.

Overall, the result is a strong working prototype and project report candidate, with clear evidence of full-stack integration, media handling, and accessibility-focused problem solving.

## Page and Module Description

### Landing Page

The landing page introduces GesturAI as an accessibility-oriented translation platform. It includes a dynamic hero section, animated particle canvas, platform vision, feature highlights, and navigation into the authenticated application. This page serves as the entry point for both new and returning users.

### Login and Registration Page

This page allows users to create an account or sign in using email and password. It includes remember-me session behavior and communicates role-based access expectations to the user. This page ensures that translation and administration actions are available only to authenticated users.

### Translator Workspace

The translator workspace is the main operational area for regular users. It accepts text input, sends translation requests to the backend, and displays the resulting sign-video sequence. It also shows matched translation segments and unmatched words so users can understand what the system recognized and what is still missing from the catalog.

### Translation Insight Panel

The insight area displays the matched sequence and missing vocabulary for each request. This helps users evaluate translation quality and helps administrators identify which sign entries should be added later for better coverage.

### Video Playback Engine

The playback engine uses two stacked HTML video elements. While one video is actively playing, the next one is preloaded in the background. This reduces transition delay between consecutive sign clips and improves the visual continuity of sentence playback.

### Admin Dashboard

The admin dashboard is available only to users with the `admin` role. It displays user totals, admin totals, catalog entry counts, uploaded asset counts, and recent registrations. It acts as the operational control center of the platform.

### Video Asset Management

This module allows an admin to upload new sign videos into the backend asset library. Upload progress is displayed on the frontend, and newly uploaded assets can immediately be selected for sign creation.

### Catalog Management

This module allows admins to create, edit, search, and delete sign entries. Each entry maps a word or phrase to a video path. This module is essential because the quality of translation directly depends on the richness and correctness of the sign catalog.

### Gemini-Assisted Translation Module

This experimental module attempts to parse the meaning of a sentence using Gemini, generate ASL-style gloss tokens, and then map those tokens back to the available sign catalog. It is designed to improve translation quality for natural language inputs when AI configuration is available.

### RAG-Oriented Translation Module

The RAG-related module introduces context-aware grammar filtering and retrieval-inspired translation guidance. It is intended as an experimental extension for improving contextual understanding and translation decisions.

## Security and Reliability Considerations

The current project includes several useful safeguards:

- role-based route protection,
- token-based authentication,
- password hashing,
- input validation helpers,
- rate limiting,
- upload filtering for supported video types,
- and centralized logging and error handling.

At the same time, the analysis of the current codebase shows areas for future strengthening:

- production secret management should be enforced more strictly,
- translation-configuration routes should be protected,
- AI configuration naming should be standardized,
- and deployment should be paired with HTTPS/TLS in a real production environment.

These observations do not reduce the project value; they simply indicate where the next maturity improvements should be focused.

## Conclusion

In conclusion, GesturAI presents a meaningful and well-implemented accessibility project that combines web development, database management, media handling, and AI-assisted translation experimentation. It addresses a real communication challenge by converting English text into sign-language video sequences through a catalog-driven translation pipeline. The project is not limited to a single demonstration screen; it includes authentication, protected translation workflows, an admin management dashboard, upload facilities, and extensible translation services.

The platform demonstrates strong educational and practical value. It shows how accessible technology can be built with current full-stack tools while remaining understandable, modular, and open to improvement. GesturAI successfully proves that sign-language assistance can be approached through a maintainable web architecture grounded in real video assets rather than only theoretical translation logic.

## Future Scope

GesturAI can be extended in several important directions:

- Expand the sign catalog significantly to improve sentence coverage and reduce unmatched words.
- Add support for multiple sign-language standards or region-specific variants.
- Integrate voice-to-text so spoken input can also be translated into sign-video output.
- Protect and operationalize the Gemini and RAG pipelines more fully in the frontend.
- Replace the current monolithic frontend state structure with modular feature components.
- Add automated tests for client behavior, API routes, and translation services.
- Improve production security by enforcing stronger secret configuration and protected admin-only configuration routes.
- Introduce analytics on the most frequently unmatched terms so the catalog can be improved systematically.
- Support video sequencing export or downloadable translation sessions for education and training use cases.
- Deploy the system with HTTPS, cloud storage for media, and scalable catalog administration for broader institutional usage.

With these future enhancements, GesturAI can evolve from a strong academic project and working prototype into a more mature assistive platform for inclusive communication.

## References

1. React Documentation. https://react.dev/
2. Vite Documentation. https://vitejs.dev/
3. Express.js Documentation. https://expressjs.com/
4. MongoDB Documentation. https://www.mongodb.com/docs/
5. Mongoose Documentation. https://mongoosejs.com/docs/
6. Axios Documentation. https://axios-http.com/
7. Multer Documentation. https://github.com/expressjs/multer
8. Google Generative AI JavaScript SDK Documentation.
9. GesturAI project source files and project documentation in the current repository.
