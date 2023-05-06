module.exports = {
    branches: ['main']
    plugins: [
      ['@codedependant/semantic-release-docker', {
        dockerTags: ['latest', '{{version}}', '{{major}}-latest', '{{major}}.{{minor}}'],
        dockerImage: 'mdx-deck',
        dockerFile: 'Dockerfile',
        dockerRegistry: 'ghcr.io',
        dockerProject: 'airwalk-digital',
        dockerArgs: {
          API_TOKEN: true
        , RELEASE_DATE: new Date().toISOString()
        , RELEASE_VERSION: '{{next.version}}'
        }
      }]
    ]
  }