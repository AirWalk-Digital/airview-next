import { Box, Typography, Stack, Chip, Link, Grid } from '@mui/material';

export function Tile({ name, url, image }) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} sx={{ mb: '20px' }}>
      <Link href={url} underline="none">
        <Box
          sx={{
            position: 'relative',
            bgcolor: image ? 'background.paper' : 'background.primary', // Ensure this is the correct color value
            boxShadow: 0,
            borderColor: 'primary.main',
            border: 1,
            borderRadius: 2,
            p: 2,
            minHeight: 200, // Adjust based on your needs
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {image && (
            <Box
              component="img"
              src={image}
              alt={name}
              sx={{
                maxHeight: '140px', // Maximum height for images
                maxWidth: '100%',  // Maximum width for images
                objectFit: 'contain', // Adjusts the size of the image within the given dimensions
                mb: 1, // Margin between image and text
              }}
            />
          )}
          <Box
            sx={{
              mt: 2, // Margin top
              color: image ? 'text.primary' : 'white', // Explicit white color for text
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'center',
              wordWrap: 'break-word',
            }}
          >
            <Typography variant="h4" sx={{ color: image ? 'text.primary' :'white !important' }}>
              {name}
            </Typography>
          </Box>
        </Box>
      </Link>
    </Grid>
  );
}


export function ServiceTile({ frontmatter, file }) {

  return (
    <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
      <Link href={file.replace("/index.mdx", "")} underline="none"><Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 0,
          borderColor: 'primary', //icon.color,
          border: 1,
          borderRadius: 2,
          p: 2,
          // minWidth: 300,
        }}
      >
        <Box sx={{ color: 'text.primary', fontSize: 18, fontWeight: '400' }}>
          {frontmatter.title}
        </Box>
        <Box sx={{ color: 'text.primary', fontSize: 14, fontWeight: 'light' }}>
          {frontmatter.description}
        </Box>
        <Stack direction="row" spacing={1} sx={{ pt: '2%' }}>
          {frontmatter.status === 'approved' ? <Chip label="Approved for use" color="success" /> : <Chip label="Unapproved" color="error" />}
        </Stack>
      </Box>
      </Link>
    </Grid>
  )
}