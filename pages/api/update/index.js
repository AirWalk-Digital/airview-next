// update Cache
import { siteConfig } from "../../../site.config.js";
import { getMenuStructure } from "@/lib/content";


export default async function handler(req, res) {
  try {
    // Check if the request is a POST request and if the event is a push to the main branch
    if (req.method === 'POST' && req.headers['x-github-event'] === 'push' && req.body.ref === 'refs/heads/main') {
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

      res.status(200).json({ 
        status: "success", 
        headers: req.headers, 
        payload: req.body 
      });
    } else {
      res.status(400).json({ error: "Invalid request", headers: req.headers, 
      payload: req.body });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "error in api (/api/update): " + error,
      });
  }
}