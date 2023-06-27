import { getMenuStructureSolutions, getContent } from '@/lib/content/menuContent';
import { siteConfig } from "../../../site.config.js";
import { cacheRead, cacheSearch } from '@/lib/redis';

export default async function handler(req, res) {
  let collections = {}
  let relatedContent = {}
  const { cache } = req.query;
  if (cache) {

    const newPads = await cacheSearch('etherpad:*')
    // console.log('cache: ', newPads)

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

        // find parents
        // const parents = ['solutions', 'patterns', 'product', 'design', 'knowledge']
        const getListOfKeys = (data) => Object.keys(data);
        const parents = getListOfKeys(siteConfig.content);
        console.log('API:/api/structure:item', item)

        console.log('API:/api/structure:parents', parents)

        for (let y of parents) {
          if (item[y]) {
            let directory = item[y].includes("/") ? item[y].split("/")[1] : '';
            console.log('API:/api/structure:directory', directory)

            // Check if the key exists in the relatedContent object
            if (!relatedContent[directory]) {
              relatedContent[directory] = {};
            }
            // check we have a section for the type of parent
            if (!relatedContent[directory][item.collection]) {
              relatedContent[directory][item.collection] = [];
            }
            // add the related content
            relatedContent[directory][item.collection].push({
              label: item.title,
              url: item.url.startsWith('/') ? item.url : '/' + item.url,
            });
            // console.log('added: ', relatedContent, item)

          }
        }


      } catch (error) {
        console.error(error)
      }
      // console.log('meta: ', item);
    });

    // console.log('collections: ', collections)

    res.status(200).json({ collections, relatedContent })

  } else {
    try {
      let docs;
      if (req.query.collection) {
        docs = await getContent(siteConfig.content[req.query.collection])
      } else { // should be able to remove this!
        docs = await getMenuStructureSolutions(siteConfig);
      }
      // console.log('API:/api/structure:content[',req.query.collection, ']: ', docs)

      res.status(200).json({ docs })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
