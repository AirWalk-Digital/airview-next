import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

interface ServiceTileProps {
  frontmatter: {
    title: string;
    description: string;
    image: string;
  };
  file: string;
}

const ServiceTile: React.FC<ServiceTileProps> = ({ frontmatter, file }) => {
  return (
    <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
      <Link href={file.replace('/index.mdx', '')} underline="none">
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 0,
            borderColor: 'primary', // icon.color,
            border: 1,
            borderRadius: 2,
            p: 2,
            height: '100%',
            // minWidth: 300,
          }}
        >
          <Box sx={{ color: 'text.primary', fontSize: 18, fontWeight: '400' }}>
            {frontmatter.title}
          </Box>
          <Box
            sx={{ color: 'text.primary', fontSize: 14, fontWeight: 'light' }}
          >
            {frontmatter.description}
          </Box>
        </Box>
      </Link>
    </Grid>
  );
};

export default ServiceTile;
