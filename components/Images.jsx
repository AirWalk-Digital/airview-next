import React from 'react';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// fal -> light
// fas -> solid
// fab -> brands
// fad -> duotone (pro only)
const faTypes = ["fal", "fas", "fab", "fad"];


const FaIcon = ({ children, text = "", sx = {}, ...props }) => {
  let icon = ""
  if (!text) {
    icon = <FontAwesomeIcon icon={['fal', children]} sx={{ pl: "2%", pr: '10px' }} style={{ width: "50px", height: "50px", paddingTop: '3%', paddingBottom: '3%', paddingLeft: '2%', paddingRight: '2%' }} />
  } else {
    icon = <Box sx={{ maxWidth: '60px', ...sx }}><FontAwesomeIcon icon={['fal', children]} sx={{ pl: "2%", pr: '10px' }} style={{ width: "50px", height: "50px", paddingTop: '3%', paddingBottom: '3%', paddingLeft: '2%', paddingRight: '2%' }} /><Box sx={{ textAlign: 'center', textSize: 'xxxsmall' }}>{text}</Box></Box>
  }
  return (icon)

};

const Icon = ({ children, type = "fal", sx = {}, ...props }) => {
  let icon = ""
  let kiticon = "fak fa-" + children

  if (children) {
    if (type === 'fak') {
      icon = <i className={kiticon} style={{ width: "50px", height: "50px", paddingTop: '3%', paddingBottom: '3%', paddingLeft: '2%', paddingRight: '2%' }}></i>;
      console.log(icon)
    } else if (faTypes.indexOf(type) > -1) {
      icon = <FontAwesomeIcon icon={[type, children]} sx={{ pl: "2%", pr: '10px' }} style={{ width: "50px", height: "50px", paddingTop: '3%', paddingBottom: '3%', paddingLeft: '2%', paddingRight: '2%' }} />;
    }
  };
  return (icon);
};

export { FaIcon, Icon }

