import React from "react";
import { siteConfig } from "../../site.config.js";
import * as matter from "gray-matter";
import { getAllFiles, getFileContent } from "@/lib/github";
import { IndexView } from "@/components/services";

export default function Page({ providers, services }) {
  return <IndexView services={services} providers={providers} />;
}

export async function getServerSideProps(context) {
  // construct menu structure

  const providers = await getAllFiles(
    siteConfig.content.providers.owner,
    siteConfig.content.providers.repo,
    siteConfig.content.providers.branch,
    siteConfig.content.providers.path,
    true,
    ".md*"
  );

  const services = await getAllFiles(
    siteConfig.content.services.owner,
    siteConfig.content.services.repo,
    siteConfig.content.services.branch,
    siteConfig.content.services.path,
    true,
    ".md*"
  );

  // build page contents (Providers)
  const providersContent = await providers.map(async (file) => {
    const content = await getFileContent(
      siteConfig.content.providers.owner,
      siteConfig.content.providers.repo,
      siteConfig.content.providers.branch,
      file
    );
    const matterData = (() => { try { return matter(content, { excerpt: false }).data; } catch (error) { return {}; } })();
    return { file: file, frontmatter: matterData };
  });
  const servicesContent = await services.map(async (file) => {
    const content = await getFileContent(
      siteConfig.content.providers.owner,
      siteConfig.content.providers.repo,
      siteConfig.content.providers.branch,
      file
    );
    const matterData = (() => { try { return matter(content, { excerpt: false }).data; } catch (error) { return {}; } })();
    return { file: file, frontmatter: matterData };
  });

  return {
    props: {
      providers: await Promise.all(providersContent),
      services: await Promise.all(servicesContent),
    },
  };
}
