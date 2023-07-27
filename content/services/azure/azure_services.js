const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Define the URL for Azure products page
const url = 'https://azure.microsoft.com/en-us/products/';

// Fetch the HTML content of the page
axios.get(url)
  .then(response => {
    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Find the sections containing Azure services
    const serviceSections = $('#products-list > .row');

    let sectionName = '';

    serviceSections.each((index, section) => {
      const $section = $(section);

      // Extract the section name
      const sectionNameElement = $section.find('h2.product-category');
      sectionName = sectionNameElement.length > 0 ? sectionNameElement.text().trim() : sectionName;

      // Find the service cards within the section
      const serviceCards = $section.find('.column.medium-6.end');

      serviceCards.each((index, card) => {
        const $card = $(card);

        // Extract the service name and description
        const serviceName = $card.find('h3.text-heading5 a span').text().trim();
        const serviceDescription = $card.find('p.text-body4').text().trim();

        // Create a folder for the service
        const folderName = serviceName.toLowerCase().replace(/ /g, '_');
        fs.mkdirSync(folderName, { recursive: true });

        // Create the index.mdx file
        const filePath = `${folderName}/index.mdx`;

        const frontmatter = `---
title: ${serviceName}
identifier: ${folderName}
category: ${sectionName}
csp: Azure
status: approved|pending|blocked
description: ${serviceDescription}
data_classification:
    - highly_restricted: TBD
    - internal: TBD
    - public: TBD
resilience:
    - availability: TBA
    - redundancy: TBA
auto-generated: true
---

${serviceDescription}`;


        // Check if the file already exists
        if (!fs.existsSync(filePath)) {

          fs.writeFileSync(filePath, frontmatter);

          // // console.log(`Created ${filePath}`);
        } else {
          // Read the existing file's content
          const existingContent = fs.readFileSync(filePath, 'utf-8');
          if (existingContent.includes('auto-generated')) {
            fs.writeFileSync(filePath, frontmatter);
            // // console.log(`Updated ${filePath}`);
          } else {
            // // console.log(`Skipped edited file ${filePath}`);
          }

        }
      });
    });

    // // console.log('File structure generation completed.');
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
