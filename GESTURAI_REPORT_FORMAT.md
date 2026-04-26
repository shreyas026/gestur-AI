# GESTURAI PROJECT REPORT FORMAT

This file mirrors the academic structure used in the uploaded `.docx` and adapts it for the GesturAI project. Replace all bracketed placeholders before final submission.

---

## COVER PAGE

**GESTURAI**  
**PROJECT REPORT**

Submitted by

- `[Student Name 1] ([Register Number])`
- `[Student Name 2] ([Register Number])`
- `[Student Name 3] ([Register Number])`
- `[Student Name 4] ([Register Number])`

In partial fulfillment for the award of the degree of

**BACHELOR OF ENGINEERING**  
**IN**  
**COMPUTER SCIENCE AND ENGINEERING**

`[College Name]`  
`[Autonomous / Affiliated Status]`  
`[Accreditation Line]`

`[Month Year]`

---

## BONAFIDE CERTIFICATE

Certified that this project report titled **"GESTURAI - SIGN LANGUAGE TRANSLATION PLATFORM"** is the bonafide work of `[Student Names with Register Numbers]`, who carried out the project work under my supervision.

**Supervisor**  
`[Guide Name]`  
`[Designation]`  
`[Department]`

**Head of the Department**  
`[HOD Name]`  
`[Designation]`  
`[Department]`

Submitted for the project viva-voce examination held on `____________`.

**Internal Examiner:** `____________`  
**External Examiner:** `____________`

---

## ACKNOWLEDGEMENT

We express our sincere gratitude to our institution, department faculty, project guide, and all those who supported us during the development of **GesturAI**. Their guidance, encouragement, and technical suggestions helped us complete this project successfully.

We also thank our friends and family members for their constant support throughout the planning, implementation, testing, and documentation of this work.

---

## ABSTRACT

GesturAI is a full-stack web application designed to reduce communication barriers between spoken or written language users and sign language users. The system accepts English text input, processes it through normalization, phrase matching, grammar filtering, and optional AI-assisted interpretation, and returns a sequence of sign-language video clips. The platform is built using a React frontend, an Express.js backend, and MongoDB for persistent data management.

The application includes secure user authentication, a translator workspace, and an administrative dashboard for sign catalog management. Its translation engine supports direct word mapping, phrase-level matching, alias handling, and optional Gemini-assisted semantic parsing. An experimental RAG-based module is also included to improve contextual understanding and grammar-aware translation decisions. The frontend uses a dual-video playback approach to preload upcoming clips and improve playback continuity.

GesturAI demonstrates how accessible communication tools can be built using modern web technologies, AI-assisted language processing, and real human sign video assets. The project is suitable for academic demonstration, accessibility-oriented research, and future enhancement toward more natural sign translation systems.

---

## TABLE OF CONTENTS

1. Introduction  
2. Literature Survey  
3. Tech Structure  
4. System Requirement  
5. Implementation of Proposed Methodology  
6. Results and Discussion  
7. Conclusion and Future Enhancement  
8. Appendices  
9. References

---

## LIST OF FIGURES

- Figure 5.1 Overall GesturAI Translation Flowchart
- Figure 6.1 Landing Page
- Figure 6.2 Login Page
- Figure 6.3 Registration Page
- Figure 6.4 Translator Workspace
- Figure 6.5 Translation Result and Video Playback
- Figure 6.6 Admin Dashboard
- Figure 6.7 Sign Catalog Management
- Figure 6.8 Video Upload Module

---

# CHAPTER 1
# INTRODUCTION

## 1.1 Introduction

Communication accessibility is a major challenge for users who depend on sign language in digital environments. Most software systems are designed around text, audio, or speech interfaces, which can make communication difficult for deaf and hard-of-hearing users. GesturAI is developed to address this problem by translating user-entered text into a sequence of real sign-language videos.

## 1.2 Problem Statement

Many existing communication tools do not provide natural sign-language output. Traditional translators mainly convert between spoken languages, while static sign dictionaries only support isolated word lookup. There is a need for a manageable, web-based system that can translate text into playable sign video sequences.

## 1.3 Objectives

- To build a web-based text-to-sign translation platform.
- To map words and phrases to real sign-language video assets.
- To support user authentication and role-based access.
- To provide admin tools for uploading and managing sign videos.
- To explore AI-assisted translation using Gemini and RAG modules.

## 1.4 Scope of the Project

GesturAI focuses on English text input and sign-video output using a managed media catalog. The current implementation supports authentication, translation, video playback, and administration. The system is intended as a working prototype and academic project platform rather than a complete production-scale sign language engine.

## 1.5 Existing System

Existing systems usually fall into one of the following categories:

- static sign dictionary websites,
- generic text translation tools,
- avatar-based sign generation systems,
- unmanaged video repositories,
- or AI-only experimental translators without playable assets.

