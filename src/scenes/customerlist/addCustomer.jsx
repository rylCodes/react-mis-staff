import { useContext, useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

const AddCustomer = ({ closeModal, onAddCustomer }) => {
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();

  const handleSuccess = () => {
    showAlert(`Customer successfully added.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while adding the customer!", "error");
  };

  const [clientData, setClientData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "password",
    address: "",
    gender: "",
    contact_no: "",
  });

  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/staff/store-client",
        clientData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      onAddCustomer(response.data.data); // Update parent state if needed
      closeModal();
      handleSuccess();
    } catch (err) {
      console.log(err);
      setError("An error occurred while adding the client.");
      handleError();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      {error && <div style={{ color: "red" }}>{error}</div>}
      <TextField
        label="First Name"
        name="firstname"
        value={clientData.firstname}
        onChange={handleChange}
        required
      />
      <TextField
        label="Last Name"
        name="lastname"
        value={clientData.lastname}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={clientData.email}
        onChange={handleChange}
        required
      />
      {/* <TextField
        label="Password"
        name="password"
        type="password"
        value={clientData.password}
        onChange={handleChange}
        required
      /> */}
      <TextField
        label="Address"
        name="address"
        value={clientData.address}
        onChange={handleChange}
        required
      />
      <FormControl required>
        <InputLabel>Gender</InputLabel>
        <Select
          label="Gender"
          name="gender"
          value={clientData.gender}
          onChange={handleChange}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Contact Number"
        name="contact_no"
        type="tel"
        value={clientData.contact_no}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Client
      </Button>
    </Box>
  );
};

export default AddCustomer;
