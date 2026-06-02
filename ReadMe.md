# Supa Shoppa

A little something by Mnotho.

Supa Shoppa is an Expo React Native groceries app focused on browsing products, adding items to a basket, reviewing order totals, and getting AI-assisted grocery guidance.

## What The App Does

- Loads grocery products from `src/assets/products.json` through a mocked saga API call.
- Shows a shop screen with address context, debounced search, loading placeholders, and category filters.
- Lets users add, increment, decrement, and remove cart items.
- Shows a cart tab basket total indicator.
- Shows cart empty state, delivery address, free-delivery progress, payment summary, and checkout threshold messaging.
- Shows product details with AI enriched product information through React Query.
- Shows an AI Health Coach card in the cart that fetches personalised basket tips on button press.

## Tech Stack

- Expo SDK 51
- React Native 0.74
- Redux Toolkit and Redux Saga for grocery/cart state
- Redux Persist for cart persistence
- React Query for AI detail and basket health requests
- i18n-js for translations
- Axios for API calls
- Jest and React Native Testing Library for tests

## Getting Started

1. Install dependencies:

   ```sh
   yarn
   ```

   or:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root by copying `.env.example`:

   ```sh
   cp .env.example .env
   ```

   Then confirm `.env` contains the expected API base URL:

   ```env
   BASE_URL=https://us-central1-tidyup-390617.cloudfunctions.net
   ```

   The API client expects these endpoints under `BASE_URL`:
   - `POST /productAiDetails`
   - `POST /healthCoachSuggestions`

   Keep `.env` local to your machine and update `.env.example` only when the required environment variables change.

3. Start Expo:

   ```sh
   yarn start
   ```

   or:

   ```sh
   npm run start
   ```

4. Make sure you are running Expo Go. If Expo starts in development build mode, press `s` in the terminal to switch to Expo Go.

5. Scan the QR code with a physical device or choose one of the simulator options from the Expo terminal.

## Tests

Run the test suite with:

```sh
NODE_ENV=test npx jest --runInBand --no-cache --watchman=false
```

Type-check with:

```sh
npx tsc --noEmit
```

## Product Data

The current product catalogue is stored locally in:

```txt
src/assets/products.json
```

The app intentionally fetches that file through `redux-saga` with a short delay to mimic a real API call. Search also uses a short debounce/loading state so the UI behaves closer to a network-backed grocery catalogue.

## AI Features

The AI features are additive: the core grocery and cart flows still work with local product data, while richer context comes from API-backed AI endpoints.

- Product AI details: the PDP uses `useProductAiDetails(product)` to request enriched product copy, AI summary, benefits, serving ideas, tags, storage tips, and generated/AI-selected imagery.
- Basket Health Coach: the cart uses `useBasketHealthCoach(basket, false)` and only fetches suggestions after the user taps `Get tips`.
- The health coach sends the cart contents, including item quantities, so basket guidance can be based on what the user is actually buying.

Future AI possibilities:

- Speech-to-text grocery search so users can say “bananas and milk” instead of typing.
- AI meal builder that takes the current basket and suggests meals, missing ingredients, prep time, and healthier swaps.
- Allergy, budget, and dietary preference filters for both search and basket coaching.
- Weekly basket planning that converts meal ideas into cart-ready grocery lists.

## Assumptions

- The app is currently focused on grocery delivery orders.
- Delivery fee is assumed to be a flat `R2.00`.
- Free delivery is unlocked once the basket reaches `R10.00`.
- Checkout is enabled once the basket reaches `R5.00`.
- The delivery address is currently hardcoded and cannot be changed.
- Product data is local JSON, but loaded through a mocked saga call to demonstrate the intended API shape.
- Product categories are inferred from product names where the JSON product has no explicit category.
- Cart state is persisted locally; products are reloaded from the mocked product source.
- AI endpoints are assumed to exist behind `BASE_URL`. Without those endpoints, the AI detail and health coach requests will fail, but the normal grocery flow remains usable.
- Prices are displayed in South African Rand.

## Expo Note

This is currently an Expo Go build. It can be turned into a development build if native-only libraries are needed, and EAS can then be used for internal distribution or store builds.
