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
      collections: ['knowledge', 'designs']

    },
    providers: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: '1-rob-ellison',
      path: 'providers',  // the base path for the content
      collections: ['knowledge', 'designs', 'services']
    },
    solutions: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: '1-rob-ellison',
      path: 'solutions',  // the base path for the content
      collections: ['knowledge', 'designs']

    },
    knowledge: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: 'main',
      path: 'knowledge'  // the base path for the content
    },
    designs: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: 'main',
      path: 'designs',  // the base path for the content
      collections: ['knowledge']

    }

  }

}

export default siteConfig
