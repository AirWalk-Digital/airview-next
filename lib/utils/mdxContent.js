import React from 'react';


const getComponentType = Component => {
  if (Component.hasOwnProperty('props') && Component.props.hasOwnProperty('originalType')) {
    return Component.props.originalType;
  }

  if (Component.hasOwnProperty('type')) {
    return Component.type;
  }
};

function getContent(type, body) {
    // if type is "headings" will match any heading
    const headers = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
   
    let children = React.Children.toArray(body);
    let element = "";
    let header;
    if (children.length >= 1) {
      if (type == "headings") {
        const headerType = getComponentType(children[0]);
        if (headers.has(headerType)) {
          element = children[0]
          children = children.slice(1);
        }
      } else {
        if (children[0].hasOwnProperty('type') && typeof children[0].type !== 'function') {
          if (children[0].type == type) {
            element = children[0]
            children = children.slice(1);
          }
        } else if (typeof children[0].type === 'function' && children[0].type.name === type ) {
          element = children[0]
          children = children.slice(1);
        }  
      }
    }
    return { element, children };
  }

  export { getContent , getComponentType }