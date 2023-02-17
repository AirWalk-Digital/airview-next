import React from 'react';
import Box from '@mui/material/Box';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useTheme } from '@mui/material/styles';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';

import { Icon } from './Images.jsx'

const faTypes = ["fal", "fas", "fab", "fad"];

// fal -> light
// fas -> solid
// fab -> brands
// fad -> duotone (pro only)
// fass -> sharp
import { getContrastYIQ } from './utils/colors.js';
library.add(fab, fas, fal, fass);


function getListContent(content, i) {
  let icon = "";
  let heading = "";
  let body = "";
  let key = i;


  
  if (content.hasOwnProperty('props') && content.props.hasOwnProperty('children')) {
    if (content.props['originalType'] == "ul") {
      //passed at a higher level
      content = React.Children.toArray(content.props.children);

      if (Array.isArray(content)) {
        content = content[0];
      }

      if (content.hasOwnProperty('props') && content.props.hasOwnProperty('children')) {

        if (content.props['originalType'] == "li") {
          content = React.Children.toArray(content.props.children);
        }
      }
    }
  }

  if (content[0].hasOwnProperty('props') && content[0].props.hasOwnProperty('children')) {
    icon = content[0].props.children; // icon or primary list item

  } else if (typeof content[0] == "string") {
    icon = content[0]
  }
  if (content[1].hasOwnProperty('props') && content[1].props.hasOwnProperty('children')) {
    if (content[1].props.children.length > 1) {
      // there is a header and body
      if (content[1].props.children[0].hasOwnProperty('props') && content[1].props.children[0].props.hasOwnProperty('children')) {
        heading = content[1].props.children[0].props.children;
      }
      if (content[1].props.children[1].hasOwnProperty('props') && content[1].props.children[1].props.hasOwnProperty('children')) {
        body = content[1].props.children[1].props.children;
      }
    } else { // only body // remap to heading
      heading = content[1].props.children.props.children;
    }


  }

  return ({ key, icon, heading, body });

}


function getMDXparts(element) {
  if (element.hasOwnProperty('props') && element.props.hasOwnProperty('children') && element.props.hasOwnProperty('originalType')) {
    return ({ type: element.props['originalType'], text: element.props['children'] })
  } else {
    return ({ type: '', text: '' });
  }
}

const Insight = ({ children, row = 0, maxRows = 0, splitter = true, sx = {} }) => {

  let content = getListContent(children);

  let type = "fal";
  let icon = content.icon


  if (faTypes.indexOf(content.icon.slice(0, 3)) > -1) {
    type = content.icon.slice(0, 3)
    icon = content.icon.slice(4)
  } else if (content.icon.slice(0, 3) === "fak") {
    type = "fak"
    icon = content.icon.slice(4)
  }
  let block2 = 'flex'
  if (!content.body) { block2 = 'none' } // if there is no body, only show the header


  const Splitter = ({ row = 0, maxRows = 0, splitter = true }) => {


    if (row < maxRows - 1 && splitter) {
      return (
        <Box sx={{ display: "flex", backgroundColor: "tertiary", width: "100%", height: "2px", }} />
      )
    }
    else {
      return (<></>)
    }
  }
  return (
    <>
      <Box sx={{ display: "flex", py: "0", minHeight: "4em", ...sx }}>
        <Box sx={{ px: "2%", display: "flex", alignItems: "center" }}>
          {/* <FontAwesomeIcon icon={fas("cloud")} sx={{ px: "2%" }} style={{ width: "50px", height: "50px" }} /> */}
          <Icon type={type} sx={{ px: "2%" }} style={{ width: "50px", height: "50px" }} >{icon}</Icon>
        </Box>
        <Box sx={{ px: "1%", py: '5px', display: 'flex', alignItems: 'center', fontSize: 'medium', minWidth: '30%', ...sx }}>
          {content.heading}
        </Box>
        <Box sx={{ px: "1%", py: '5px', display: block2, alignItems: 'center', fontSize: 'medium', minWidth: '50%', ...sx }}>
          {content.body}
        </Box>
      </Box>
      <Splitter row={row} maxRows={maxRows} splitter={splitter} />
    </>

  )
};

const ChevronProcess = ({ children, minWidth, maxWidth }, key = 0) => {

  let content = getListContent(children, key);
  // console.log(content.icon.toString());
  const theme = useTheme();

  let type = "fal";
  let icon = content.icon

  if (faTypes.indexOf(content.icon.slice(0, 3)) > -1) {
    type = content.icon.slice(0, 3)
    icon = content.icon.slice(4)
  } else if (content.icon.slice(0, 3) === "fak") {
    type = "fak"
    icon = content.icon.slice(4)
  }

  // let iconimage = fas(icon);
  return (
    <Box key={key} sx={{ display: "flex", py: "1%", fontSize: 'xsmall', minHeight: "5em", maxHeight: '10em' }}>
      <Box id='0' sx={{
        px: "2%", display: "flex", alignItems: "center", backgroundColor: 'tertiary', borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", color: getContrastYIQ(theme.colors.tertiary)
      }}>

        {/* <FontAwesomeIcon icon={['fal', content.icon]} sx={{ px: "2%" }} style={{ width: "50px", height: "50px" }} /> */}
        <Icon type={type} sx={{ px: "2%" }} style={{ width: "50px", height: "50px" }} >{icon}</Icon>

      </Box>

      <Box id='1' sx={{
        variant: "styles.p", px: "1%", backgroundColor: 'tertiary',
        pr: '80px',
        minWidth: minWidth,
        maxWidth: maxWidth,
        padding: '15px 0',
        my: '0',
        marginRight: '-30px',
        color: getContrastYIQ(theme.colors.tertiary),
        clipPath: 'polygon(0 0, calc(100% - 70px) 0, 100% 50%, calc(100% - 70px) 100%, 0 100%)',

      }}>
        {content.heading}
      </Box>
      <Box id='2' sx={{
        variant: "styles.p", px: "1%", backgroundColor: 'muted',
        pr: '80px',
        pl: '80px',
        minWidth: '150px',
        width: '100%',
        padding: '15px 0',
        my: '0',
        marginRight: '-30px',
        color: getContrastYIQ(theme.colors.secondary),
        background: 'secondary',
        clipPath: 'polygon(0 0, calc(100% - 70px) 0, 100% 50%, calc(100% - 70px) 100%, 0 100%, 70px 50%);',

      }}>
        {content.body}
      </Box>
    </Box >

  )
}



