import { getBranchSha, getAllFiles, getFileContent } from '@/lib/github'
import * as matter from 'gray-matter';
import { cacheWrite, cacheRead } from '@/lib/redis';
import path from 'path';

export async function getFrontMatter(config) {
    const branchSha = await getBranchSha(config.owner, config.repo, config.branch)
    // const frontmatterCache = `structure:${config.path}:${branchSha}`;

    // let files = null;
    // const files = JSON.parse(await cacheRead(frontmatterCache));
    // if (!files) { // files aren't cached
    
    // }



    const cacheKey = `frontmatter:${config.path}:${branchSha}`;

    let cachedContent;
    try {
        cachedContent = JSON.parse(await cacheRead(cacheKey));
    } catch (error) {
        // Handle the error when JSON parsing fails (invalid data).
        console.error('Error parsing cached content:', error);
        cachedContent = null; // Or use a default value if required.
    }
    if (cachedContent) {
        console.info('[Menu][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[Menu][Cache][MISS]:', cacheKey)
    }

    const files = await getAllFiles(
        config.owner,
        config.repo,
        config.branch,
        config.path,
        true,
        ".md*"
    );


    const filesPromises = files.map((file) => {
        return getFileContent(config.owner, config.repo, config.branch, file.path, file.sha)
            .then((content) => {
                const matterData = matter(content, { excerpt: false }).data || null;
                if (matterData) {
                    for (let key in matterData) {
                        if (matterData[key] instanceof Date) {
                            matterData[key] = matterData[key].toISOString();
                        }
                    }
                }
                return { file: file.path, frontmatter: matterData };
            })
            .catch((error) => {
                console.error(`[Menu][Cache][Error] processing file: ${file}: ${error}`);
                return { file: null, frontmatter: null };
            });
    });


    cachedContent = await Promise.all(filesPromises);
    try {
        await cacheWrite(cacheKey, JSON.stringify(cachedContent), 60 * 60 * 24 * 7); // cache for 7 days
    } catch (error) {
        console.error('[Menu][Cache][FAIL]:', cacheKey, ' : ', error)

    }
    return await Promise.all(cachedContent);
}


export async function getContent(siteConfig) {
    const branchSha = await getBranchSha(siteConfig.owner, siteConfig.repo, siteConfig.branch)
    const cacheKey = `files:${siteConfig.path}:${branchSha}`;
    // Check if the content is in the cache
    let cachedContent;
    try {
        cachedContent = JSON.parse(await cacheRead(cacheKey));
    } catch (error) {
        // Handle the error when JSON parsing fails (invalid data).
        console.error('Error parsing cached content:', error);
        cachedContent = null; // Or use a default value if required.
    }
    if (cachedContent && cachedContent.length > 0) {
        console.info('[Menu][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[Menu][Cache][MISS]:', cacheKey)
    }

    const files = await getAllFiles(siteConfig.owner, siteConfig.repo, siteConfig.branch, siteConfig.path, true, '.md*');
    console.log('[Menu][getAllFiles]: ', files)
    const contentPromises = files.map((file) => {
        return getFileContent(
            siteConfig.owner,
            siteConfig.repo,
            siteConfig.branch,
            file.path,
            file.sha
        )
            .then(content => {
                const matterData = matter(content, { excerpt: false }).data || null;
                if (matterData) {
                    for (let key in matterData) {
                        if (matterData[key] instanceof Date) {
                            matterData[key] = matterData[key].toISOString();
                        }
                    }
                }
                return { file: file, frontmatter: matterData };
            })
            .catch(error => {
                console.error(`[Menu][getSolutions][${file}]: ${error}`)
                return { file: null, frontmatter: null };
            });
    });
    const content = await Promise.all(contentPromises);
    try {
        await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
    } catch (error) {

    }
    return content
}


