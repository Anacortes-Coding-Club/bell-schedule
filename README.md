# AHS Schedule Builder

Computes a bell schedule, attempting to make equal-length class duration.

Does not have any sort of persistance, but you can add templates to `src/lib/templates.json`.

Assumptions: A split lunch, 30m in length, during one period.


## [Svelte](https://svelte.dev/docs/introduction) instructions

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

### Developing

Installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
