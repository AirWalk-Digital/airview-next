/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  ButtonBase,
  Collapse,
  IconButton,
  Skeleton,
  type SxProps,
  type Theme,
  Typography,
} from '@mui/material';
import React, { type ReactNode, useState } from 'react';

interface Link {
  label: string;
  url: string;
}

interface MenuItem {
  groupTitle?: string;
  links: Link[];
}

export interface ButtonMenuProps {
  menuTitle: string;
  loading?: boolean;
  fetching?: boolean;
  menuItems: MenuItem[];
  collapsible?: boolean;
  initialCollapsed?: boolean;
  handleButtonClick: (url: string, label: string) => void;
  currentRoute?: string;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export function ButtonMenu({
  menuTitle,
  loading = false,
  fetching = false,
  menuItems,
  collapsible = true,
  initialCollapsed = true,
  handleButtonClick,
  currentRoute,
  sx,
  children,
}: ButtonMenuProps) {
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
              color: 'primary',
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
                  color: 'secondary',
                  textTransform: 'uppercase',
                  fontSize: 12,
                }}
              >
                {loading ? <Skeleton width="90%" /> : groupTitle}
              </Typography>
            )}
            {children && children}
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
                ? [...Array(6)].map((index) => (
                    <Skeleton key={`skeleton-${index}`} component="li" />
                  ))
                : links?.map(({ label, url }, index) => {
                    return (
                      <Box component="li" key={index}>
                        <ButtonBase
                          // component="button"
                          // variant="contained" // Add the variant prop with a valid value (e.g., "contained")
                          onClick={() => handleButtonClick(url, label)}
                          sx={{
                            textDecoration: 'none',
                            textTransform: 'none',
                            textAlign: 'left',
                            fontWeight: 'light',
                            color: 'secondary',
                            ...(url === currentRoute && { fontWeight: 'bold' }),
                          }}
                        >
                          {label}
                        </ButtonBase>
                      </Box>
                    );
                  })}
            </Box>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
}
