import { Box, Typography, Stack, Chip, Link, Grid } from '@mui/material';


export function Tile({ name, url, image }) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} sx={{ mb: '20px', display: 'flex' }}>
      <Link href={url} underline="none" sx={{ width: '100%' }}>
        <Box
          sx={{
            position: 'relative',
            bgcolor: image ? 'background.paper' : 'background.primary',
            boxShadow: 0,
            borderColor: 'primary.main',
            border: 1,
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%'
          }}
        >
          {image && (
            <Box
              component="img"
              src={image}
              alt={name}
              sx={{
                maxHeight: '140px',
                maxWidth: '100%',
                objectFit: 'contain',
                mb: 1,
              }}
            />
          )}
          <Typography variant="h5" sx={{ mt: 2, color: image ? 'text.primary' :'white', textAlign: 'center', wordWrap: 'break-word' }}>
            {name}
          </Typography>
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
          height: '100%'
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