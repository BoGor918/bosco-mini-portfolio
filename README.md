# Bosco Mini Portfolio Website

This project is a dynamic and responsive personal portfolio website for CHEUNG Tsz Lai Bosco. It presents professional experience, education, projects, and skills in a clean and easy-to-navigate interface.

Built with React, TypeScript, Tailwind CSS, Mantine, and Firebase, the app focuses on maintainability, smooth UI behavior, and a modern dashboard editing workflow.

## Features

- Responsive layout for desktop and mobile devices
- Public portfolio sections for work experience, education, projects, and skills
- Dashboard CRUD workflow for content management
- Authentication with Firebase Auth
- Firestore-backed real-time data updates
- Multilingual UI support: English, Traditional Chinese, and Simplified Chinese
- Inline dashboard form validation with clear error feedback beside Submit or Update
- On-demand data loading for non-critical collections to improve initial load behavior

## Tech Stack

- Node.js
- React 18
- TypeScript
- Tailwind CSS
- Mantine
- Firebase Auth and Firestore
- Create React App

## Getting Started

### Prerequisites

- Install Node.js from [nodejs.org](https://nodejs.org/en/download)

### Environment variables

Create a .env.local file inside the bosco-mini-portfolio folder and configure:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Run the project locally

1. Open a terminal in the repository root.
1. Move into the application folder:

```bash
cd bosco-mini-portfolio
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm start
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

Inside the bosco-mini-portfolio folder, you can run:

- npm start: Runs the app in development mode
- npm run build: Builds the app for production
- npm test: Launches the test runner

## Project Structure

```text
root/
|-- README.md
|-- netlify.toml
`-- bosco-mini-portfolio/
    |-- .env.local
    |-- package.json
    |-- package-lock.json
    |-- tsconfig.json
    |-- tailwind.config.js
    |-- public/
    |-- src/
    |   |-- App.tsx
    |   |-- index.tsx
    |   |-- index.css
    |   |-- firebase.tsx
    |   |-- react-app-env.d.ts
    |   |-- components/
    |   |   |-- dashboard/
    |   |   |   |-- modals/
    |   |   |   `-- tables/
    |   |   |-- home/
    |   |   |   |-- grids/
    |   |   |   |-- main/
    |   |   |   `-- modals/
    |   |   |-- icon/
    |   |   |   `-- modals/
    |   |   |-- loading/
    |   |   `-- util.tsx
    |   |-- files/
    |   |-- globalVariable/
    |   |-- pages/
    |   |-- query/
    |   |-- types/
    `-- build/
```

## Deployment

The project is deployed on Netlify:

[https://cheungtszlai.netlify.app/](https://cheungtszlai.netlify.app/)
