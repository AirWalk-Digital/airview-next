import React from 'react'

import { DefaultLayout } from '../layouts/DefaultLayout'
import { TitleLayout } from '../layouts/TitleLayout'


const DefaultLayoutType = (<DefaultLayout />).type;
const TitleLayoutType = (<TitleLayout />).type;

let slideType = 'DefaultLayout';

export default function Slide({ children, id, className }) {

  children.forEach(child => {
    if (child.type === TitleLayout) {
      slideType = 'TitleLayout';
      children = child.props.children;
    }
    else {
      slideType = 'DefaultLayout';
    }
  });
  console.log(children)
  if (slideType === 'DefaultLayout') {
    return (
      <DefaultLayout sx={{ backgroundColor: 'background.paper' }}>
        {children}
      </DefaultLayout>
    )
  } else if (slideType === 'TitleLayout') {
    return (
      <TitleLayout>
        {children}
      </TitleLayout>
    )
  }
}
