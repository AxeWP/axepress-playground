# How to: Add Block Theme CSS support.

The following tutorial will walk you through adding Block Theme support to your Next.JS app.

> You can also follow along by reviewing this branch's [commit history](https://github.com/AxeWP/axepress-playground/commits/demo/block-theme-support)

## Prerequisites

- _See the [README.md](./README.md#prerequesites) for the project prerequisites._

## 1. Install and Activate your Block Theme in WordPress.

For this tutorial, we'll be using the new (as of writing) FrostWP Theme by @wpengine. You can download it from the [WordPress.org Theme Directory](https://wordpress.org/themes/frostwp/), or install it from the WordPress admin.

## 2. Add the Block Theme `style.css` to your Next.JS app.

While the promise of Block Themes is the reduction of Custom CSS files, that has still yet to be realized by WordPress. As such, we'll need to add any theme-specific CSS to our frontend.

In FrostWP, the theme css is [located in `frost/style.css`](https://github.com/wpengine/frost/blob/trunk/style.css). Copy this file over to your `styles/` directory in your Next.JS app. We'll be naming it `frost-theme.css`, but you can name it whatever you want.

## 3. Import the Block Theme CSS into your `index.css` file.

Now, we'll need to import this file into our `index.css` file, so the file is included in our build.

```diff
/* index.css */

/** Other imports (e.g. Tailwind)... */

/* Add your Theme CSS styles here*/
+ @import './frost-theme.css';

/* Your theme overrides */
@import './overrides.css';
```

## 4. (Optional) Add any overrides to your `overrides.css` file.

For example, images with the `size-full` css class are used to indicate that the image should be full width. To get this to play nicely with `next/image`, we can add the `position:relative` property to the `size-full` class.

This is the perfect use case for Tailwind's [utility classes](https://tailwindcss.com/docs/utility-first#app), which we can use with [the `apply` directive](https://tailwindcss.com/docs/functions-and-directives#apply).

```css
/* overrides.css */

.size-full {
	@apply relative;
}
```

## 5. Update your tailwind.config.js file to match theme.json

As of writing, there are no great ways to automatically use theme.json values to configure your backend project (we're working on it ;-) ). As such, we need to manually add these properties (e.g. colors, breakpoints) to our [tailwind config](https://tailwindcss.com/docs/configuration).

For this example, we'll keep it simple and just add the [colors](https://github.com/wpengine/frost/blob/trunk/theme.json#L77) and [breakpoints](https://github.com/wpengine/frost/blob/trunk/theme.json#L127).

```js
// tailwind.config.js
module.exports = {
	// rest of config.
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			// Add your theme colors here.
			base: '#ffffff',
			contrast: '#000000',
			primary: '#0000ff',
			secondary: '#000099',
			neutral: '#eeeeee',
		}
		screens: {
			// We use the theme.json 'layout' values, as well as inspect the style.css file to see what breakpoints are used.
			xs: '480px',   // Because _I_ want it ;-)
			md: '640px', // From theme.json
			lg: '800px', // from style.css
			xl: '1200px' // from theme.json

		}
	}
}
```

## 6. Thats it!

You now has the block theme CSS you need to match your frontend to your backend. Run `yarn dev` or `yarn build && yarn start` to see it in action.

**Note:** Whenever possible, we recommend using Block theme classes (e.g. `.has-base-color` or `has-text-align-center`) and [WordPress CSS Design Tokens](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#the-naming-schema-of-css-custom-properties) over their tailwind equivalents (e.g. `text-base` `.text-center` ). This will help ensure your frontend matches your backend as closely as possible.
