import { getBranchSha, getAllFiles, getFileContent } from '@/lib/github'
import * as matter from 'gray-matter';
import { cacheWrite, cacheRead } from '@/lib/redis';

async function getSolutions(siteConfig) {
    const branchSha = await getBranchSha(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch)
    const cacheKey = `menus:getSolutions:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[GitHub][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[GitHub][Cache][MISS]:', cacheKey)
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
    await cacheWrite(cacheKey, JSON.stringify(content), 600); // cache for 10 minutes
    return content
}

async function getKnowledge(siteConfig) {
    const branchSha = await getBranchSha(siteConfig.content.knowledge.owner, siteConfig.content.knowledge.repo, siteConfig.content.knowledge.branch)

    const cacheKey = `menus:getKnowledge:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[GitHub][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[GitHub][Cache][MISS]:', cacheKey)
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
    await cacheWrite(cacheKey, JSON.stringify(content), 600); // cache for 10 minutes
    return content


}

export async function getMenuStructureSolutions(siteConfig) {

    const branchSha = await getBranchSha(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch)

    const cacheKey = `menus:getMenuStructureSolutions:${branchSha}`;
    // Check if the content is in the cache
    const cachedContent = JSON.parse(await cacheRead(cacheKey));
    if (cachedContent) {
        console.info('[GitHub][Cache][HIT]:', cacheKey)
        // If the content was found in the cache, return it
        return cachedContent;
    } else {
        console.info('[GitHub][Cache][MISS]:', cacheKey)
    }

    const solutions = await getSolutions(siteConfig);
    const knowledge = await getKnowledge(siteConfig);
    const solutionMenu = [];
    const chapterFiles = {};
    const knowledgeFiles = {};

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

            // Only add file to solutionMenu if there is no corresponding index.md
            if (!indexFiles.has(directory)) {
                solutionMenu.push({
                    label: x.frontmatter.title,
                    url: x.file.startsWith('/') ? x.file : '/' + x.file,
                });
            }

            // Check if the key exists in the chapterFiles object
            if (!chapterFiles[directory]) {
                chapterFiles[directory] = [];
            }
            chapterFiles[directory].push({
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

            const parents = ['solution', 'pattern', 'product', 'design']

            // : products/airview_l6za3rlx

            for (let y of parents) {

                if (x.frontmatter[y]) {
                    let directory = x.frontmatter[y].split("/")[1]; // Extract parent name

                    // Check if the key exists in the chapterFiles object
                    if (!knowledgeFiles[directory]) {
                        knowledgeFiles[directory] = [];
                    }
                    knowledgeFiles[directory].push({
                        label: x.frontmatter.title,
                        url: x.file.startsWith('/') ? x.file : '/' + x.file,
                    });
                }
            }
        }
    }


    const content = { solutionMenu, chapterFiles, knowledgeFiles, designFiles: null };
    await cacheWrite(cacheKey, JSON.stringify(content), 600); // cache for 10 minutes
    return content
}
