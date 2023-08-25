import { getMenuStructureSolutions, getContent } from '@/lib/content/menuContent';
import { siteConfig } from "../../../site.config.js";
import { cacheRead, cacheSearch } from '@/lib/redis';
import path from 'path';

export default async function handler(req, res) {
  let collections = {}
  let relatedContent = {}
  const { cache } = req.query;
  if (cache) {

    const newPads = await cacheSearch('etherpad:*')
    // // console.log('cache: ', newPads)

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
        // console.log('API:/api/structure:parents', parents)

        // console.log('API:/api/structure:parents', parents)

        for (let key in siteConfig.content) {

          const y = siteConfig.content[key];

          if (item[y.reference]) {
            // let directory = item[y].includes("/") ? item[y].split("/")[1] : '';

            // let directory = path.dirname(item[y]);
            let directory = item[y.reference];
            // console.log('API:/api/structure:directory', directory, ' ; ', item[y])

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
            // // console.log('added: ', relatedContent, item)
            

          }
        }
        // collections[item.collection].children = findChildren(padMeta, item);

      } catch (error) {
        console.error(error)
      }
      // // console.log('meta: ', item);
    });


    // // console.log('collections: ', collections)

    res.status(200).json({ collections, relatedContent })

  } else {
    try {
      let docs;
      if (req.query.collection) {
        docs = await getContent(siteConfig.content[req.query.collection])
      } else { // should be able to remove this!
        docs = await getMenuStructureSolutions(siteConfig);
      }
      // // console.log('API:/api/structure:content[',req.query.collection, ']: ', docs)

      res.status(200).json({ docs })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}


function findChildren(padMeta, parentItem) {
    let itemChildren = {};
    // 2nd pass to add children
    padMeta.forEach((item, index) => {
      item = JSON.parse(item);

      
      try {
        

        // find parents
        // const parents = ['solutions', 'patterns', 'product', 'design', 'knowledge']
        const getListOfKeys = (data) => Object.keys(data);
        const parents = getListOfKeys(siteConfig.content);
        // console.log('API:/api/structure:item', item)

        // console.log('API:/api/structure:parents', parents)

        for (let y of parents) {
          if (item[y]) {

            console.log('findChildren: ', item, ': ', parentItem.url)


            let directory = item[y].includes("/") ? item[y].split("/")[1] : '';
            let parentDirectory = parentItem.url.includes("/") ? parentItem.url.split("/")[1] : '';
            if (item[y] !== parentDirectory) {
              return; // Use 'return' to skip to the next iteration instead of 'continue'
            }

            // Check if the key exists in the itemChildren object
            if (!itemChildren[directory]) {
              itemChildren[directory] = [];
            }
            // check we have a section for the type of parent
            // if (!itemChildren[directory][item.collection]) {
            //   itemChildren[directory][item.collection] = [];
            // }
            // add the related content
            itemChildren[directory].push({
              label: item.title,
              url: item.url.startsWith('/') ? item.url : '/' + item.url,
            });
            // // console.log('added: ', itemChildren, item)
            
          }
        }


      } catch (error) {
        console.error(error)
      }
      // // console.log('meta: ', item);
    });
    console.log('findChildren:itemChildren ', itemChildren)
    return itemChildren

}