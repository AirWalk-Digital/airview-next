import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

export default function RelatedContent({ relevantDocs, selectedBotMessageId }) {
  // Filter relevantDocs based on selectedBotMessageId
  const filteredDocs = relevantDocs.filter((doc) => doc.id === selectedBotMessageId);

  return (
    <div>
      <h2>Related Documents</h2>
      {filteredDocs.length > 0 ? (
        filteredDocs.map((doc, index) => (
          <div key={index}>
            <h3>{doc.metadata.title}</h3>
            <p>{doc.pageContent}</p>
            <p>
              Source:{' '}
              <a href={doc.metadata.source} target="_blank" rel="noopener noreferrer">
                {doc.metadata.source}
              </a>
            </p>
            {index < filteredDocs.length - 1 && <Divider />}
          </div>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No related documents for the selected message.
        </Typography>
      )}
    </div>
  );
}