## 1.6 Proposed System

The proposed system combines a React frontend, Express backend, MongoDB database, and a sign-video library. It translates normalized input text into an ordered sequence of sign clips using phrase matching, word matching, grammar simplification, and optional AI support. An admin dashboard allows new assets and catalog entries to be added without changing application code.

---

# CHAPTER 2
# LITERATURE SURVEY

## 2.1 Sign Language Dictionary Platforms

Static sign dictionary platforms are useful for education and one-word lookup, but they usually do not support sentence-level translation or continuous playback. Their main limitation is the lack of phrase handling and application workflow integration.

## 2.2 General Language Translation Systems

General language translation tools are designed for text-to-text conversion between spoken languages. They usually do not preserve the grammar, sequencing, and visual representation needed for sign language communication.

## 2.3 Avatar-Based Sign Generation

Avatar-based systems attempt to synthesize signs using animation or 3D rendering. Although flexible, they often require complex linguistic modeling and may not match the natural quality of real human sign performances.

## 2.4 Video Repository Approaches

Some systems store sign videos in media libraries, but they do not provide structured translation logic, secure authentication, or administrative workflows for maintaining a growing catalog.

## 2.5 AI-Assisted Translation Research

Recent AI-based approaches improve context understanding and grammar conversion, but many still struggle to produce dependable sign outputs unless they are linked to a curated video catalog. GesturAI addresses this by combining deterministic matching with AI-assisted enhancements.

## 2.6 Comparative Observation

From the literature and practical observation, a useful sign-translation system should:

- support real media playback,
- allow catalog management,
- provide sentence-level translation,
- include fallback logic when AI is unavailable,
- and remain accessible through a web interface.

---

# CHAPTER 3
# TECH STRUCTURE

## 3.1 Overview of the Technology Stack

GesturAI is implemented as a JavaScript monorepo with separate client and server workspaces. The frontend is developed using React 19 and Vite, while the backend uses Node.js, Express.js, and MongoDB with Mongoose.

## 3.2 Frontend Structure

The frontend includes:

- a landing page,
- a login and registration page,
- a translator workspace,
- and an admin management interface.

The main UI logic is handled in `client/src/App.jsx`, with additional presentation components such as `Landing.jsx` and `LoginPage.jsx`.

## 3.3 Backend Structure

The backend includes:

- authentication routes,
- translation routes,
- sign administration routes,
- translation configuration routes,
- middleware for authorization, error handling, uploads, and rate limiting,
- and services for translation, grammar conversion, Gemini parsing, and RAG experimentation.

## 3.4 Database Structure

The MongoDB layer includes at least two important document models:

- `User`: stores name, email, password hash, and role.
- `SignVideo`: stores a sign word or phrase and its mapped video URL.

## 3.5 Translation Engine Structure

The translation system performs:

1. input normalization,
2. token cleaning,
3. phrase-level lookup,
4. word-level lookup and alias resolution,
5. grammar filtering,
6. unmatched word reporting,
7. optional Gemini semantic parsing,
8. optional RAG-assisted enhancement.

## 3.6 Media Playback Structure

The frontend uses a two-video playback mechanism so one clip can play while the next clip is preloaded. This improves visual continuity during sign sequence playback.

---

# CHAPTER 4
# SYSTEM REQUIREMENT

## 4.1 Software Requirements

- Operating System: Windows / Linux / macOS
- Frontend: React 19, Vite
- Backend: Node.js, Express.js
- Database: MongoDB
- Version Control: Git
- API Testing: Postman or equivalent
- Optional AI Support: Google Gemini configuration

## 4.2 Hardware Requirements

- Processor: Intel i3 or above
- RAM: 4 GB minimum, 8 GB recommended
- Storage: 1 GB or more free space
- Internet: required for package installation and optional AI services

## 4.3 Functional Requirements

- User registration and login
- Session persistence
- Role-based access control
- Text-to-sign translation
- Video playlist generation
- Unmatched word reporting
- Sign catalog CRUD operations
- Video asset upload
- Admin summary and user overview

## 4.4 Non-Functional Requirements

- Usability
- Accessibility support
- Reliability
- Maintainability
- Security
- Scalability for larger sign catalogs

## 4.5 Security Requirements

The system includes password hashing, token-based authentication, rate limiting, input validation, upload filtering, and protected admin routes.

---

# CHAPTER 5
# IMPLEMENTATION OF PROPOSED METHODOLOGY

## 5.1 Flowchart

**Figure 5.1 Overall GesturAI Translation Flowchart**

Suggested flow:

