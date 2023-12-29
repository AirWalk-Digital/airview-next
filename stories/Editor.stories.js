import React, { useEffect, useState } from "react";
import { Editor } from "@/components/editor";

// import DummyMDX from './DummyMDX.txt';

// import mdxContent from './_DummyMDX.mdx';

export default {
  title: "Content/Editor",
  component: Editor,
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

  const [mdxContent, setMdxContent] = useState("");

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
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href =
      "https://unpkg.com/@mdxeditor/editor@1.14.3/dist/style.css";
    document.head.appendChild(styleLink);
    fetch("/ExampleMDX.mdx")
      .then((response) => response.text())
      .then((text) => setMdxContent(text));
  }, []);

  return <Editor {...args} markdown={mdxContent} callbackSave={dummyFunction}  />;
};

export const Default = Template.bind({});
Default.args = {
  context: dummyContext,
  enabled: true,
  top: 0,
  result: 'success'
};

export const APIError = Template.bind({});
APIError.args = {
  context: dummyContext,
  enabled: true,
  top: 0,
  result: 'error'
};
