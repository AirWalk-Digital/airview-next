import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import LikeActions from "./LikeActions";
import { useMDX } from "@/lib/content/mdx";

export default function RelatedContent({ relevantDocs, selectedBotMessageId }) {
  // Define state to hold thumb up and thumb down status for each document
  const [thumbState, setThumbState] = React.useState({});

  // Function to update thumb up and thumb down status for a specific document
  const handleLikeActions = (docId, actionType) => {
    setThumbState((prevState) => {
      const currentThumbState = prevState[docId] || {
        thumbUp: false,
        thumbDown: false,
      };
      let updatedState;

      // Toggle logic
      if (actionType === "thumbUp") {
        updatedState = {
          ...prevState,
          [docId]: {
            ...currentThumbState,
            thumbUp: !currentThumbState.thumbUp,
            thumbDown: currentThumbState.thumbUp
              ? currentThumbState.thumbDown
              : false,
          },
        };
      } else if (actionType === "thumbDown") {
        updatedState = {
          ...prevState,
          [docId]: {
            ...currentThumbState,
            thumbUp: currentThumbState.thumbDown
              ? currentThumbState.thumbUp
              : false,
            thumbDown: !currentThumbState.thumbDown,
          },
        };
      }

      return updatedState;
    });
  };

  // Filter relevantDocs based on selectedBotMessageId
  const filteredDocs = relevantDocs.filter(
    (doc) => doc.messageId === selectedBotMessageId
  );
  console.log("filteredDocs:", filteredDocs);
  return (
    <div>
      <h2>Related Documents</h2>
      {filteredDocs.length > 0 ? (
        filteredDocs.map((doc, index) => (
          <div key={doc.docId}>
            <h3>{doc.metadata.title}</h3>
            <MDXContent>{doc.pageContent}</MDXContent>
            <p>
              Source:{" "}
              <a
                href={doc.metadata.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.metadata.url}
              </a>
            </p>
            <LikeActions
              thumbUpClicked={thumbState[doc.docId]?.thumbUp || false}
              thumbDownClicked={thumbState[doc.docId]?.thumbDown || false}
              handleThumbUpClick={() => handleLikeActions(doc.docId, "thumbUp")}
              handleThumbDownClick={() =>
                handleLikeActions(doc.docId, "thumbDown")
              }
            />
            {index < filteredDocs.length - 1 && <Divider />}
          </div>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No related documents for this message.
        </Typography>
      )}
    </div>
  );
}

function MDXContent({ children }) {
  const [pageContent, setPageContent] = useState({
    content: undefined,
    frontmatter: undefined,
  });

  useEffect(() => {
    // process the rawcontent
    if (children) {
      const { mdxContent, frontmatter } = useMDX(children, "mdx");
      if (mdxContent && frontmatter) {
        setPageContent({ content: mdxContent, frontmatter: frontmatter });
      }
    }
  }, [children]);

  const Content = pageContent.content;

  if (pageContent.content) {
    return (
      <div>
        <Content />
      </div>
    );
  } else {
    return <div>....content loading</div>;
  }
}
