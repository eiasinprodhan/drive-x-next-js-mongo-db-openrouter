# DriveX — Enterprise AI-Powered Car Rental Platform & Automation Suite

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Supported-green?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![OpenRouter AI](https://img.shields.io/badge/OpenRouter_AI-Nemotron_3.5_%2F_DeepSeek-purple?style=flat&logo=openai)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat)](LICENSE)

> **Technical Assessment Submission**  
> **Position:** Web Designer / Web Developer + AI Automation (Remote) — *Digital Pylot*  
> **Author:** Candidate Submission  
> **Platform Overview:** DriveX is a full-stack, enterprise-grade vehicle rental management system featuring an executive customer-facing web portal, an administrative dashboard matching Figma specifications, and multi-tier AI automation workflows.

---

## 📋 Core Modules & Capabilities

| Module | Scope | Status | Technical Highlights |
|---|---|:---:|---|
| **1. UI/UX & Design System** | Customer & Admin | **Ready** | Custom HSL token design system, luxury warm palette (`#FAF8F5` surface, `#0A1628` navy typography, `#FF7A1A` brand orange), fluid micro-animations, and full Figma alignment. |
| **2. Admin Dashboard & Analytics** | Admin Portal | **Ready** | Real-time KPIs (Revenue $148.5K, 84% Occupancy), interactive Recharts revenue charts with dynamic date filters (`7d`, `30d`, `90d`, `180d`, `YTD`), live transaction ledger, branch performance map, fleet management, and booking status controls. |
| **3. Customer Front-End & Portal** | Customer Facing | **Ready** | Wireframe implementation: 2-line hero headline with vehicle image bleed, floating multi-attribute search bar, 3-step structured booking flow, category-tabbed deals, why choose us, fleet catalog (`/cars`), reservation checkout (`/booking`), and customer dashboard (`/dashboard`). |
| **4. AI Intelligence & Assistant** | Platform-wide | **Ready** | **4 Autonomous AI Systems**: <br>1. **Rex AI Concierge**: Live LLM integration via OpenRouter with multi-model fallback (`nvidia/nemotron-3.5-lightning:free` / `deepseek-chat` / `gpt-4o-mini`) + deterministic offline rule engine.<br>2. **In-Chat Direct 1-Click Booking**: Complete reservation flow within conversational interface.<br>3. **AI Fleet Matchmaker**: Multi-attribute vehicle recommendation quiz.<br>4. **AI Lead Qualification**: Real-time 0–100 scoring with intent reasoning. |
| **5. Automation & Webhook Pipelines** | Background & CRM | **Ready** | RESTful API architecture, live automation ledger (`/admin/automation`), webhook endpoints (`/api/webhooks/digest`), Resend email delivery pipeline, and Telegram bot notification integration. |
| **6. Architecture & Security** | Core Engine | **Ready** | Modular TypeScript codebase, zero-config dual-mode database access layer (MongoDB Atlas ⇄ In-Memory Store with 355 seeded transactions), and signed HMAC-SHA256 JWT authentication. |

---

## 🌐 Application Architecture & Routes

```
                                  ┌────────────────────────────────┐
                                  │      DriveX Web Platform       │
                                  └───────────────┬────────────────┘
                                                  │
                ┌─────────────────────────────────┼─────────────────────────────────┐
                ▼                                 ▼                                 ▼
   ┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
   │   Customer Front-End    │       │   Customer Dashboard    │       │     Admin Suite CRM     │
   │      (Wireframe)        │       │       (/dashboard)      │       │     (Figma Design)      │
   └────────────┬────────────┘       └────────────┬────────────┘       └────────────┬────────────┘
                │                                 │                                 │
                ▼                                 ▼                                 ▼
   • Floating Search Bar             • Active Rental Tracking          • KPI Cards ($148.5K Rev)
   • Tabbed Fleet Catalog            • Printable Vouchers              • Interactive Area Charts
   • 4-Step Checkout (/booking)      • Historical Reservations         • Fleet Control (CRUD)
   • Rex AI Concierge & Chat         • VIP Tier Benefits               • AI Lead Pipeline (0-100)
   • Unified Auth (/login)           • Profile Management              • Automation Audit Ledger
```

### Route Directory

| Surface | URL | Description |
|---|---|---|
| **Customer Front-End** | [`/`](http://localhost:3000/) | Landing page with floating search bar, deals, and AI concierge |
| **Fleet Catalog** | [`/cars`](http://localhost:3000/cars) | Search & filter vehicles with integrated AI Matchmaker quiz |
| **Reservation Checkout** | [`/booking`](http://localhost:3000/booking) | 4-step booking workflow with real-time rate calculation |
| **Customer Registration** | [`/register`](http://localhost:3000/register) | Account creation with automatic VIP discount activation |
| **Unified Authentication** | [`/login`](http://localhost:3000/login) | Single sign-in portal for both Customers and Administrators |
| **Customer Dashboard** | [`/dashboard`](http://localhost:3000/dashboard) | Customer portal with active rentals, history, and printable vouchers |
| **Admin Dashboard** | [`/admin/dashboard`](http://localhost:3000/admin/dashboard) | Executive dashboard with analytics, revenue charts, and branch stats |
| **Fleet Management** | [`/admin/fleet`](http://localhost:3000/admin/fleet) | Vehicle catalog management (add, edit, toggle availability, delete) |
| **Booking Operations** | [`/admin/bookings`](http://localhost:3000/admin/bookings) | Reservation ledger with 1-click status transitions |
| **AI Leads Pipeline** | [`/admin/leads`](http://localhost:3000/admin/leads) | Real-time lead qualification pipeline with AI scoring |
| **Automation Ledger** | [`/admin/automation`](http://localhost:3000/admin/automation) | Webhook triggers, cron dispatches, and system audit logs |

---

## 🤖 AI Capabilities & Automation Pipelines

DriveX integrates four distinct AI systems with resilient fallback mechanics:

```
[Customer Interaction] ──► [OpenRouter LLM] ──► [DeepSeek / Nemotron / GPT-4o-mini]
                                  │
                                  ▼ (Fallback if Offline / No Key)
                        [DriveX Deterministic Engine]
                                  │
                                  ├─► Lead Qualification (0–100 Score + Intent)
                                  ├─► Fleet Matchmaking Recommendation
                                  ├─► In-Chat Direct Booking Creation
                                  └─► Automation Dispatch (Telegram / Resend / Webhooks)
```

1. **Rex AI Concierge & Chatbot**:
   - Real-time natural language vehicle assistance powered by OpenRouter LLM.
   - Built-in multi-model fallback chain: `nvidia/nemotron-3.5-lightning:free` → `deepseek/deepseek-chat` → `openai/gpt-4o-mini`.
   - Deterministic rule engine fallback guarantees 100% uptime even in offline or unconfigured environments.

2. **In-Chat Direct 1-Click Booking**:
   - Enables customers to complete vehicle reservations directly within the conversational interface.
   - Auto-detects customer details, dates, and vehicle selection to generate an official booking reference code (`DX-XXXXX`).

3. **AI Fleet Matchmaker Quiz**:
   - Multi-step questionnaire evaluating journey purpose, budget, and passenger capacity.
   - Generates ranked vehicle recommendations with personalized justifications.

4. **AI Lead Qualification Engine**:
   - Evaluates incoming sales inquiries and assigns a quality score (0–100) with intent categorization (`high`, `medium`, `low`).
   - Automatically synchronizes with the Admin CRM and dispatches notifications.

---

## 🔑 Demonstration Credentials

| Role | Email | Password | Destination |
|---|---|---|---|
| **System Administrator** | `admin@drivex.io` | `drivex2026` | [`/admin`](http://localhost:3000/admin) |
| **Customer Demo** | `customer@drivex.io` | `password123` | [`/dashboard`](http://localhost:3000/dashboard) |
| **New Customer Registration** | *Self-registered* | *Custom* | [`/register`](http://localhost:3000/register) |

*Note: One-click demo credential filling is available on the [`/login`](http://localhost:3000/login) page for convenient evaluation.*

---

## 📡 REST API Reference

All administrative endpoints support Bearer Token authentication via `POST /api/admin/verify`.

| Method | Endpoint | Access | Function |
|---|---|:---:|---|
| `GET` | `/api/cars` | Public | List fleet vehicles with optional category/availability filters |
| `POST` | `/api/cars` | Admin | Create a new vehicle listing in the fleet |
| `DELETE` | `/api/cars/:id` | Admin | Remove a vehicle listing from the catalog |
| `POST` | `/api/booking` | Public | Create a customer vehicle reservation |
| `GET` | `/api/booking?email=` | Public / User | Retrieve customer reservations by email |
| `GET` | `/api/booking` | Admin | Retrieve all reservation records across the system |
| `PATCH` | `/api/bookings/:id` | Admin | Update reservation status (*Confirmed, Completed, Cancelled*) |
| `POST` | `/api/leads` | Public | Capture sales lead with automated AI qualification pipeline |
| `GET` | `/api/leads` | Admin | Retrieve sales lead pipeline with AI scores |
| `POST` | `/api/ai/chat` | Public | AI Concierge endpoint with direct booking capability |
| `POST` | `/api/ai/recommend` | Public | AI Matchmaker fleet recommendation engine |
| `POST` | `/api/auth/register` | Public | Register a new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate customer credentials |
| `POST` | `/api/admin/verify` | Public | Authenticate administrator credentials and issue JWT |
| `POST` | `/api/webhooks/digest` | Secret | Trigger daily operations digest webhook |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/drivex.git
cd drivex

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional — demo mode works out of the box)
cp .env.example .env.local

# 4. Start development server
npm run dev

# 5. Seed dataset (optional)
npm run seed
```

Access the local server at **[`http://localhost:3000`](http://localhost:3000)**.

---

## ⚙️ Environment Configuration

| Variable | Type | Default | Purpose |
|---|:---:|---|---|
| `MONGODB_URI` | Optional | *In-Memory fallback* | MongoDB Atlas connection string |
| `OPENROUTER_API_KEY` | Optional | *Rule engine fallback* | OpenRouter API Key for live LLM inference |
| `OPENROUTER_MODEL` | Optional | `nvidia/nemotron-3.5-lightning:free` | Primary LLM model identifier |
| `OPENROUTER_MODEL_FALLBACK` | Optional | `openai/gpt-4o-mini` | Secondary LLM model identifier |
| `ADMIN_EMAIL` | Optional | `admin@drivex.io` | Default administrative account email |
| `ADMIN_PASSWORD` | Optional | `drivex2026` | Default administrative account password |
| `TELEGRAM_BOT_TOKEN` | Optional | — | Telegram Bot token for instant sales alerts |
| `TELEGRAM_CHAT_ID` | Optional | — | Telegram chat identifier for notifications |
| `RESEND_API_KEY` | Optional | — | Resend API key for automated customer email dispatch |
| `WEBHOOK_SECRET` | Optional | `drivex-webhook-secret` | Authentication secret for external webhook triggers |

---

## 🧪 Evaluator Walkthrough Script (3-Minute Tour)

1. **Customer Front-End Experience**:
   - Navigate to [`http://localhost:3000`](http://localhost:3000).
   - Use the **Floating Search Bar** to select dates and location → notice automatic routing to [`/cars`](http://localhost:3000/cars).
   - Click **"AI Assistant"** (bottom right) and ask: *"Recommend a luxury SUV for a 3-day family trip"*.
   - Click **"Direct Reservation"** on the recommended vehicle card inside the chat to test **In-Chat Direct Booking**.

2. **Customer Portal & Checkout**:
   - Navigate to [`/register`](http://localhost:3000/register) to create a customer account.
   - Complete a vehicle booking at [`/booking`](http://localhost:3000/booking) → notice auto-filled profile information.
   - Visit [`/dashboard`](http://localhost:3000/dashboard) to view active reservations and click **"View Voucher"** to test voucher printing.

3. **Admin Suite Management**:
   - Navigate to [`/admin`](http://localhost:3000/admin) and sign in using `admin@drivex.io` / `drivex2026`.
   - Inspect **Sales Analytics** area chart with date filters (`7d`, `30d`, `90d`, `YTD`).
   - Open **Fleet** ([`/admin/fleet`](http://localhost:3000/admin/fleet)) and toggle a vehicle's availability → observe real-time catalog reflection.
   - Open **AI Leads** ([`/admin/leads`](http://localhost:3000/admin/leads)) to review AI scoring breakdown (0–100) and qualification reasoning.
   - Open **Automation** ([`/admin/automation`](http://localhost:3000/admin/automation)) to inspect the audit ledger and trigger automated workflow runs.

---

## 📄 License & Attribution

This project is submitted as part of the **Digital Pylot Technical Assessment**.  
Designed and developed with precision by the candidate.
