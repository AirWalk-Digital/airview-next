import React, { useEffect, useState } from "react";
// import { Editor } from "@/components/editor";
import { useMDX } from "@/lib/content/mdx";
import { WrapMDX} from './mdx/utils/mdxify';
import { MDXProvider } from "@mdx-js/react";
import { mdComponents } from '../constants/mdxProvider.js';
// import DummyMDX from './DummyMDX.txt';

// import mdxContent from './_DummyMDX.mdx';

export default {
  title: "Content/Viewer",
  // component: Wrapper,
};

const DummyMDX = `---`;

const dummyContext = {
  source: "github",
  repo: "airwalk_patterns",
  owner: "airwalk-digital",
  base_branch: "main",
  branch: "main",
  path: "providers",
  reference: "provider",
  collections: ["services"],
};


const Template = (args) => {

  const [mdxContent, setMdxContent] = useState();

  async function dummyFunction() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(2000);
    switch (args.result) {
      case 'success':
        break;
      case 'error':
        throw new Error('An error occurred');
    }

  }
    
  useEffect(() => {
    // Function to fetch and process MDX content
    const fetchAndProcessMDX = async () => {
      try {
        const response = await fetch(args.file);
        const text = await response.text();
        // console.log('text: ', text)
        // const { mdxContent, frontmatter } = useMDX(text, "mdx"); // Assuming useMDX is a synchronous function
        // console.log('mdxContent: ', mdxContent)
        setMdxContent(text);
      } catch (error) {
        console.error("Error fetching MDX content:", error);
      }
    };

    fetchAndProcessMDX();

  }, [args.file]); // Depend on args.file  const Page = mdxContent ;
  
if (mdxContent) {
  const Page = mdxContent ;
console.log('mdxContent: ', mdxContent)
  
  return (mdxContent && <WrapMDX context={args.context}>{mdxContent}</WrapMDX>)
} else {
  return <div>Loading...</div>
}
  // return <Editor {...args} markdown={mdxContent} callbackSave={dummyFunction}  />;
};

export const Default = Template.bind({});
Default.args = {
  file: "/ExampleMDX.mdx",
  context: dummyContext,
  enabled: true,
  top: 0,
  result: 'success'
};

export const APIError = Template.bind({});
APIError.args = {
  file: "/ExampleMDX.mdx",
  context: dummyContext,
  enabled: true,
  top: 0,
  result: 'error'
};
