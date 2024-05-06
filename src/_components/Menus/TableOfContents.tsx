import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Collapse,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
// Custom styled components
const SmallListItemText = styled(ListItemText)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
  paddingBottom: theme.spacing(0),
  paddingTop: theme.spacing(0),
  marginBottom: theme.spacing(0),
  marginTop: theme.spacing(0),
}));

interface TableOfContentsItem {
  depth: number;
  value: string;
  id: string;
  children?: TableOfContentsItem[];
}

const generateTableOfContents = (
  tableOfContents: TableOfContentsItem[],
  numbering: number[] = [],
): React.ReactNode => {
  if (!tableOfContents || tableOfContents.length === 0) {
    return null;
  }

  return (
    <List disablePadding component="nav" aria-labelledby="table-of-contents">
      {tableOfContents.map((item, index) => {
        const { value, id, children } = item;
        const itemNumbering = [...numbering, index + 1];
        const numberingString = itemNumbering.join('.');

        const listItemText = (
          <SmallListItemText
            primaryTypographyProps={{ variant: 'body2' }}
            disableTypography
          >
            <span>{`${numberingString} `}</span>
            {value}
          </SmallListItemText>
        );

        if (children && children.length > 0) {
          return (
            <List key={id} disablePadding>
              <ListItem disablePadding disableGutters sx={{ p: 0 }}>
                <MuiLink href={`#${id}`} underline="none">
                  {listItemText}
                </MuiLink>
              </ListItem>
              <List disablePadding>
                {generateTableOfContents(children, itemNumbering)}
              </List>
            </List>
          );
        }

        return (
          <ListItem
            key={id}
            disablePadding
            disableGutters
            sx={{ pt: 0, pb: 0 }}
          >
            <MuiLink href={`#${id}`} underline="none">
              {listItemText}
            </MuiLink>
          </ListItem>
        );
      })}
    </List>
  );
};

interface TableOfContentsProps {
  tableOfContents: TableOfContentsItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  tableOfContents,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const menuTitleElement = 'h3';
  const loading = false;
  const menuTitle = 'Page Contents';

  return (
    <Box sx={{ pl: 0 }}>
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
          component={menuTitleElement}
          variant="subtitle2"
          sx={{ display: 'block', flex: '1 1 auto', fontSize: 16, pb: 1 }}
        >
          {loading ? <Skeleton width="90%" /> : menuTitle}
        </Typography>

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
      </Box>
      <Collapse in={!collapsed}>
        {generateTableOfContents(tableOfContents)}
      </Collapse>
    </Box>
  );
};
