import React, {useState} from 'react';
import { Link as MuiLink, Box, Typography, List, ListItem, ListItemText, styled, Collapse, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// Custom styled components
const SmallListItemText = styled(ListItemText)(({ theme }) => ({
    fontSize: theme.typography.body2.fontSize,
    lineHeight: theme.typography.body2.lineHeight,
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(0),
}));

const generateTableOfContents = (tableOfContents, numbering = []) => {
    if (!tableOfContents || tableOfContents.length === 0) {
        return null;
    }

    return (
        <List component="nav" aria-labelledby="table-of-contents">
            {tableOfContents.map((item, index) => {
                const { depth, value, id, children } = item;
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
                        <List key={id} sx={{ p: 0 }}>
                            <ListItem sx={{ p: 0 }}>{listItemText}</ListItem>
                            <List sx={{ p: 0 }}>
                                {generateTableOfContents(children, itemNumbering)}
                            </List>
                        </List>
                    );
                }

                return (
                    <ListItem key={id} disableGutters sx={{ p: 0 }}>
                        <MuiLink href={`#${id}`} underline="none">
                            {listItemText}
                        </MuiLink>
                    </ListItem>
                );
            })}
        </List>
    );
};

export const TableOfContents = ({ tableOfContents }) => {
    const [collapsed, setCollapsed] = useState(false);
    const menuTitleElement = "h3"
    const loading = false;
    const menuTitle = 'Page Contents'
    return (
        <Box sx={{ pl: 0 }}>
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
            </Box>
            <Collapse in={!collapsed}>

            
                {generateTableOfContents(tableOfContents)}
            
            </Collapse>
        </Box>
    );
};
