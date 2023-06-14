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
      path: 'services'  // the base path for the content
    },
    providers: {
      source: 'github', // The source of the content
      repo: 'airwalk_patterns', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      branch: '1-rob-ellison',
      path: 'providers'  // the base path for the content
    },
    solutions: {
      source: 'github', // The source of the content
      repo: 'airview-demo-content', // The name of the repo
      owner: 'airwalk-digital', // The owner of the repo
      path: 'solutions'  // the base path for the content
    }
  }

}

export default siteConfig
