import React from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Actions from './Actions';

export default function RelatedContent({ relevantDocs, selectedBotMessageId }) {
  // Filter relevantDocs based on selectedBotMessageId
  const filteredDocs = relevantDocs.filter((doc) => doc.id === selectedBotMessageId);

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
            {<Actions alignment='flex-begin' />}
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