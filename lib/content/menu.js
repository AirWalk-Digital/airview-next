
export function groupMenu(menuData) {
    const { primary, relatedContent } = menuData;
    const groupedMenuData = [] ;
  
    // Group related content under primary elements
    primary.forEach(item => {
      const { label, url } = item;
      const parentKey = url.split("/")[2];
      const primaryItem = { label, url, children: null };
  
      if (relatedContent.hasOwnProperty(parentKey)) {
        primaryItem.children = relatedContent[parentKey];
      }
  
      groupedMenuData.push(primaryItem);
    });
  
    return groupedMenuData;
  }