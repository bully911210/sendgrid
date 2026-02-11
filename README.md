# SigMail — Multi-Department Email Dispatch System

**Built by SIG Solutions, Pretoria, South Africa**

A single-page web application for sending professional, branded follow-up emails across 4 departments:

| Department | Sender Email | Color |
|---|---|---|
| **Free SA** | memberships@freesa.org.za | Orange |
| **TLU SA** | info@tlu.co.za | Green |
| **Firearms Guardian** | benefits@firearmsguardian.co.za | Red |
| **Civil Society SA** | contributors@civilsocietysa.co.za | Blue |

## Features

- **4 Department Tabs** — each with unique branding, agents, and email templates
- **Bilingual** — English and Afrikaans for every department
- **Live Preview** — real-time email preview as you type
- **PDF Attachment** — Firearms Guardian sends a fillable application form
- **SendGrid Integration** — reliable email delivery via verified senders
- **Vercel Deployment** — serverless function keeps API keys secure

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Backend:** Vercel Serverless Function (Node.js)
- **Email:** SendGrid API v3
- **PDF:** pdf-lib (client-side fillable PDF generation)
- **Icons:** Lucide React

## Quick Start (Development)

```bash
npm install
cp .env.example .env    # Add your SendGrid API key
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import repository in [vercel.com](https://vercel.com)
3. Add environment variable: `SENDGRID_API_KEY`
4. Deploy — Vercel auto-detects Vite framework

### Required SendGrid Setup

Verify these sender emails in your SendGrid account:
- `memberships@freesa.org.za`
- `info@tlu.co.za`
- `benefits@firearmsguardian.co.za`
- `contributors@civilsocietysa.co.za`

## Project Structure

```
sigmail/
├── api/
│   └── sendEmail.js          # Vercel serverless function
├── src/
│   ├── App.tsx                # Main application
│   ├── components/
│   │   └── EmailPreview.tsx   # Live email preview
│   ├── data/
│   │   ├── departments.ts     # Department configs & agents
│   │   └── templates.ts       # Email templates (EN/AF)
│   └── utils/
│       ├── emailHtml.ts       # HTML email generator
│       └── pdfGenerator.ts    # Firearms Guardian PDF form
├── vercel.json                # Vercel deployment config
└── .env.example               # Environment template
```
