const https = require('https');
const fs = require('fs');

// Fetch the list of Azure services
function fetchAzureServices() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'management.azure.com',
      path: '/providers?api-version=2020-01-01',
      method: 'GET'
    };

    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(data);

          if (result && result.value) {
            const azureServices = result.value.map(provider => {
              return provider.resourceTypes.map(resourceType => {
                return {
                  name: resourceType.displayName,
                  identifier: resourceType.resourceType,
                  description: resourceType.description || '',
                };
              });
            }).flat();

            resolve(azureServices);
          } else {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Failed to fetch Azure services. Status code: ${res.statusCode}`));
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
}

// Create the file structure
async function createFileStructure() {
  const azureServices = await fetchAzureServices();

  azureServices.forEach(service => {
    const folderName = service.name.toLowerCase().replace(/ /g, '_');
    const filePath = `${folderName}/index.mdx`;

    // Create the folder
    fs.mkdirSync(folderName, { recursive: true });

    // Create the index.mdx file
    const frontmatter = `---
title: ${service.name}
identifier: ${service.identifier}
approved: false
---

${service.description}`;

    fs.writeFileSync(filePath, frontmatter);

    console.log(`Created ${filePath}`);
  });

  console.log('File structure generation completed.');
}

// Run the script
createFileStructure().catch(error => {
  console.error('An error occurred:', error);
});
