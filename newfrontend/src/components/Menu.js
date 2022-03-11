import { Button } from "@mui/material";
import { Drawer } from "@mui/material";
import { List } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { AppBar } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { mainListItems } from "./listItems";
import MenuIcon from "@mui/icons-material/Menu";

export default function CustomMenu() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment key="left">
      <AppBar position="absolute" open={false}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            CryptoMonitor
          </Typography>
        </Toolbar>
      </AppBar>{" "}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <List component="nav">{mainListItems}</List>
      </Drawer>
    </React.Fragment>
  );
}
