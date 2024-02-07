import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Actions from './Actions';

export default function RelatedContent({ relevantDocs, selectedBotMessageId }) {
  // Define state to hold thumb up and thumb down status for each document
  const [docActions, setDocActions] = React.useState({});

  // Function to update thumb up and thumb down status for a specific document
  const handleDocAction = (docId, actionType) => {
    setDocActions(prevState => {
      const currentDocThumbState = prevState[docId] || { thumbUp: false, thumbDown: false };
      let updatedState;
  
      // Toggle logic
      if (actionType === 'thumbUp') {
        updatedState = {
          ...prevState,
          [docId]: {
            ...currentDocThumbState,
            thumbUp: !currentDocThumbState.thumbUp,
            thumbDown: currentDocThumbState.thumbUp ? currentDocThumbState.thumbDown : false,
          },
        };
      } else if (actionType === 'thumbDown') {
        updatedState = {
          ...prevState,
          [docId]: {
            ...currentDocThumbState,
            thumbUp: currentDocThumbState.thumbDown ? currentDocThumbState.thumbUp : false,
            thumbDown: !currentDocThumbState.thumbDown,
          },
        };
      }
  
      return updatedState;
    });
  };
  
  // Filter relevantDocs based on selectedBotMessageId
  const filteredDocs = relevantDocs.filter((doc) => doc.messageId === selectedBotMessageId);

  return (
    <div>
      <h2>Related Documents of the Selected Message</h2>
      {filteredDocs.length > 0 ? (
        filteredDocs.map((doc, index) => (
          <div key={doc.docId}>
            <h3>{doc.metadata.title}</h3>
            <p>{doc.pageContent}</p>
            <p>
              Source:{' '}
              <a href={doc.metadata.source} target="_blank" rel="noopener noreferrer">
                {doc.metadata.source}
              </a>
            </p>
            <Actions
              thumbUpClicked={docActions[doc.docId]?.thumbUp || false}
              thumbDownClicked={docActions[doc.docId]?.thumbDown || false}
              handleThumbUpClick={() => handleDocAction(doc.docId, 'thumbUp')}
              handleThumbDownClick={() => handleDocAction(doc.docId, 'thumbDown')}
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