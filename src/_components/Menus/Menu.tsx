'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Collapse,
  IconButton,
  Link,
  Skeleton,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';

import type { MenuItem } from '@/lib/Types';

import { isLinkInternal } from './lib/isLinkInternal';

export interface MenuProps {
  menuTitle: string;
  menuTitleElement?: string;
  loading?: boolean;
  fetching?: boolean;
  menuItems: MenuItem[];
  collapsible?: boolean;
  initialCollapsed?: boolean;
  linkComponent?: any;
  currentRoute?: string;
  sx?: object;
}

export const Menu: FC<MenuProps> = ({
  menuTitle,
  menuTitleElement = 'h3',
  loading = false,
  fetching = false,
  menuItems,
  collapsible = true,
  initialCollapsed = true,
  // linkComponent,
  currentRoute,
  sx,
  ...rest
}) => {
  const [collapsed, setCollapsed] = useState(
    collapsible ? initialCollapsed : false,
  );

  return (
    <Box
      component="nav"
      sx={{
        ...(fetching && {
          opacity: 0.5,
          pointerEvents: 'none',
        }),
        ...sx,
      }}
      {...rest}
    >
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 0,
        }}
      >
        <Typography
          component={menuTitleElement as React.ElementType}
          variant="subtitle2"
          sx={{ display: 'block', flex: '1 1 auto', fontSize: 16 }}
        >
          {loading ? <Skeleton width="90%" /> : menuTitle}
        </Typography>

        {collapsible && (
          <IconButton
            onClick={() => setCollapsed((prevState) => !prevState)}
            size="medium"
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
            disabled={loading}
            sx={{
              marginLeft: 1,
              padding: 0,
              color: 'primary.main',
            }}
          >
            {collapsed ? (
              <KeyboardArrowRightIcon fontSize="inherit" />
            ) : (
              <KeyboardArrowDownIcon fontSize="inherit" />
            )}
          </IconButton>
        )}
      </Box>

      <Collapse in={!collapsed}>
        {menuItems?.map(({ groupTitle, links }) => (
          <Box aria-hidden={collapsed} key={groupTitle}>
            {groupTitle && (
              <Typography
                component="span"
                variant="subtitle2"
                sx={{
                  display: 'block',
                  marginTop: 2,
                  marginBottom: -1,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontSize: 12,
                }}
              >
                {loading ? <Skeleton width="90%" /> : groupTitle}
              </Typography>
            )}
            <Box
              component="ul"
              sx={{
                margin: 0,
                marginTop: 2,
                padding: 0,
                listStyle: 'none',
                '& > li': {
                  fontSize: 14,
                  marginBottom: 1,
                  color: 'text.secondary',
                },
              }}
            >
              {loading
                ? [...Array(6)].map((item) => (
                    <Skeleton key={item} component="li" />
                  ))
                : links?.map(({ label, url }) => {
                    return (
                      <Box component="li" key={`${label}+${url}`}>
                        <Link
                          underline="hover"
                          style={{
                            textDecoration: 'hover',
                            color: 'text.secondary',
                          }}
                          component={NextLink}
                          href={url}
                          target={isLinkInternal(url) ? '_self' : '_blank'}
                          sx={{
                            ...(url === currentRoute && { fontWeight: 'bold' }),
                          }}
                        >
                          {label}
                        </Link>
                      </Box>
                    );
                  })}
            </Box>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};
