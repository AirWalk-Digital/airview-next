import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

interface TileCardProps {
  name: string;
  url: string;
  image?: string;
  description?: string;
  isHero?: boolean;
}

const TileCard: React.FC<TileCardProps> = ({
  name,
  url,
  image,
  description = '',
  isHero = false,
}) => {
  return (
    <Grid item xs={12} sm={4} md={3} minHeight={300} maxWidth={300}>
      <Link
        href={url}
        underline="none"
        sx={{
          width: '100%',
          color: 'inherit',
          '&:visited': {
            color: 'inherit',
          },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            minHeight: 120,
            height: '100%',
            bgcolor: image ? 'background.paper' : 'background.primary',
          }}
        >
          <CardActionArea>
            {image && (
              <div style={{ height: '194px' }}>
                <CardMedia
                  component="img"
                  image={image}
                  alt=""
                  sx={{
                    height: '100%',
                    px: isHero ? 0 : 1,
                    py: isHero ? 0 : 2,
                    maxWidth: '100%',
                    objectFit: isHero ? 'cover' : 'contain',
                  }}
                />
              </div>
            )}
            <CardContent
              sx={{
                mt: isHero ? 0 : 1,
                bgcolor: isHero ? 'background.paper' : 'background.primary',
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ textAlign: 'center', wordWrap: 'break-word' }}
                color={image && isHero ? 'text.primary' : 'text.invtext'}
              >
                {name}
              </Typography>
              <Typography
                variant="body2"
                color={image && isHero ? 'text.primary' : 'text.invtext'}
              >
                {description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Grid>
  );
};

export default TileCard;
