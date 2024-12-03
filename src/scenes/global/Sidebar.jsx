import { useState } from "react";
import { ProSidebarProvider, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  const [showCustomerOptions, setShowCustomerOptions] = useState(false);
  const toggleCustomerOptions = () => {
    setShowCustomerOptions((prev) => !prev); // Toggle sub-menu visibility
  };

  const [showSettingsOptions, setShowSettingsOptions] = useState(false);
  const toggleSettingsOptions = () => {
    setShowSettingsOptions((prev) => !prev); // Toggle sub-menu visibility
  };
  const [showArchiveOptions, setShowArchiveOptions] = useState(false);
  const toggleArchiveOptions = () => {
    setShowArchiveOptions((prev) => !prev); // Toggle sub-menu visibility
  };

  const handleSelect = (title, path) => {
    setSelected(title);
    navigate(path);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[300]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebarProvider collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h2" color={colors.grey[100]}>
                  Staff
                </Typography>
              </Box>
            )}
          </MenuItem>

          {/* USER PROFILE */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center"></Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Dashboard Menu */}
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={() => handleSelect("Dashboard", "/dashboard")}
            />

            {/* Customer Menu */}
            <Item
              title="Customer"
              to="/"
              icon={<PeopleOutlinedIcon />}
              selected={selected === "/"}
              setSelected={() => {
                handleSelect("/");
                toggleCustomerOptions();
              }}
            />
            {showCustomerOptions && (
              <div style={{ paddingLeft: "20px" }}>
                <Item
                  title="Customer List"
                  to="/customer-list"
                  selected={selected === "/customer-list"}
                  setSelected={() =>
                    handleSelect("Customer List", "/customer-list")
                  }
                />

                <Item
                  title="Payment"
                  to="/payment"
                  selected={selected === "/payment"}
                  setSelected={() => handleSelect("Payment", "/payment")}
                />
              </div>
            )}
            <Item
              title="Employee Attendance"
              to="/employee-attendance"
              icon={<BadgeOutlinedIcon />}
              selected={selected}
              setSelected={() =>
                handleSelect("Employee Attendance", "/employee-attendance")
              }
            />

            <Item
              title="Products"
              to="/products"
              icon={<ShoppingCartIcon />}
              selected={selected}
              setSelected={() => handleSelect("Products", "/products")}
            />

            <Item
              title="Settings"
              to="/settings"
              icon={<SettingsOutlinedIcon />}
              selected={selected === "/settings"}
              setSelected={() => {
                handleSelect("/settings");
                toggleSettingsOptions();
              }}
            />
            {showSettingsOptions && (
              <div style={{ paddingLeft: "20px" }}>
                <Item
                  title="Archive"
                  to="/"
                  selected={selected === "/"}
                  setSelected={() => {
                    handleSelect("/settings");
                    toggleArchiveOptions();
                  }}
                />
                {showArchiveOptions && (
                  <div style={{ paddingLeft: "20px" }}>
                    <Item
                      title="Customer"
                      to="/customer-archive"
                      selected={selected === "/customer-archive"}
                      setSelected={() =>
                        handleSelect("Customer", "/customer-archive")
                      }
                    />
                  </div>
                )}

                <Item
                  title="Account Settings"
                  to="/account-settings"
                  selected={selected === "/account-settings"}
                  setSelected={() =>
                    handleSelect("Account Settings", "/account-settings")
                  }
                />
              </div>
            )}
          </Box>
        </Menu>
      </ProSidebarProvider>
    </Box>
  );
};

export default Sidebar;
