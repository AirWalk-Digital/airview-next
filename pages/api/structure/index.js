import { getMenuStructureSolutions } from '@/lib/content/menus';
import { siteConfig } from "../../../site.config.js";
import { cacheRead, cacheSearch } from '@/lib/redis';

export default async function handler(req, res) {
  let collections = {}
  const { cache } = req.query;
  if (cache) {

    const menuStructureGit = await getMenuStructureSolutions(siteConfig);

    const newPads = await cacheSearch('etherpad:new:*')
    console.log('cache: ', newPads)

    const padMeta = await Promise.all(newPads.map(item => cacheRead(item)));

    padMeta.forEach((item, index) => {
      item = JSON.parse(item);
      try {
        if (!collections[item.collection]) {
          collections[item.collection] = [];
        }
        collections[item.collection].push({
          label: item.title,
          url: item.url
        });
      } catch (error) {
        console.error(error)
      }
      console.log('meta: ', item);
    });

    console.log('collections: ', collections)

    res.status(200).json({collections})

  } else {
    try {
      const menuStructure = await getMenuStructureSolutions(siteConfig);
      res.status(200).json({ menuStructure })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
