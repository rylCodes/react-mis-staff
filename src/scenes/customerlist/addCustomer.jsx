import { useState } from "react";
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const AddCustomer = ({ closeModal, onAddCustomer }) => {
  // Price list for each service
  const servicePrices = {
    "Gym Per session": 60,
    "Gym Monthly": 750,
    "Monthly Treadmill": 550,
    "Gym + Treadmill": 1200,
    "P.I Per Session": 120,
    "P.I Monthly": 1500,
    "Zumba": 70,
    "Dance": 30,
    "Muay Thai": 250,
    "Taekwondo": 50,
    "Boxing": 60,
  };

  const [customerData, setCustomerData] = useState({
    name: "",
    sex: "",
    email: "",
    contact: "",
    chosenservices: "",
    instructor: "",
    plan: "",
    amount: "",
    address: "",
    phone: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomerData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      // Automatically update the amount based on the chosen service
      if (name === "chosenservices") {
        updatedData.amount = servicePrices[value] || "";
      }

      return updatedData;
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCustomer(customerData);
    closeModal();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <TextField
        label="Name"
        name="name"
        value={customerData.name}
        onChange={handleChange}
        required
      />
      <FormControl required>
        <InputLabel>Sex</InputLabel>
        <Select
          label="Sex"
          name="sex"
          value={customerData.sex}
          onChange={handleChange}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Email"
        name="email"
        value={customerData.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Contact"
        name="contact"
        value={customerData.contact}
        onChange={handleChange}
        required
      />
      <TextField
        label="Address"
        name="address"
        value={customerData.address}
        onChange={handleChange}
        required
      />
      <FormControl required>
        <InputLabel>Chosen Services</InputLabel>
        <Select
          label="Chosen Services"
          name="chosenservices"
          value={customerData.chosenservices}
          onChange={handleChange}
        >
          {Object.keys(servicePrices).map((service) => (
            <MenuItem key={service} value={service}>{service}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl required>
        <InputLabel>Instructor</InputLabel>
        <Select
          label="Instructor"
          name="instructor"
          value={customerData.instructor}
          onChange={handleChange}
        >
          <MenuItem value="N/A">N/A</MenuItem>
          <MenuItem value="John Puti">John Puti</MenuItem>
          <MenuItem value="Carlo Diaz">Carlo Diaz</MenuItem>
          <MenuItem value="Jose De Giba">Jose De Giba</MenuItem>
        </Select>
      </FormControl>

      <FormControl required>
        <InputLabel>Plan</InputLabel>
        <Select
          label="Plan"
          name="plan"
          value={customerData.plan}
          onChange={handleChange}
        >
          <MenuItem value="N/A">N/A</MenuItem>
          <MenuItem value="1 Week">1 Week</MenuItem>
          <MenuItem value="2 Week">2 Week</MenuItem>
          <MenuItem value="1 Month">1 Month</MenuItem>
          <MenuItem value="2 Month">2 Month</MenuItem>
          <MenuItem value="3 Months">3 Months</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Amount"
        name="amount"
        value={customerData.amount}
        onChange={handleChange}
        disabled // Make this field read-only
      />

      <Button type="submit" variant="contained" color="primary">
        Add Customer
      </Button>
    </Box>
  );
};

export default AddCustomer;