async function getSolutions(siteConfig) {
    const branchSha = await getBranchSha(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch)
    const cacheKey = `menus:getSolutions:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[Menu][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[Menu][Cache][MISS]:', cacheKey)
    }

    const solutions = await getAllFiles(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch, siteConfig.content.solutions.path, true, '.md*');
    const solutionsContentPromises = solutions.map((file) => {
        return getFileContent(
            siteConfig.content.solutions.owner,
            siteConfig.content.solutions.repo,
            siteConfig.content.solutions.branch,
            file
        )
            .then(content => {
                const matterData = matter(content, { excerpt: false }).data || null;
                if (matterData) {
                    for (let key in matterData) {
                        if (matterData[key] instanceof Date) {
                            matterData[key] = matterData[key].toISOString();
                        }
                    }
                }
                return { file: file, frontmatter: matterData };
            })
            .catch(error => {
                console.error(`[Menu][getSolutions][${file}]: ${error}`)
                return { file: null, frontmatter: null };
            });
    });
    const content = await Promise.all(solutionsContentPromises);
    try {
        await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
    } catch (error) {

    }
    return content
}

async function getKnowledge(siteConfig) {
    const branchSha = await getBranchSha(siteConfig.content.knowledge.owner, siteConfig.content.knowledge.repo, siteConfig.content.knowledge.branch)

    const cacheKey = `menus:getKnowledge:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[Menu][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[Menu][Cache][MISS]:', cacheKey)
    }

    const knowledge = await getAllFiles(siteConfig.content.knowledge.owner, siteConfig.content.knowledge.repo, siteConfig.content.knowledge.branch, siteConfig.content.knowledge.path, true, '.md*');
    const knowledgeContentPromises = knowledge.map((file) => {
        return getFileContent(
            siteConfig.content.knowledge.owner,
            siteConfig.content.knowledge.repo,
            siteConfig.content.knowledge.branch,
            file
        )
            .then(content => {
                const matterData = matter(content, { excerpt: false }).data || null;
                return { file: file, frontmatter: matterData };
            })
            .catch(error => {
                console.error(`[Menu][getKnowledge][${file}]: ${error}`)
                return null; // or however you want to handle errors for each file
            });
    });

    const content = await Promise.all(knowledgeContentPromises);
    await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
    return content


}


