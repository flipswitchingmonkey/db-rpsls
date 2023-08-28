# Rock Paper Scissors and some more

## Quick Start
https://db-rpsls.vercel.app

### Desktop view
![CleanShot 2023-08-27 at 16 42 12](https://github.com/flipswitchingmonkey/db-rpsls/assets/6930367/726074b0-ab81-4a34-9bf7-fdf079fa4c79)

### Mobile view
![CleanShot 2023-08-27 at 16 42 59](https://github.com/flipswitchingmonkey/db-rpsls/assets/6930367/22c646ab-833b-48f5-89e5-7221811cf052)

## Running locally

### Development
This project is using Vite for building and development. To get started:

```bash
pnpm install
pnpm run dev
```

### Build

```bash
pnpm install
pnpm run build
pnpm run preview (optional)
```

The finished build can be found inside the `/dist` folder.

### Testing

To run unit tests:

```bash
pnpm run test
```

For e2e tests using Playwright:

```bash
pnpm run test:e2e
```

Tests can also be run on Github through a [Github Action](https://github.com/flipswitchingmonkey/db-rpsls/actions/workflows/tests.yml)

## How to play

This game follows the simple rules of Rock, Paper, Scissors, with extra "Weapons" as described here: https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons

At first start, Player One is a human player, while Player Two is the computer. This can be changed for each player by clicking on the Human/Computer toggle:
![CleanShot 2023-08-27 at 16 44 20](https://github.com/flipswitchingmonkey/db-rpsls/assets/6930367/7ccc34b2-6a53-4dea-b450-224ccb78e4d2)

A round is played by the human player(s) selecting a "weapon" to play with (by clicking on the corresponding icon). Once clicked, the computer will then also select its weapon and a winner is found!

If playing yourself is just TOO MUCH FUN for you to handle, you can also turn both players into computer players. In that case, the robot button will start the game and the computer will play by itself.
![CleanShot 2023-08-27 at 16 46 55](https://github.com/flipswitchingmonkey/db-rpsls/assets/6930367/0fc8949a-4388-458e-8175-e3fd534acdee)

The `Show History` button will show you all previously played rounds. All your results persist on your browser until you press the `Reset Score` button, upon which all scores are reset and you will start again at round 1.

## Design Notes

- The layout has a desktop and mobile mode, with the desktop mode being the preferred layout
- No external libraries are used, all code is using plain JS and HTML, using Web Components and plain CSS
- Everything runs in the browser
- For development, all code uses Typescript, tests are run using Vitest and Playwright
- For building and as dev server, Vite is being used
- All modern browsers should be support
- Layout on mobile with extreme screen ratios may be dodgy...
- State and play history are stored in localStorage
- SVG Icons are courtesy of Fontawesome's Icon Libray `Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.`
