export const siteConfig = {
  title: `Airview`,
  company: `airwalkreply.com`,
  tagline: `technology, done right`,
  content: {
    services: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: '1-rob-ellison',
      path: 'services',  // the base path for the content
      reference: 'service', // how the collection is referred to in frontmatter links
      collections: ['knowledge', 'designs']

    },
    providers: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: '1-rob-ellison',
      path: 'providers',  // the base path for the content
      reference: 'provider', // how the collection is referred to in frontmatter links
      collections: ['services']
    },
    solutions: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: '1-rob-ellison',
      path: 'solutions',  // the base path for the content
      reference: 'solution', // how the collection is referred to in frontmatter links
      collections: ['knowledge', 'designs']

    },
    knowledge: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: 'main',
      path: 'knowledge',  // the base path for the content
      reference: 'knowledge', // how the collection is referred to in frontmatter links
    },
    designs: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: 'main',
      path: 'designs',  // the base path for the content
      reference: 'design', // how the collection is referred to in frontmatter links
      collections: ['knowledge']
    },
    customers: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: 'main',
      path: 'customers',  // the base path for the content
      reference: 'customer', // how the collection is referred to in frontmatter links
      collections: ['knowledge', 'projects']
    },
    projects: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: 'main',
      path: 'projects',  // the base path for the content
      reference: 'project', // how the collection is referred to in frontmatter links
      collections: ['knowledge']
    },
    applications: { source: 'static'},
    frameworks: { source: 'static'}
  }

}

export default siteConfig
