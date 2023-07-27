import { ContentCopy } from "@mui/icons-material";

export async function githubExternal(frontmatter, context) {
    let owner = null;
    let repo = null;
    let branch = null;
    let path = null;

    console.log('githubExternal:frontmatter: ', frontmatter)
    console.log('githubExternal:context: ', context)

    try {
        if (frontmatter.external) {
            owner = frontmatter.external.owner
            repo = frontmatter.external.repo
            branch = frontmatter.external.branch
            path = frontmatter.external.path
        } else {
            repo = frontmatter.external_repo
            owner = frontmatter.external_owner
            path = frontmatter.external_path
            branch = frontmatter.external_branch || 'main'
        }


        // let directory = path?.includes("/") ? path.split("/")[0] : '';

        // set the new context
        const newContext = {
            source: context.source, // The source of the content
            repo: repo, // The name of the repo
            owner: owner, // The owner of the repo
            branch: branch ,
            path: '',  // the base path for the content
            file: path,
            reference: context.reference, // how the collection is referred to in frontmatter links
            collections: context.collections
          }

        console.log('githubExternal:api: ', `/api/content/github/${owner}/${repo}?branch=${branch}&path=${path}`)

        const response = await fetch(
            `/api/content/github/${owner}/${repo}?branch=${branch}&path=${path}`
        );

        console.log('githubExternal:response: ', response)

        if (response.ok) {

            const data = await response.text();
            return { newContent: data, newContext: newContext};
        } else {
            console.error("githubExternal:Error fetching file:");
            return { newContent: null, newContext: null};
        }
    } catch (error) {

        console.error("githubExternal:Error fetching file:", error);
        return { newContent: null, newContext: null};
    }

};