async function getDesigns(siteConfig) {
    const branchSha = await getBranchSha(siteConfig.content.designs.owner, siteConfig.content.designs.repo, siteConfig.content.designs.branch)

    const cacheKey = `menus:getDesigns:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[Menu][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[Menu][Cache][MISS]:', cacheKey)
    }

    const contentFiles = await getAllFiles(siteConfig.content.designs.owner, siteConfig.content.designs.repo, siteConfig.content.designs.branch, siteConfig.content.designs.path, true, '.md*');
    const contentPromises = contentFiles.map((file) => {
        return getFileContent(
            siteConfig.content.designs.owner,
            siteConfig.content.designs.repo,
            siteConfig.content.designs.branch,
            file
        )
            .then(content => {
                const matterData = matter(content, { excerpt: false }).data || null;
                return { file: file, frontmatter: matterData };
            })
            .catch(error => {
                console.error(`[Menu][getDesigns][${file}]: ${error}`)
                return null; // or however you want to handle errors for each file
            });
    });

    const content = await Promise.all(contentPromises);
    await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
    return content


}


async function getServices(siteConfig) {
    const branchSha = await getBranchSha(siteConfig.content.services.owner, siteConfig.content.services.repo, siteConfig.content.services.branch)

    const cacheKey = `menus:getServices:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[Menu][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[Menu][Cache][MISS]:', cacheKey)
    }

    const contentFiles = await getAllFiles(siteConfig.content.services.owner, siteConfig.content.services.repo, siteConfig.content.services.branch, siteConfig.content.services.path, true, '.md*');
    const contentPromises = contentFiles.map((file) => {
        return getFileContent(
            siteConfig.content.services.owner,
            siteConfig.content.services.repo,
            siteConfig.content.services.branch,
            file
        )
            .then(content => {
                const matterData = matter(content, { excerpt: false }).data || null;
                return { file: file, frontmatter: matterData };
            })
            .catch(error => {
                console.error(`[Menu][getServices][${file}]: ${error}`)
                return null; // or however you want to handle errors for each file
            });
    });

    const content = await Promise.all(contentPromises);
    await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
    return content


}
export async function getMenuStructureSolutions(siteConfig) {

    const branchSha = await getBranchSha(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch)

    const cacheKey = `menus:getMenuStructureSolutions:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[Menu][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[Menu][Cache][MISS]:', cacheKey)
    }
    const parent = 'solution';
    const solutions = await getSolutions(siteConfig);
    const knowledge = await getKnowledge(siteConfig);
    const designs = await getDesigns(siteConfig);

    const solutionMenu = [];
    const chapterFiles = {};
    const knowledgeFiles = {};

    let relatedContent = {}


    const indexFiles = new Set();

    // First pass: Find index.md files
    for (let x of solutions) {
        if (
            x.file &&
            x.file.split('/').length === 3 &&
            x.file.match(/(_index\.md*|index\.md*)$/) &&
            x.frontmatter &&
            x.frontmatter.title
        ) {
            solutionMenu.push({
                label: x.frontmatter.title,
                url: x.file.startsWith('/') ? x.file : '/' + x.file,
            });
            indexFiles.add(x.file.split("/")[1]); // Add directory name to the Set
        }
    }

    // Second pass: Process non-index.md files
    for (let x of solutions) {
        if (
            x.file &&
            x.file.split('/').length > 2 && // skip any files in the root of the directory
            !x.file.match(/(_index\.md*|index\.md*)$/) &&
            x.frontmatter &&
            x.frontmatter.title
        ) {
            let directory = x.file.split("/")[1]; // Extract directory name

            let collection = x.file.split("/")[0]; // Extract directory name
            // Only add file to solutionMenu if there is no corresponding index.md
            if (!indexFiles.has(directory)) {
                solutionMenu.push({
                    label: x.frontmatter.title,
                    url: x.file.startsWith('/') ? x.file : '/' + x.file,
                });
            }

            // Check if the key exists in the relatedContent object
            if (!relatedContent[directory]) {
                relatedContent[directory] = {};
            }
            // check we have a section for the type of parent
            if (!relatedContent[directory]['chapters']) {
                relatedContent[directory]['chapters'] = [];
            }
            // add the related content
            relatedContent[directory]['chapters'].push({
                label: x.frontmatter.title,
                url: x.file.startsWith('/') ? x.file : '/' + x.file,
            });

        }
    }

    // knowledge files
    for (let x of knowledge) {
        if (
            x.file &&
            x.file.split('/').length > 2 && // skip any files in the root of the directory
            x.frontmatter &&
            x.frontmatter.title
        ) {

            if (x.frontmatter[parent]) {
                let directory = x.frontmatter[parent].split("/")[1]; // Extract parent name
                let collection = x.file.split("/")[0]; // Extract directory name

                if (!relatedContent[directory]) {
                    relatedContent[directory] = {};
                }
                // check we have a section for the type of parent
                if (!relatedContent[directory][collection]) {
                    relatedContent[directory][collection] = [];
                }
                // add the related content
                relatedContent[directory][collection].push({
                    label: x.frontmatter.title,
                    url: x.file.startsWith('/') ? x.file : '/' + x.file,
                });


                // // Check if the key exists in the chapterFiles object
                // if (!knowledgeFiles[directory]) {
                //     knowledgeFiles[directory] = [];
                // }
                // knowledgeFiles[directory].push({
                //     label: x.frontmatter.title,
                //     url: x.file.startsWith('/') ? x.file : '/' + x.file,
                // });
            }

        }
    }


    const content = { primary: solutionMenu, chapters: chapterFiles, knowledge: knowledgeFiles, designs: null, relatedContent };
    await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
    return content
}

export async function getMenuStructure(siteConfig, collection) {
    // branch of the primary collection
    const branchSha = await getBranchSha(collection.owner, collection.repo, collection.branch)

    const cacheKey = `menus:${collection.path}:${branchSha}`;
    // Check if the content is in the cache
    let cachedContent;
    try {
        cachedContent = JSON.parse(await cacheRead(cacheKey));
    } catch (error) {
        // Handle the error when JSON parsing fails (invalid data).
        // console.error('Error parsing cached content:', error);
        cachedContent = null; // Or use a default value if required.
    }
    if (cachedContent) {
        console.info('[getMenuStructure][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[getMenuStructure][Cache][MISS]:', cacheKey)
    }
    const parent = 'siteConfig.path';
    const primary = await getContent(collection);
    // console.info('[getMenuStructure][primary]:', primary)

    let relatedFiles = {}; // all the files in related collections
    let relatedContent = {}; // only the files that are children of the primary content

    const collections = ["services", "providers", "solutions", "knowledge", "designs", "customers", "projects", "products"]



    const primaryMenu = [];
    // const chapterFiles = {};
    // const knowledgeFiles = {};


    const indexFiles = new Set();

    // First pass: Find index.md files
    for (let x of primary) {
        if (
            x.file &&
            x.file.path &&
            x.file.path.split('/').length === 3 &&
            x.file.path.match(/(_index\.md*|index\.md*)$/) &&
            x.frontmatter &&
            x.frontmatter.title
        ) {
            primaryMenu.push({
                label: x.frontmatter.title,
                url: x.file.path.startsWith('/') ? x.file.path : '/' + x.file.path,
            });
            indexFiles.add(path.dirname(x.file.path)); // Add directory name to the Set
        }
    }

    // Second pass: Process non-index.md files
    for (let x of primary) {
        if (
            x.file &&
            x.file.path &&
            x.file.path.split('/').length > 2 && // skip any files in the root of the directory
            !x.file.path.match(/(_index\.md*|index\.md*)$/) &&
            x.frontmatter &&
            x.frontmatter.title
        ) {
            // let directory = x.file.split("/")[1]; // Extract directory name
            let directory = path.dirname(x.file.path)

            // console.log('getMenuStructure')

            let collection = x.file.path.split("/")[0]; // Extract directory name
            // Only add file to solutionMenu if there is no corresponding index.md
            if (!indexFiles.has(directory)) {
                primaryMenu.push({
                    label: x.frontmatter.title,
                    url: x.file.path.startsWith('/') ? x.file.path : '/' + x.file.path,
                });
            }

            // Check if the key exists in the relatedContent object
            if (!relatedContent[directory]) {
                relatedContent[directory] = {};
            }
            // check we have a section for the type of parent
            if (!relatedContent[directory]['chapters']) {
                relatedContent[directory]['chapters'] = [];
            }
            // add the related content
            relatedContent[directory]['chapters'].push({
                label: x.frontmatter.title,
                url: x.file.path.startsWith('/') ? x.file.path : '/' + x.file.path,
            });

        }
    }

    const siteContent = siteConfig.content;


    for (let collectionItem of collections) {
        if (!relatedFiles[collectionItem]) {
            relatedFiles[collectionItem] = {};
        }
        relatedFiles[collectionItem] = await getContent(siteConfig.content[collectionItem])
        // // console.log('relatedFiles[collectionItem]: ', relatedFiles[collectionItem])

        for (let x of relatedFiles[collectionItem]) {
            if (
                x.file &&
                x.file.path &&
                x.file.path.split('/').length > 2 && // skip any files in the root of the directory
                x.frontmatter &&
                x.frontmatter.title
            ) {

                for (const key in siteContent) {
                    if (siteContent.hasOwnProperty(key)) {
                        const contentDetails = siteContent[key];
                        if (x.frontmatter[contentDetails.reference]) {

                            let directory = x.frontmatter[contentDetails.reference] // is already the directory name

                            if (!relatedContent[directory]) {
                                relatedContent[directory] = {};
                            }
                            // check we have a section for the type of parent
                            if (!relatedContent[directory][collectionItem]) {
                                relatedContent[directory][collectionItem] = [];
                            }
                            // add the related content
                            relatedContent[directory][collectionItem].push({
                                label: x.frontmatter.title,
                                url: x.file.path.startsWith('/') ? x.file.path : '/' + x.file.path,
                            });

                        }
                    }
                }
            }
        }



    }

    const mergedMenu = mergePadMenu(primaryMenu, relatedContent)


    const content = { primary: mergedMenu, relatedContent };
    // const util = require('util')
    // console.log('primaryMenu: ', util.inspect(primaryMenu, false, null, true /* enable colors */))
    // console.log('mergedMenu: ', util.inspect(mergedMenu, false, null, true /* enable colors */))
    await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
    return content
}



// merge the child entries

function mergePadMenu(menuA, menuB) {
    let mergedStructure = menuA;
    // console.log('mergePadMenu:menuA ', menuA)
    // console.log('mergePadMenu:menuB ', menuB)

    Object.keys(menuB).forEach(key => {

        menuA.forEach((item, index) => {

            if (path.dirname(item.url) === '/' + key) {
                // console.log('mergePadMenu: /', key, ' : ', path.dirname(item.url))

                if (!mergedStructure[index].children) {
                    mergedStructure[index].children = [];
                }
                mergedStructure[index].children = menuB[key]
            }
        })

    });
    // console.log('mergePadMenu:mergedStructure: ', mergedStructure)

    return mergedStructure

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
