# AxePress Labs - Playground 🧪

AxePress Labs - Playground is an example Next.JS app that uses WPGraphQL and Faust.js to experiment with headless WordPress patterns.

⚠️ Code in this repository is highly experimental and subject to change. It should be used for inspiration and educational purposes only. **DO NOT RUN ON PRODUCTION**⚠️

## Feature Demos

- [Add Block Theme Support](https://github.com/axewp/axepress-playground/blob/demo/block-theme-support/HowTo.md)
- [Add Server Side Authentication](https://github.com/AxeWP/axepress-playground/blob/demo/server-side-auth/HowTo.md) (📢 WPEBuilders click here! )

## Prerequisites

- Node 16+
- WordPress 6.0+ with the following plugins installed and activated:
  - [WPGraphQL 1.14+](https://wordpress.org/plugins/wp-graphql/)
  - [Faust 0.8.6+](https://github.com/wpengine/faustjs)
  - [Rank Math SEO 1.0.100+](https://wordpress.org/plugins/seo-by-rank-math/)
  - [WPGraphQL Content Blocks 0.2.0](https://github.com/wpengine/wp-graphql-content-blocks)
  - [WPGraphQL for Rank Math SEO 0.0.11](https://github.com/axewp/wp-graphql-rank-math-seo)
  - [WPGraphQL for FSE (experimental)](https://github.com/axewp/wp-graphql-fse)
  - A Block Theme (e.g. [Twenty Twenty-Three](https://wordpress.org/themes/twentytwentythree/))

## What's Included
- A Next.JS app that uses Faust.js to fetch data WPGraphQL.
- TypeScript linting and hinting with `graphql-codegen`. (Note: there are still some type errors so `strict` is false in tsconfig.json for now).
- ESLint rules configured for WordPress Coding Standards.
- Advanced developer logging of ApolloClient queries and mutations.
- WP Template Hierarchy support with Faust.js's `wp-templates`.
- Site Editor support (experimental) for Headers, Footers, and content.
- A better `DefaultBlock` that doesn't rely on `dangerouslySetInnerHTML`.
- TailwindCSS for when the `globalStylesheet` and block styles aren't enough.
- SEO support using Rank Math SEO and `next-seo`.
- RSS Feeds ( in case any @wpengine DevRel peeps are looking 😜 ).
- PWA support with `next-pwa`.
- External script support with `partytown`.

## Getting Started
- Run `npm install` or `yarn install` to install dependencies.
- Copy `.env.example` to `.env` and update the values to match your environment. (See Faust.js Getting started).
- Copy the Block Theme `style.css` file to the project. ([How to](https://github.com/axewp/axepress-playground/blob/demo/block-theme-support/HowTo.md))
- Update tailwind.config.js to match your theme's colors, and apply any overrides you need in `src/styles/overrides.css`.
- Run `npm run dev` or `yarn dev` to start the development server. (This will run `yarn prepare` which generates the types from GraphQL).
- Start developing!
