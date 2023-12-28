import { getMenuStructure } from "@/lib/content";
import { siteConfig } from "../../../site.config.js";
import { cacheRead, cacheSearch } from "@/lib/redis";
import path from "path";

export default async function handler(req, res) {
  try {
    const { collection: collectionName } = req.query;

    if (!collectionName || typeof collectionName !== "string") {
      res.status(400).json({ error: "Missing required parameter: collection" });
      return;
    }

    const collection = siteConfig.content[collectionName];

    if (!collection || typeof collection !== "object") {
      res.status(400).json({ error: "Cant find collection" });
      return;
    }

    if (req.method === "GET") {
      const initialMenuStructure = await getMenuStructure(siteConfig, collection);
      console.log('API:/api/menu:initialMenuStructure: ', initialMenuStructure)

      const padsMenu = await fetchPadMenu();

      const newPrimary = (
        Array.isArray(initialMenuStructure?.primary)
          ? initialMenuStructure.primary
          : []
      ).concat(
        Array.isArray(padsMenu?.collections[collection.path])
          ? padsMenu.collections[collection.path]
          : []
      );

      const newRelatedContent = deepMerge(
        initialMenuStructure?.relatedContent || {},
        padsMenu?.relatedContent || {}
      );

      let mergedPrimary = newPrimary;
      newPrimary.forEach((item, index) => {
        mergedPrimary[index] = mergeObjects(
          newPrimary[index],
          padsMenu?.relatedContent || {}
        );
      });
      res
        .status(200)
        .json({ primary: mergedPrimary, relatedContent: newRelatedContent });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function fetchPadMenu() {
  const newPads = await cacheSearch("etherpad:*");
  // // console.log('cache: ', newPads)

  const padMeta = await Promise.all(newPads.map((item) => cacheRead(item)));

  padMeta.forEach((item, index) => {
    item = JSON.parse(item);
    try {
      if (!collections[item.collection]) {
        collections[item.collection] = [];
      }
      collections[item.collection].push({
        label: item.title,
        url: item.url,
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
            url: item.url.startsWith("/") ? item.url : "/" + item.url,
          });
          // // console.log('added: ', relatedContent, item)
        }
      }
      // collections[item.collection].children = findChildren(padMeta, item);
    } catch (error) {
      console.error(error);
    }
    // // console.log('meta: ', item);
  });
}

// merge the child entries from Etherpad

function mergePadMenu(newMenuStructure, padsMenu) {
  let mergedStructure = newMenuStructure;

  Object.keys(padsMenu.relatedContent).forEach((key) => {
    newMenuStructure.forEach((item, index) => {
      if (path.dirname(item.url) === "/" + key) {
        // console.log('mergePadMenu: ', key, ' : ', padsMenu.relatedContent[key])
        if (!mergedStructure[index].children) {
          mergedStructure[index].children = [];
        }
        mergedStructure[index].children = deepMergeObj(
          mergedStructure[index].children,
          padsMenu.relatedContent[key]
        );
      }
    });
  });

  return mergedStructure;
}

// Helper function for deep merge
function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object" && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else if (Array.isArray(source[key])) {
        if (Array.isArray(target[key])) {
          // Merge arrays while avoiding duplicates based on unique properties
          const uniqueItems = [];
          const map = new Map();

          [...target[key], ...source[key]].forEach((item) => {
            const uniqueKey = item.url || item.label; // Use 'url' or 'label' as a unique key, whichever is available
            if (!map.has(uniqueKey)) {
              map.set(uniqueKey, true);
              uniqueItems.push(item);
            }
          });

          target[key] = uniqueItems;
        } else {
          target[key] = source[key];
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function deepMergeObj(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && target[key] instanceof Object) {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function mergeObjects(obj1, obj2) {
  // Extract the directory from the URL
  let directory = obj1.url.split("/").slice(0, -1).join("/");
  // Remove the leading '/' if it exists
  if (directory.startsWith("/")) {
    directory = directory.substring(1);
  }

  // Check if the directory key exists in the second object
  if (obj2[directory]) {
    // Iterate over each category
    Object.keys(obj2[directory]).forEach((category) => {
      // If category does not exist in obj1, create it
      if (obj1.children && !obj1.children[category]) {
        obj1.children[category] = [];
      }

      obj2[directory][category].forEach((item) => {
        // Check if URL exists in obj1's category array
        if (
          obj1.children &&
          !obj1.children[category].some((e) => e.url === item.url)
        ) {
          obj1.children[category].push(item);
        }
      });
    });
  }

  return obj1;
}
