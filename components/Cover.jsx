import React from 'react'
import { styled } from '@mui/material/styles'

const StyledCover = styled('div')({})

export default function Cover({ children }) {
  return <StyledCover>{children}</StyledCover>
}