1. User enters text.
2. System validates authentication.
3. Input is normalized and tokenized.
4. Phrase matching is attempted.
5. Word matching and alias resolution are attempted.
6. Optional Gemini or RAG enhancement is applied.
7. Matched videos are returned.
8. Frontend plays the sequence using dual-video buffering.
9. Admin users can upload and map new videos to improve future results.

## 5.2 User Authentication and Access Control

Users can register and log in through the authentication module. After successful login, a token is issued and used to access protected translation endpoints. The first registered account may become the admin when no configured admin email list exists, and configured admin emails also receive admin privileges.

## 5.3 Translation Workflow

The translation workflow is the core of the project. The system first cleans and normalizes the input text, then loads the sign catalog from MongoDB with caching. It attempts phrase-level matching before word-level matching so that expressions like multi-word greetings can be translated more accurately. When words are not found, the system reports unmatched terms to help future catalog improvement.

## 5.4 Grammar Simplification and Alias Handling

The grammar service removes less important filler words and supports aliases and simple word-form variants. This improves matching success for inputs such as plural forms, tense variations, and equivalent expressions like "thanks" and "thank you".

## 5.5 Gemini-Assisted Translation

When enabled, the Gemini module performs semantic parsing and gloss conversion before mapping the generated gloss tokens to available sign videos. If the AI path does not produce useful matches, the system falls back to the rule-based translator.

## 5.6 RAG-Enhanced Translation

The RAG module introduces context-aware translation support by using a curated knowledge base and contextual grammar guidance. This helps the system improve matching decisions for domains such as greetings, questions, emotions, and related contexts.

## 5.7 Admin Dashboard and Catalog Management

The admin dashboard allows authorized users to view summary statistics, browse catalog entries, create or edit sign mappings, delete outdated entries, and upload new video assets. This makes the project maintainable as the sign library expands.

## 5.8 Video Playback Engine

The frontend playback engine uses two HTML video elements to reduce latency between clips. While one video is playing, the next video is prepared in the background, making sentence playback smoother.

---

# CHAPTER 6
# RESULTS AND DISCUSSION

GesturAI successfully demonstrates a working text-to-sign translation platform with secure authentication, database-backed catalog management, and sign-video playback. The project shows that a practical accessibility tool can be built by combining a curated media catalog with deterministic translation logic and optional AI-based enhancement.

## 6.1 Landing Page

Include screenshot and discussion of the public-facing introduction, feature presentation, and call-to-action flow.

## 6.2 Login Page

Include screenshot and explain account-based access, validation, and session handling.

## 6.3 Registration Page

Include screenshot and explain new account creation and admin role assignment logic.

## 6.4 Translator Workspace

Include screenshot and describe text input, translate action, and result rendering.

## 6.5 Translation Result and Video Playback

Include screenshot and explain matched segments, unmatched words, and the video playlist.

## 6.6 Admin Dashboard

Include screenshot and describe total users, total admins, and recent user overview.

## 6.7 Sign Catalog Management

Include screenshot and explain create, update, search, and delete operations for sign entries.

## 6.8 Video Upload Module

Include screenshot and explain file upload handling and mapping uploaded media to sign records.

## 6.9 Discussion

The project performs well as a prototype and academic demonstration. Its biggest strength is that it does not depend entirely on AI. Even when Gemini or RAG modules are unavailable, the rule-based translation path still works using the existing catalog. The main limitation is that translation quality depends on the breadth and accuracy of the stored sign-video mappings.

---

# CHAPTER 7
# CONCLUSION AND FUTURE ENHANCEMENT

## 7.1 Conclusion

GesturAI is a meaningful accessibility-focused project that combines frontend interaction, secure backend services, database-backed sign mapping, and optional AI integration into one unified platform. It demonstrates a practical approach to reducing communication barriers by translating text into real sign-language video sequences.

## 7.2 Future Enhancement

Future work can include:

- support for more sign languages,
- larger phrase libraries,
- better AI-based grammar conversion,
- personalized translation suggestions,
- multilingual input,
- improved analytics for missing vocabulary,
- mobile-first delivery,
- and broader accessibility testing with real users.

---

# APPENDICES

Suggested appendix content:

- `client/src/App.jsx`
- `client/src/components/Landing.jsx`
- `client/src/components/LoginPage.jsx`
- `server/index.js`
- `server/services/translationService.js`
- `server/controllers/authController.js`
- `server/controllers/signAdminController.js`
- `server/services/grammarService.js`

You can paste important code excerpts or module descriptions here if your department requires source-code appendix pages.

---

# REFERENCES

Use your college citation style and include sources such as:

1. React documentation
2. Vite documentation
3. Node.js documentation
4. Express.js documentation
5. MongoDB documentation
6. Mongoose documentation
7. Axios documentation
8. Google Gemini / Generative AI documentation
9. Research papers on sign language translation systems
10. Research papers on retrieval-augmented generation and accessible communication systems

