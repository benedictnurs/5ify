<a href="https://5ify.vercel.app/">
  <h1 align="center">5ify</h1>
</a>

<p align="center">
  According to experts, anyone can complete a task if broken down into around 5 steps. Source? I'm the expert. My first time using TypeScript super deeply so I used some "outside sources". I learned a lot on CRUD, Webhooks and REST endpoints and integrated AI into my projects. 
</p>

<h1>How it Works</h1>
Listens for change and automatically updates the database I didn't want to create crazy schemas so I made the JSON into a str value in the user schema and then converted it to a JSON again to map it accordingly. It uses Google Gemini API to break down tasks and return a list that gets formatted into a JSON array to send to the frontend accordingly.
<br/>

## Introduction

Empower your tasks with the stack of Next.js 14, MongoDB, Clerk, Google Gemini and Shadcn/ui.
<br/>
All seamlessly integrated with 5ify to streamline tasks.

## Installation

1. Install dependencies using npm or pnpm:

```sh
npm install
```

2. Setup `.env.local` and update the variables for MongoDB, Clerk, and Gemini.

```sh
env.example.txt -> .env.local
```
Also, set up a Clerk account and connect Webhooks.
- [Clerk Sync](https://clerk.com/docs/users/sync-data-to-your-backend) – Clerk sync webhooks follow directions and use NGROK for local testing
- (If you want to deploy to Vercel turn off Vercel Authentication to allow webhook connection, and Caching to prevent dead UI)

3. Start the development server:

```sh
npm run dev
```

> [!NOTE]  
> I use [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) package for update this project.
>


### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Clerk](https://clerk.com/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [MongoDB](https://www.mongodb.com/) – Database to store user data securely.

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style

## Author

Created by [Benedict Nursalim](https://www.linkedin.com/in/benedict-nursalim/).
