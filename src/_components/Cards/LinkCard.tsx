import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';

interface LinkCardProps {
  title: string;
  description: string;
  link: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ title, description, link }) => {
  return (
    <Grid item xs={4} md={4}>
      <Paper
        variant="outlined"
        sx={{
          height: '100%',
          borderRadius: '16px',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" component="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {description}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
          <Link href={link} sx={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ display: 'block', mt: '3%' }}
            >
              View
            </Button>
          </Link>
        </Box>
      </Paper>
    </Grid>
  );
};

export default LinkCard;
