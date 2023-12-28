import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Collapse, IconButton, Typography, Skeleton, ButtonBase } from "@mui/material";
import NextLinkComposed from 'next/link';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { isLinkInternal } from "@/lib/utils/is-link-url-internal";

export function ButtonMenu({
  menuTitle,
  menuTitleElement = "h3",
  loading = false,
  fetching = false,
  menuItems,
  collapsible = true,
  initialCollapsed = true,
  handleButtonClick,
  currentRoute,
  sx,
  children,
  ...rest
}) {
  const [collapsed, setCollapsed] = useState(
    collapsible ? initialCollapsed : false
  );

  return (
    <Box
      component="nav"
      sx={{
        ...(fetching && {
          opacity: 0.5,
          pointerEvents: "none",
        }),
        ...sx,
      }}
      {...rest}
    >
      <Box
        component="header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 0,
        }}
      >
        <Typography
          component={menuTitleElement}
          variant="subtitle2"
          sx={{ display: "block", flex: "1 1 auto", fontSize: 16 }}
        >
          {loading ? <Skeleton width="90%" /> : menuTitle}
        </Typography>

        {collapsible && (
          <IconButton
            onClick={() => setCollapsed((prevState) => !prevState)}
            size="medium"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            disabled={loading}
            sx={{
              marginLeft: 1,
              padding: 0,
              color: "primary.main",
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
        {menuItems?.map(({ groupTitle, links }, index) => (
          <Box aria-hidden={collapsed} key={index}>
            {groupTitle && (
              <Typography
                component="span"
                variant="subtitle2"
                sx={{
                  display: "block",
                  marginTop: 2,
                  marginBottom: -1,
                  color: "text.secondary",
                  textTransform: "uppercase",
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
                listStyle: "none",
                "& > li": {
                  fontSize: 14,
                  marginBottom: 1,
                  color: "text.secondary",
                },
              }}
            >


              {loading
                ? [...Array(6)].map((item, index) => (
                    <Skeleton key={index} component="li" />
                  ))
                : links?.map(({ label, url }, index) => {
                    return (
                      <Box component="li" key={index}>
                        <ButtonBase
                          variant="text"
                          onClick={() => handleButtonClick(url, label)}
                          sx={{
                            textDecoration: "none",
                            textTransform: 'none',
                            textAlign: 'left',
                            fontWeight: 'light',
                            color: 'secondary.main',
                            ...(url === currentRoute && { fontWeight: "bold" }),
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

ButtonMenu.propTypes = {
  menuTitle: PropTypes.string.isRequired,
  menuTitleElement: PropTypes.string,
  loading: PropTypes.bool,
  fetching: PropTypes.bool,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      groupTitle: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  collapsible: PropTypes.bool,
  initialCollapsed: PropTypes.bool,
  handleButtonClick: PropTypes.func.isRequired,
  currentRoute: PropTypes.string,
  sx: PropTypes.object,
};
