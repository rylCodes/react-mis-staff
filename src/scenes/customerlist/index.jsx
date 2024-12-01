import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { tokens } from "../../theme";
import { mockDataCustomer } from "../../data/mockData";
import Header from "../../components/Header";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import AddCustomer from "./addCustomer";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [AddCustomerOpen, setAddCustomerOpen] = useState(false);
  const [updateCustomerOpen, setUpdateCustomerOpen] = useState(false);
  const [customer, setCustomer] = useState(mockDataCustomer);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleOpen = () => setAddCustomerOpen(true);
  const handleClose = () => setAddCustomerOpen(false);

  const handleAddCustomer = (newcustomer) => {
    setCustomer((prevCustomer) => [
      ...prevCustomer,
      { id: prevCustomer.length + 1, ...newcustomer },
    ]);
  };

  const handleUpdateOpen = (customer) => {
    setSelectedCustomer(customer);
    setUpdateCustomerOpen(true);
  };

  const handleUpdateClose = () => {
    setSelectedCustomer(null);
    setUpdateCustomerOpen(false);
  };

  const handleArchive = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/archive-customer",
        { id }
      );
      if (response.status === 200) {
        setCustomer((prevCustomer) => prevCustomer.filter((c) => c.id !== id));
        alert("Customer archived successfully.");
      } else {
        alert("Failed to archive the customer.");
      }
    } catch (error) {
      console.error("Error archiving customer:", error);
      alert("An error occurred while archiving the customer.");
    }
  };

  const serviceOptions = [
    "Gym Per session",
    "Gym Monthly",
    "Monthly Treadmill",
    "Gym + Treadmill",
    "P.I Per Session",
    "P.I Monthly",
    "Zumba",
    "Dance",
    "Muay Thai",
    "Taekwondo",
    "Boxing",
  ];

  const handleSubmit = () => {
    // Pass the selected customer data to the PaymentForm page
    navigate("/payment-form", { state: { customer: selectedCustomer } });
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact", headerName: "Contact No", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "chosenservices", headerName: "Chosen Services", flex: 1 },
    { field: "instructor", headerName: "Instructor", flex: 1 },
    { field: "plan", headerName: "Plan", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="9px" justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArchiveOutlinedIcon />}
            onClick={() => handleArchive(params.row.id)}
          >
            Archive
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<EditOutlinedIcon />}
            onClick={() => handleUpdateOpen(params.row)}
          >
            Update
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Customer" subtitle="Managing the Customer Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb="10px">
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Customer
          </Button>
        </Box>
        <DataGrid checkboxSelection rows={customer} columns={columns} />
        <Dialog
          open={AddCustomerOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <AddCustomer
              closeModal={handleClose}
              onAddCustomer={handleAddCustomer}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={updateCustomerOpen}
          onClose={handleUpdateClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Update Customer</DialogTitle>
          <DialogContent>
            {selectedCustomer && (
              <Box component="form" mt={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Chosen Services</InputLabel>
                  <Select
                    value={selectedCustomer.chosenservices || ""}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        chosenservices: e.target.value,
                      })
                    }
                  >
                    {serviceOptions.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Full Name"
                  margin="normal"
                  defaultValue={selectedCustomer.name}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      name: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  defaultValue={selectedCustomer.email}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      email: e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit} // Navigate to PaymentForm
                >
                  Submit
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CustomerList;
