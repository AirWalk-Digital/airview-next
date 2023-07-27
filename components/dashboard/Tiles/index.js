import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Box } from '@mui/material';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'

export function Tile({ name, url, image }) {
  return (
    <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
      <Link href={url} underline="none">
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            boxShadow: 0,
            borderColor: 'primary',
            border: 1,
            borderRadius: 2,
            p: 2,
            minHeight: 300,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: '20px', // Adjust the desired spacing here
              left: '20px', // Adjust the desired spacing here
              right: '20px', // Adjust the desired spacing here
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
           {image && <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '100%' }} /> }
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: image ? 0 : 75,
              left: 0,
              right: 0,
              p: 2,
              textAlign: 'center',
              color: 'text.primary',
              fontSize: 24,
              fontWeight: 'medium',
            }}
          >
            {name}
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