// Note: This is a test page for MDX
import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";
import { MDXProvider } from "@mdx-js/react";
import { Example } from "@/components/Example";
import { evaluateSync } from "@mdx-js/mdx";
import React, { useEffect, useMemo, useState } from "react";

const opts = {
  ...provider,
  ...runtime,
};

function useMDX(source) {
  const [exports, setExports] = useState({ default: undefined });

  useEffect(() => {
    const processContent = () => {
      const exports = evaluateSync(source, {
        ...provider,
        ...runtime,
        //remarkPlugins: [remarkGfm],
        // rehypePlugins: [rehypeHighlight],
      });
      setExports(exports);
    };
    processContent();
  }, [source]);

  return exports.default;
}

// function MyComponent(props) {
//   const currentRoute = "knowledge/mdx_demo_simple";
//   const fileToFetch = `${currentRoute}/${props.file}`;
//   const [content, setContent] = useState(null);
//   useEffect(() => {
//     fetch(`/api/content/airwalk-digital/airview-demo-content/?path=${props.file}`)
//       .then((res) => res.json())
//       .then((data) => {
//         // const parsedContent = JSON.parse(data.content);
//         setContent(data.content);
//       });
//   }, []);
//   console.log(content);
//   return content && <>{content.data}</>;
// }

export default function Home() {
  const [content, setContent] = useState(null);
  const components = { Example };
//   const mdxStr = '<MyComponent file={"README.md"} />';
  useEffect(() => {
    fetch(`/api/content/airwalk-digital/airview-demo-content/?path=README.md`)
      .then((res) => res.json())
      .then((data) => {
        // const parsedContent = JSON.parse(data.content);
        setContent(data.content);
      });
  }, []);
  const Content = useMDX(content);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <MDXProvider components={components}>
          {Content && <Content />}
        </MDXProvider>
      </div>
    </main>
  );
}