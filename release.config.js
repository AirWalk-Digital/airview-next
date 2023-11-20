// release.config.js
module.exports = {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true
    }
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      },
    ],
    [
      "@semantic-release-plus/docker",
      {
        name: {
          namespace: "airwalk-digital",
          repository: "airview-next",
        },
        "registry": "ghcr.io",
        skipLogin: true,
      },
    ],
    '@semantic-release/github',
  ]
}

