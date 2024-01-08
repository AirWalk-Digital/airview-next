import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

export function Tile({ name, url, image, description = "", isHero = false }) {
  return (
    <Grid item xs={12} sm={4} md={3} minHeight={300} maxWidth={300}>
      {/* // <div style={{ flexBasis: "100%", maxWidth: "100%", padding: "8px" }}> */}
      {/* sx={{ mb: '20px', display: 'flex', flex: 1 }}> */}
      <Link
        href={url}
        underline="none"
        sx={{
          width: "100%",
          color: "inherit",
          "&:visited": {
            color: "inherit",
          },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            minHeight: 120,
            height: "100%",
            bgcolor: image ? "background.paper" : "background.primary",
          }}
        >
          <CardActionArea>
            {image && (
              <div style={{ height: "194px" }}>
                <CardMedia
                  component="img"
                  // height="140px"
                  image={image}
                  alt=""
                  sx={{
                    height: "100%",
                    px: isHero ? 0 : 1,
                    py: isHero ? 0 : 2,
                    // width: isHero ? '100%' : 'unset', // Adjust width based on background
                    maxWidth: "100%",
                    objectFit: isHero ? "cover" : "contain", // Use 'contain' for white background
                  }}
                />
              </div>
            )}
            <CardContent
              sx={{
                mt: isHero ? 0 : 1,
                bgcolor: isHero ? "background.paper" : "background.primary",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ textAlign: "center", wordWrap: "break-word" }}
                color={image && isHero ? "text.primary" : "text.invtext"}
              >
                {name}
              </Typography>
              <Typography
                variant="body2"
                color={image && isHero ? "text.primary" : "text.invtext"}
              >
                {description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Grid>
  );
}

export function Tile22({ name, url, image, description = "", isHero = false }) {
  return (
    <Grid
      item
      xs={12}
      // sm={6}
      // md={4}
      // lg={3}
      // sx={{ mb: "20px", display: "flex" }}
    >
      <h1>{name}</h1>
    </Grid>
  );

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      sx={{ mb: "20px", display: "flex" }}
    >
      <Link href={url} underline="none" sx={{ width: "100%" }}>
        <Box
          sx={{
            position: "relative",
            bgcolor: image ? "background.paper" : "background.primary",
            boxShadow: 0,
            borderColor: "primary.main",
            border: 1,
            borderRadius: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {image && (
            <Box
              component="img"
              src={image}
              alt=""
              sx={{
                maxHeight: "140px",
                maxWidth: "100%",
                objectFit: "contain",
                mb: 1,
              }}
            />
          )}
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              color: image ? "text.primary" : "white",
              textAlign: "center",
              wordWrap: "break-word",
            }}
          >
            {name}
          </Typography>
        </Box>
      </Link>
    </Grid>
  );
}

export function ServiceTile({ frontmatter, file }) {
  return (
    <Grid item xs={3} md={3} sx={{ mb: "20px" }}>
      <Link href={file.replace("/index.mdx", "")} underline="none">
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 0,
            borderColor: "primary", //icon.color,
            border: 1,
            borderRadius: 2,
            p: 2,
            height: "100%",
            // minWidth: 300,
          }}
        >
          <Box sx={{ color: "text.primary", fontSize: 18, fontWeight: "400" }}>
            {frontmatter.title}
          </Box>
          <Box
            sx={{ color: "text.primary", fontSize: 14, fontWeight: "light" }}
          >
            {frontmatter.description}
          </Box>
          <Stack direction="row" spacing={1} sx={{ pt: "2%" }}>
            {frontmatter.status === "approved" ? (
              <Chip label="Approved for use" color="success" />
            ) : (
              <Chip label="Unapproved" color="error" />
            )}
          </Stack>
        </Box>
      </Link>
    </Grid>
  );
}
