# MediDispense 💊

MediDispense is a web-based project that explores a simpler way of handling medicine collection in hospitals.

The idea came from a common problem: after visiting a doctor, patients may have to wait in another queue just to collect their prescribed medicines. MediDispense is designed around a digital authorization and QR-based verification workflow that could eventually be connected to an automated medicine dispenser.

## Problem

Hospital pharmacies can become crowded when many patients are collecting medicines at the same time. The process is often dependent on manual verification and distribution, which can increase waiting time and workload for staff.

MediDispense explores how some of these steps could be handled through a digital system.

## How it works

The basic workflow is:

```text
Doctor
   ↓
Medicine authorization
   ↓
QR code / verification
   ↓
Request validation
   ↓
Medicine dispensing
```

The current project focuses on the **web application and user interface for this workflow**. Physical dispenser hardware and a production backend would require additional implementation.

## Features

* Doctor-focused dashboard/interface
* Medicine authorization workflow
* QR code generation
* QR-based verification
* Medicine request and dispensing information
* Dashboard-style status information
* Responsive web interface

## Technology used

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Libraries

* `qrcode.react` — QR code generation
* `lucide-react` — icons
* `clsx` and `tailwind-merge` — styling utilities

The project currently uses a frontend-focused setup. Database storage, authentication, hospital-system integration, and hardware communication can be added as the project is developed further.

## Project structure

```text
medidispense/
├── app/                  # Application pages and routes
├── components/           # Reusable UI components
├── lib/                  # Utility functions and shared logic
├── public/               # Static assets, if required
├── components.json       # UI component configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies and scripts
├── pnpm-lock.yaml        # Dependency lock file
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Getting started

### Prerequisites

Make sure you have Node.js installed on your system.

### Clone the repository

```bash
git clone https://github.com/tejanshtiwari/medidispense.git
cd medidispense
```

### Install dependencies

Using pnpm:

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

### Run the development server

With pnpm:

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

## Current status

MediDispense is currently a **prototype**.

The main goal at this stage is to demonstrate the interface and the proposed medicine authorization/verification workflow. It should not be used to dispense real medication.

For a real-world implementation, additional work would be required for:

* User authentication
* Doctor and staff roles
* Database integration
* Secure prescription storage
* Hospital/API integration
* Medicine inventory management
* Hardware communication
* Dispensing safety controls
* Audit logging
* Security and privacy testing

## Future improvements

Some possible improvements for the project are:

* Patient login and prescription history
* Hospital/pharmacy management dashboard
* Medicine inventory tracking
* Low-stock notifications
* Automatic dispenser hardware integration
* Prescription expiry and validation
* Dispensing history and audit logs
* Patient notifications
* Multi-language support
* Integration with hospital management systems

## Limitations

This project is intended for **learning and prototyping purposes**.

The current web application should not be treated as a complete medical dispensing system. A production system would need proper security, authentication, hardware safety mechanisms, inventory controls, testing, and compliance with applicable healthcare requirements.

## Author

**Tejansh Tiwari**

GitHub:
https://github.com/tejanshtiwari

## Contributing

Suggestions and improvements are welcome.

If you want to contribute, you can fork the repository, make your changes in a separate branch, and open a pull request.
