// update Cache
import { siteConfig } from "../../../site.config.js";
import { getMenuStructure } from "@/lib/content";


export default async function handler(req, res) {
  try {
    for (let key in siteConfig.content) {
      let initialContext = siteConfig.content[key];
      console.log("API:update:collection: ", key);
      const collection = () => {
        if (initialContext.menu && initialContext.menu.collection) {
          console.debug('usePageContent:collection: ', siteConfig.content[siteConfig.content[initialContext.menu.collection].path])
          return siteConfig.content[siteConfig.content[initialContext.menu.collection].path]
        } else {
          console.debug('usePageContent:collection: ', initialContext)
          return initialContext
        }
      }
      const initialMenuStructure = await getMenuStructure(siteConfig, collection());
      

    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "error in api (/api/update): " + error,
      });
  }
}
