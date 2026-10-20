# React To-Do App

A simple to-do app built with React. Add, edit, complete, and delete tasks, and filter by status. Tasks are saved in your browser.

## Features

- Add tasks (press Enter or click **Add task**)
- Mark tasks as done
- Edit a task by double-clicking it
- Delete a task
- Filter by All, Active, or Done
- Clear all completed tasks
- Saves tasks in `localStorage`, so they survive a refresh
- Light and dark mode, following your system setting

## Tech Stack

- React 18 (hooks: `useState`, `useEffect`)
- Babel Standalone (compiles JSX in the browser)
- Plain CSS with CSS variables for theming

## Getting Started

No build step or installation is needed.

1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. Open `index.html` in your browser.

To serve it locally instead:

```bash
npx serve .
```

## Project Structure

```
.
├── index.html   # App markup, styles, and React code
└── README.md
```

## How It Works

- Tasks are stored in React state as `{ id, text, done }` objects.
- A `useEffect` hook writes the task list to `localStorage` whenever it changes.
- The initial state is loaded from `localStorage` on first render.
- The filter and the "left to do" count are derived from the task list.

## Possible Improvements

- Due dates and priorities
- Drag-and-drop reordering
- Backend API (Spring Boot + PostgreSQL) for syncing across devices
- User authentication
- Migrate to Vite for a production build

## License

MIT