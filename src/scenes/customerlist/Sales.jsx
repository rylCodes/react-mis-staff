import React, { useState, useEffect, useContext } from "react";
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
import { useAlert } from "../../context/AlertContext";
import DeleteIcon from "@mui/icons-material/Delete";
import transitions from "@material-ui/core/styles/transitions";

const Sales = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert(`Customer successfully updated.`, "success");
  };

  const handleArchiveSuccess = () => {
    showAlert(`Customer successfully archived.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
  };

  useEffect(() => {
    fetchClientTransactions();
  }, []);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [isFetching, setIsFetching] = useState(false);
  const [customer, setCustomer] = useState([]);

  const handleArchive = async (id) => {
    try {
      const userConfirmed = confirm(
        "Do you want to move this customer transaction to archive?"
      );
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/exercise-transaction/delete/${id}`,
        null, // No payload needed
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleArchiveSuccess();
        fetchClientTransactions();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      handleError();
    }
  };

  const getUniqueInstructors = (transactions) => {
    return transactions
      .reduce((acc, item) => {
        if (item.instructor_name && !acc.includes(item.instructor_name)) {
          acc.push(item.instructor_name);
        }
        return acc;
      }, [])
      .join(", ");
  };

  const getUniquePlan = (transactions) => {
    return transactions
      .reduce((acc, item) => {
        if (!acc.includes(item.tag)) {
          acc.push(item.tag);
        }
        return acc;
      }, [])
      .join(", ");
  };

  const fetchClientTransactions = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/exercise-transaction/show",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        const clients = response.data.data.map((client) => ({
          id: client.transaction_code,
          name: client.client_name,
          sex: client.gender,
          email: client.email,
          contact: client.contact_no,
          address: client.address,
          chosenservices: client.transactions
            .map((item) => item.exercise_name)
            .join(", "),
          instructor: getUniqueInstructors(client.transactions),
          plan: getUniquePlan(client.transactions),
          totalPrice: client.total_price.toFixed(2),
        }));

        setCustomer(clients);
        setIsFetching(false);
      } else {
        console.error("Failed to fetch clients");
        setIsFetching(false);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsFetching(false);
    }
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
    { field: "totalPrice", headerName: "Total Amount", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Sales" subtitle="Monitor sales and transactions" />
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
        <DataGrid
          loading={isFetching}
          checkboxSelection
          rows={customer}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Sales;
