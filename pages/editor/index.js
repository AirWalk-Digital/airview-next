// You can use this code in a separate component that's imported in your pages.
// import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';
import { Editor } from "@/components/editor";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// const EditorStateContext = createContext();
// import store from "@/lib/redux/store";

export default function Page() {
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const owner = "airwalk-digital";
  const repo = "airwalk_patterns";
  const branch = "1-rob-ellison";
  const path = "README.md";

  const context = {
    source: "github",
    repo: "airwalk_patterns",
    owner: "airwalk-digital",
    branch: "1-rob-ellison",
    path: "knowledge",
    reference: "knowledge",
    file: "README.md",
    menu: { component: "DummyMenu", collection: null },
  };

  // const path = "/solutions/cloud_architecture/architecture_presentation.ppt.mdx";

  useEffect(() => {
    async function loadFile() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/content/github/${context.owner}/${context.repo}?branch=${context.branch}&path=${context.file}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setFileContent(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadFile();
  }, [owner, repo, branch, path]);

  const mkdown3 = `# heading 1`;

  const mkdown = `hello
<Alert param1="value1" param2="value2">test</Alert>
more
`;

  function callbackSave(content) {
    console.log("content: ", content);
    commitFileChanges(owner, repo, branch, path, content, "Airview commit");
    // const currentState = store.getState();
    // const reduxCollection = currentState.branch[collection];
    // console.log("Editor:context: ", context);
    // console.log("Editor:currentState: ", currentState);
    // console.log("Editor:reduxCollection: ", reduxCollection);
  }

  const EditorClient = dynamic(() => Promise.resolve(Editor), {
    ssr: true,
  });

  // const [markdown, setMarkdown] = useState('hello');

  return (
    <EditorClient
      markdown={fileContent}
      context={context}
      callbackSave={callbackSave}
    />
  );
}

async function commitFileChanges(owner, repo, branch, path, content, message) {
  try {
    const response = await fetch(
      `/api/content/github/${owner}/${repo}?branch=${branch}&path=${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, message }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Commit successful:", data);
  } catch (e) {
    console.error("Error committing file:", e.message);
  }
}
