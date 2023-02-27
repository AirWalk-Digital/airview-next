import React from 'react'

import { DefaultLayout } from '../layouts/DefaultLayout'
import { TitleSlide } from '../layouts/TitleLayout'


const DefaultLayoutType = (<DefaultLayout />).type;
const TitleSlideType = (<TitleSlide />).type;

let slideType = 'DefaultLayout';
let slideProps = '';

export default function Slide({ children, id, className }) {

  children.forEach(child => {
    if (child.type === TitleSlide) {
      slideType = 'TitleSlideType';
      slideProps = child.props;
      children = child.props.children;
    }
    else {
      slideType = 'DefaultLayout';
    }
  });
  // console.log(children)
  if (slideType === 'DefaultLayout') {
    return (
      <DefaultLayout sx={{ backgroundColor: 'background.paper' }}>
        {children}
      </DefaultLayout>
    )
  } else if (slideType === 'TitleSlideType') {
    return (
      <TitleSlide {...slideProps}>
        {children}
      </TitleSlide>
    )
  }
}
