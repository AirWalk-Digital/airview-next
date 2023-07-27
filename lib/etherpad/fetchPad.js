import * as matter from 'gray-matter';

export async function fetchPadDetails(cacheKey, rev = 0) {
  let rawContent = '';
  let frontmatterObj = {};
  let newRev = 0;

  try {
    const response = await fetch(`/api/cache?key=${cacheKey}`);
    const data = await response.json();
    const padData = JSON.parse(data.content);

    if (padData.padID) {
      // console.log('fetchPadDetails:loading: ', padData);

      const revResponse = await fetch(`/api/etherpad/pad-revs?pad=${padData.padID}`);
      const revData = await revResponse.json();
      // console.log('fetchPadDetails:data.rev : ', revData.rev, ' rev : ', rev);
      if (revData.rev && revData.rev > rev) {
        // console.log('new revision :', revData.rev);
        newRev = revData.rev;

        const contentResponse = await fetch(`/api/etherpad/pad?pad=${padData.padID}&rev=${newRev}`);
        const contentData = await contentResponse.json();

        if (contentData.content && contentData.content.text) {
          // console.log('fetchPadDetails:text: ', contentData.content.text);

          let { content, data: frontmatter } = matter(contentData.content.text);
          frontmatter.padID = padData.padID;
          frontmatterObj = frontmatter;
          rawContent = content;
          // console.log('fetchPadDetails:content: ', content);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return { rev: newRev, rawContent, frontmatter: frontmatterObj };
}
