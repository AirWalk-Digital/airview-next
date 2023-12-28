import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

export default function RelatedContent() {
  const relatedItems = [
    { title: 'Related Article 1', description: 'Description of article 1' },
    { title: 'Related Article 2', description: 'Description of article 2' },
    // More items...
  ];

  return (
    <List component="nav">
      <Typography variant="h6" component="div">
        Related Content
      </Typography>
      <Divider />
      {relatedItems.map((item, index) => (
        <ListItem key={index} button>
          <ListItemText primary={item.title} secondary={item.description} />
        </ListItem>
      ))}
    </List>
  );
}
