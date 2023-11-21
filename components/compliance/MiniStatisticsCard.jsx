// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MiniStatisticsCard({
  bgColor,
  color = "primary",
  title,
  count,
  percentage = null,
  icon,
  direction = "left",
}) {
  // const [controller] = useArgonController();
  // const { darkMode } = controller;
  const darkMode = false;
  const iconcolor = icon.color + ".main";

  return (
    <Box
      sx={{
        // bgcolor: 'background.paper',
        borderColor: "error", //icon.color,
        boxShadow: 0,
        border: 1,
        borderRadius: 2,
        p: 2,
        // minWidth: 300,
      }}
    >
      <Grid container alignItems="center">
        {direction === "left" ? (
          <Grid item>
            <Box
              color={iconcolor}
              width="3rem"
              height="3rem"
              borderRadius="section"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {/* <Icon fontSize="small" color="inherit"> */}
              <FontAwesomeIcon
                icon={["fas", "fa-" + icon.icon]}
                style={{ width: "40px", height: "40px" }}
              />
              {/* </Icon> */}
            </Box>
          </Grid>
        ) : null}
        <Grid item xs={8}>
          <Box ml={direction === "left" ? 2 : 0} lineHeight={1}>
            <Box sx={{ fontSize: 16, color: "text.secondary" }}>{title}</Box>
            <Box
              sx={{ color: "text.primary", fontSize: 34, fontWeight: "medium" }}
            >
              {count}
            </Box>
            {percentage.value && (
              <Box
                sx={{
                  color: iconcolor,
                  display: "inline",
                  fontWeight: "bold",
                  mx: 0.5,
                  fontSize: 14,
                }}
              >
                {percentage?.value}
              </Box>
            )}
            <Box sx={{ color: iconcolor, display: "inline", fontSize: 14 }}>
              {percentage?.text}
            </Box>
          </Box>
        </Grid>
        {direction === "right" ? (
          <Grid item xs={4}>
            <Box
              color={color}
              width="3rem"
              height="3rem"
              marginLeft="auto"
              borderRadius="section"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {/* <Icon fontSize="small" color="inherit"> */}
              <FontAwesomeIcon
                icon={["fas", "fa-" + icon.icon]}
                style={{ color: icon.color, width: "40px", height: "40px" }}
              />
              {/* </Icon> */}
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}
