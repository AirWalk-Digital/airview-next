
import React, { useState, useEffect } from 'react'
import { siteConfig } from "../../site.config.js";
import { mdComponents } from "../../constants/mdxProvider";
import * as matter from 'gray-matter';
import { parse } from 'toml';
import { MDXProvider } from '@mdx-js/react';
import { getAllFiles, getFileContent } from '@/lib/github'
import { useMDX } from '@/lib/content/mdx'

import { ServicesView } from '@/components/services'

import { FullScreenSpinner } from '@/components/dashboard/index.js';
import { dirname, basename } from 'path';

export default function Page({ providers, services, content, file, controls }) {
  const [pageContent, setContent] = useState({ content: undefined, frontmatter: undefined });

  useEffect(() => {
    const { mdxContent, frontmatter } = useMDX(content);
    setContent({ content: mdxContent, frontmatter: frontmatter });
  }, [content])

  const context = { file: file, ...siteConfig.content.services };

  if (pageContent.content && pageContent.frontmatter) {
    const Content = pageContent.content;
    return <ServicesView services={services} providers={providers} controls={controls} frontmatter={pageContent.frontmatter}>
      <MDXProvider components={mdComponents(context)}>
        <Content />
      </MDXProvider>
    </ServicesView>
  } else {
    return <FullScreenSpinner />
  }
};




export async function getStaticPaths() {
  let pages = [];
  try {
    const services = await getAllFiles(siteConfig.content.services.owner, siteConfig.content.services.repo, siteConfig.content.services.branch, siteConfig.content.services.path, true, '.md*');
    // const pages = services.map((file) => {
    //   return file
    // })
    pages = services
      .filter((file) => basename(file) !== 'README.md')
      .map((file) => { return '/' + file });

    return {
      fallback: true,
      paths: pages
    }
  } catch (error) {
    console.error(error)
    return {
      fallback: true,
      paths: pages
    }
  }


}



export async function getStaticProps(context) {

  // // console.log(context.params.service)


  // construct menu structure
  const providers = await getAllFiles(siteConfig.content.providers.owner, siteConfig.content.providers.repo, siteConfig.content.providers.branch, siteConfig.content.providers.path, true, '.md*');

  const services = await getAllFiles(siteConfig.content.services.owner, siteConfig.content.services.repo, siteConfig.content.services.branch, siteConfig.content.services.path, true, '.md*');
  // build page contents (Providers)    
  const providersContent = await providers.map(async (file) => {
    const content = await getFileContent(siteConfig.content.providers.owner, siteConfig.content.providers.repo, siteConfig.content.providers.branch, file);
    const matterData = matter(content, { excerpt: false }).data;
    return { file: file, frontmatter: matterData };

  });
  const servicesContent = await services.map(async (file) => {
    const content = await getFileContent(siteConfig.content.providers.owner, siteConfig.content.providers.repo, siteConfig.content.providers.branch, file);
    const matterData = matter(content, { excerpt: false }).data;
    return { file: file, frontmatter: matterData };

  });

  const file = 'services/' + context.params.service.join('/')
  const pageContent = await getFileContent(siteConfig.content.services.owner, siteConfig.content.services.repo, siteConfig.content.services.branch, file);
  const pageContentText = Buffer.from(pageContent).toString("utf-8")

  // controls
  const controlLocation = siteConfig.content.services.path + '/' + dirname(context.params.service.join('/'));
  console.log('controlLocation: ', controlLocation)

  const controlFiles = await getAllFiles(siteConfig.content.services.owner, siteConfig.content.services.repo, siteConfig.content.services.branch, controlLocation, true, '.toml')
  // const files = await getAllFiles(controlLocation, '/**/*.toml');
  console.log('files: ', controlFiles)
  const controlContent = controlFiles.map(async (file) => {
    const content = await getFileContent(siteConfig.content.services.owner, siteConfig.content.services.repo, siteConfig.content.services.branch, file);
    return { data: parse(content), file: file };
  
  });


  return {
    props: {
      providers: await Promise.all(providersContent),
      services: await Promise.all(servicesContent),
      content: pageContentText || null,
      file: file,
      controls: await Promise.all(controlContent)
    },
  };
}

