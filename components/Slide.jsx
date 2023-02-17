import React from 'react'

import { DefaultLayout } from '../layouts/DefaultLayout'

export default function Slide({ children, id, className }) {
  return (
    <DefaultLayout sx={{backgroundColor: 'background.paper'}}>
      {children}
    </DefaultLayout>
  )
}
