import { ContentCopy } from "@mui/icons-material";

export async function githubExternal(frontmatter, context) {
    let owner = null;
    let repo = null;
    let branch = null;
    let path = null;

    


    // console.log('githubExternal:frontmatter: ', frontmatter)
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

        // set the new context
        context = {
            source: context.source, // The source of the content
            repo: repo, // The name of the repo
            owner: owner, // The owner of the repo
            branch: branch ,
            path: path,  // the base path for the content
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
            return { file: path, content: data, context: context};
        } else {
            throw new Error("githubExternal:Error fetching file");
            return null
        }
    } catch (error) {
        console.log("githubExternal:Error fetching file:", error);

        console.error("githubExternal:Error fetching file:", error);
        return null
    }

};