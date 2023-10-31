// You can use this code in a separate component that's imported in your pages.
// import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';
import Editor from '@/components/editor'
import { useState, useEffect } from "react";

export default function Page() {
  const [markdown, setMarkdown] = useState('hello<Alert>test</Alert>');



const EditorClient = dynamic(() => Promise.resolve(Editor), {
  ssr: true,
});

  // const [markdown, setMarkdown] = useState('hello');

  return (
    <EditorClient markdown={markdown} context={[]}/>
  )
}