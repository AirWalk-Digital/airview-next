import { getContent } from '../components/utils/mdxContent';
import { Header, Banner, Footer } from '../components/HeaderFooter';
import Box from '@mui/material/Box';

export const DefaultLayout = ({ children, sx = {} }) => {
    let banner = '';
    let header = getContent('h1', children); //just match h1 for the heading
    children = header.children;
    if (header.element) { // there must be a header to have a banner
      banner = getContent('h2', header.children)
      children = banner.children;
    }; // h2 text after the heading
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", py: "0", height: '100%', ...sx}} >
      <Header heading={header.element} />
      {banner.element && <Banner text={banner.element} />}
      <Box sx={{ display: "flex", flexDirection: "column", px: "2.5%", py: '20px', overflow: 'hidden'}} >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