const StatementBanner = ({ children, sx = {}, ...props }) => {
  children = React.Children.toArray(children);
  // let header = getContent('h3', children); // match any headings
  // let icon = getContent('p', header.children); // match any headings
  let faIcon = "";

  let header = '';
  let icon = '';
  let text = '';

  // let {t1, = getMDXparts(children[0])
  // let content = getListContent(children, key);
  // console.log(children);
  // console.log(header.element);
  if (children.length == 3) {
    let p0 = getMDXparts(children[0]);
    let p1 = getMDXparts(children[1]);
    let p2 = getMDXparts(children[2]);
    if (p0.type == "h3") {
      header = p0.text;
    }
    if (p1.type == "p") {
      faIcon = p1.text;
    }
    if (p2.type == "p") {
      text = p2.text;
    }
  } else if (children.length == 2) {
    let p0 = getMDXparts(children[0]);
    let p1 = getMDXparts(children[1]);
    if (p0.type == "h3") {
      header = p0.text;
    } else {
      const textArray = p0.text.split(" ");
      if (textArray.length == 1) { //this is just an icon
        faIcon = p0.text;
      } else { //this is some normal text
        text = p0.text;
      }
    }
    const textArray = p1.text.split(" ");
    if (textArray.length == 1) { //this is just an icon
      faIcon = p1.text;
    } else { //this is some normal text
      text = p1.text;
    }

  } else if (children.length == 1) { // can only be text
    let p0 = getMDXparts(children[0]);
    text = p0.text
  } else {


  }

  // if (icon.element.hasOwnProperty('props') && icon.element.props.hasOwnProperty('children')) {
  //   faIcon = icon.element.props.children; // icon or primary list item
  // } else if (typeof icon.element== "string") {
  //   faIcon = icon.element
  // }
  // let iconimage = fas(icon);
  return (
    <Box sx={{ my: "0.5%" }}>
      {header && <Box sx={{ variant: "styles.statement", pt: '1%', pb: '1%', borderRadius: '8px' }}>{header}</Box>}
      <Box sx={{ display: "flex", alignItems: "center", breakInside: 'avoid-column' }}>
        {/* <Box sx={{ display: "flex", alignItems: "left", paddingLeft: "2.5%" }}> */}
        {faIcon && <FontAwesomeIcon icon={['fal', faIcon]} sx={{ pl: "2%", pr: '10px' }} style={{ width: "50px", height: "50px", paddingTop: '1%', paddingBottom: '1%', paddingLeft: '2%', paddingRight: '2%' }} />}
        {/* <Box sx={{ variant: "styles.p", paddingLeft: "2.5%", minHeight: "100px", m: '1%' }}> */}
        <Box sx={{ py: '0', pl: "0px", minHeight: "50px", m: '0.5%', display: "flex", alignItems: "center" }}>
          {text}
        </Box>
      </Box>
    </Box>

  )
}




const InsightTable = ({ children, sx = {}, splitter = true, ...props }) => {
  if (children.hasOwnProperty('props')) {
    let list = React.Children.toArray(children.props.children);
    list = list.filter(item => item !== "\n") //strip all the empty entries (\n)
    console.log(list)

    const insights = list.map((item, i) => (
      item.hasOwnProperty('props') && item.props.hasOwnProperty('originalType') && item.props['originalType'] === "li" ? (
        <Insight row={i} maxRows={list.length} splitter={splitter} key={i} sx={sx}>{React.Children.toArray(item.props.children).filter(item => item !== "\n")}</Insight>
      ) : (<p>error</p>)

    )
    )
    return (insights)

  } else {
    return (
      <p>no content</p>
    )
  }

};



const ChevronProcessTable = ({ children, minWidth = '20%', maxWidth = '30em', sx = {}, ...props }) => {
  let renderlist = "";
  if (children.hasOwnProperty('props')) {
    let list = React.Children.toArray(children.props.children);
    return (

      list.map(function (item, i) {
        if (item.hasOwnProperty('props') && item.props.hasOwnProperty('originalType')) {
          if (item.props['originalType'] == "li") {
            let li = React.Children.toArray(item.props.children); // list item
            return (
              <>
                <ChevronProcess key={i} minWidth={minWidth} maxWidth={maxWidth}>{li}</ChevronProcess>
                {/* <Box sx={{display: "flex",backgroundColor: "primary" ,width: "100%", height: "1px",}} /> */}
              </>
            );
          }
        }

      })
    )
    return (
      <Box sx={{ display: "flex", flexDirection: "column", px: "2.5%", py: "1%", height: "65%" }}>
        {list.map(function (item) { <div>{item}</div> })}
      </Box>
    )


  } else {
    return (
      <p>no content</p>
    )
  }

};


export { InsightTable, Insight, ChevronProcess, ChevronProcessTable, StatementBanner };
