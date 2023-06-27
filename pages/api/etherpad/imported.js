// import { getMenuStructureSolutions, getContent } from '@/lib/content/menus';
// import { siteConfig } from "../../../site.config.js";
import { cacheRead, cacheSearch } from '@/lib/redis';


// return all imported pads

export default async function handler(req, res) {
  let collections = {}
  
    const newPads = await cacheSearch('etherpad:*')
    // console.log('cache: ', newPads)

    const padMeta = await Promise.all(newPads.map(item => cacheRead(item)));

    console.log('API:/api/etherpad/imported: ', padMeta)

    padMeta.forEach((item, index) => {
      item = JSON.parse(item);
      try {
        if (!collections[item.collection]) {
          collections[item.collection] = [];
        }
        collections[item.collection].push(
          item
        );

        
        

      } catch (error) {
        console.error(error)
      }
      // console.log('meta: ', item);
    });

    // console.log('collections: ', collections)

    res.status(200).json({ collections })

}
