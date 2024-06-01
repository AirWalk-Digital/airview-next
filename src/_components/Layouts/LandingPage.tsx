'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { LinkCard } from '@/components/Cards';

import { siteConfig } from '../../../site.config';
import ScrollToBottom from './lib/ScrollToBottom';
import ScrollToTop from './lib/ScrollToTop';
import TopBar from './TopBar';

const LandingPage = () => {
  return (
    <>
      {' '}
      <TopBar navOpen={false} logo={false} />
      {/* Hero Section */}
      <section
        style={{
          marginTop: '50px',
          // // position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          // alignItems: 'center',
          justifyContent: 'flex-end',
          background: `url("/backgrounds/image17-bg.jpeg") no-repeat`,
          backgroundSize: 'auto 100%',
          backgroundPosition: 'right',
          backgroundAttachment: 'fixed',
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100vh' }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={12} sx={{ mb: '20px' }}>
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontWeight: 'bold', mt: '50px' }}
              >
                Airview
              </Typography>
              <Typography variant="h5" component="h5" gutterBottom>
                Documentation, Compliance and Control for Cloud.
              </Typography>
              <Button variant="contained" color="primary">
                Get Started
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={4} alignItems="stretch" sx={{ my: '0px' }}>
            {siteConfig.content.frameworks && (
              <LinkCard
                title="Frameworks & Standards"
                description="View the compliance frameworks that guide our IT policy as well as standards to help adoption."
                link="/docs/frameworks"
              />
            )}
            {siteConfig.content.services && (
              <LinkCard
                title="Providers & Services"
                description="View the catalogue of Services available, complete with patterns, implementation guides and quality controls."
                link="/docs/services"
              />
            )}
            {siteConfig.content.applications && (
              <LinkCard
                title="Applications"
                description="Browse the Applications deployed within our Organisation including documentation, knowledge and real-time compliance."
                link="/docs/applications"
              />
            )}
            {siteConfig.content.customers && (
              <LinkCard
                title="Customers & Projects"
                description="Customers and the projects we've done for them."
                link="/docs/customers"
              />
            )}
            {siteConfig.content.solutions && (
              <LinkCard
                title="Solutions"
                description="Solutions and Propositions."
                link="/docs/solutions"
              />
            )}
            {siteConfig.content.products && (
              <LinkCard
                title="Products"
                description="Products."
                link="/docs/products"
              />
            )}
          </Grid>
        </Container>
      </section>
      {/* Features Section */}
      <section
        style={{
          background: '#f5f5f5',
          display: 'flex',
        }}
      >
        <Container maxWidth="lg" sx={{ my: '20px' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h3" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                eu ipsum enim. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Morbi eu ipsum enim.
              </Typography>
              <Button variant="outlined" color="primary">
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </section>
      <ScrollToTop />
      <ScrollToBottom />
      {/* Other Sections */}
      {/* Add more sections with similar structure for the rest of the landing page content */}
    </>
  );
};

export default LandingPage;
