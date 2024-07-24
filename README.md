
# Next Airview

## Features
- 📝 Documentation as Code (via Github)
- ✍️ Collaborative editing (via Etherpad)
- 📽 React-based Slideshow
- ✍️ Write using Markdown, React components, even HTML!

## Getting Started

1. Clone the project: `git clone https://github.com/AirWalk-Digital/airview-next`
2. in VScode - "Open in Container" using remote containers [remote containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  2.1 Run `docker run -d --name redis -p 6379:6379 -p 8001:8001 redis/redis-stack:latest` to start redis container
3. Add required .env (see .env.example for content), github-app-private-key.pem, sharepoint-app-private-key.pem & .npmrc
  3.1 Access to aws portal is required to get the access keys from Secrets manger (.pem)
4. Install dependencies: `npm i`
5. Run the dev server: `npm run dev`
6. Run storybook: `npm run storybook`

### ✍️ Writing JSX

You can use JSX in [a few ways](https://mdxjs.com/getting-started) in your MDX files:

- You can use the syntax with HTML (`<button style={{ color: "red" }}>`)
- You can import React component from other files (`import Button from "../components/Button"`). Then you can use that component anywhere in that MDX file. The path to the component is relative to the MDX file.
- You can use any React component imported into the `<MDXProvider>` (inside `/components/MDXProvider.js`). This allows you to use the component without importing it inside each MDX file.
- You can define React components inside MDX files and then use them. MDX supports the use of JS inside files, like exporting variables, or in this case — defining new functions. `const Button = () => <button style={{ color: "red" }}>`

[Check out the MDX docs](https://mdxjs.com/getting-started) for more information on the syntax.


### Adding/replacing components in MDX

MDX allows you to use JSX inline or import components, but if you want to use a React component across all slides without importing it, you can use the `<MDXProvider>` component. This component wraps the app in a "context" that provides MDX with components to pass into the parser.

This also lets you replace Markdown parsed HTML elements with React components, like replacing `## Headings` with `<Heading as="h2">` instead of the default `<h2>`. This comes in handy if you have a React component library and you want to use it's primitives like `<Text>` for paragraphs.

You can pass new components, or swap HTML elements inside the `mdComponents` object in the `/components/MDXProvider.jsx` file:

```jsx
const mdComponents = {
  h1: (props) => <h1 {...props} />,
  CustomButton,
};
```
<!--  -->
