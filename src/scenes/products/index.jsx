import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  Modal,
  TextField,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import POSReceipt from "./POSReceipt";

const getRandomDarkColor = (number) => {
  // const hue = Math.floor(Math.random() * 360);
  return `hsl(${number}, 30%, 50%)`;
};

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(true); // Added state for fetching
  const [order, setOrder] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [newCustomerName, setNewCustomerName] = useState(""); // Added state for new customer name
  const [amountPaid, setAmountPaid] = useState("");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [customers, setCustomers] = useState([]); // Added state for customers
  const [colours, setColours] = useState([]);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchProducts();
      fetchCustomers(); // Fetch customers on component mount
    }
  }, [authToken, navigate]);

  const fetchProducts = async () => {
    setIsFetching(true); // Set isFetching to true before fetching
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-inventory",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const supplements = response.data.data.filter(
        (item) => item.type === "supplement"
      );
      const randomColors = supplements.map((item, index) =>
        getRandomDarkColor(999 * index)
      );
      setColours(randomColors);
      setProducts(supplements);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsFetching(false); // Set isFetching to false after fetching (success or failure)
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-client",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleAddToOrder = (product) => {
    const existingItem = order.find((item) => item.id === product.id);
    if (existingItem) {
      setOrder(
        order.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrder([...order, { ...product, quantity: 1 }]);
    }
  };

  const handleOpenCustomerModal = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCloseCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  const handleCustomerSubmit = async () => {
    let customerId = customerName;

    if (customerName === "new") {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/create-client",
          { fullname: newCustomerName },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status === 201) {
          customerId = response.data.data.id;
        } else {
          console.error("Failed to create new customer");
          return;
        }
      } catch (error) {
        console.error("Error creating new customer:", error);
        return;
      }
    }

    setIsCustomerModalOpen(false);
    setIsReceiptModalOpen(true);

    const totalAmount = order.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const change = parseFloat(amountPaid) - totalAmount;

    setTransactionDetails({
      customerId,
      customerName:
        customerName === "new"
          ? newCustomerName
          : customers.find((c) => c.id === customerName)?.fullname,
      totalAmount,
      amountPaid: parseFloat(amountPaid),
      change,
      items: order,
    });

    // TODO: Send transaction details to the backend
    // This is where you would make an API call to save the transaction
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setOrder([]);
    setCustomerName("");
    setNewCustomerName(""); // Clear new customer name
    setAmountPaid("");
    setTransactionDetails(null);
  };

  return (
    <>
      <Header title="POS SYSTEM" subtitle="Welcome to your point of sale" />

      <Box sx={{ padding: 4, backgroundColor: colors.primary[400] }}>
        <Grid container spacing={2}>
          {isFetching
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={150} />
                </Grid>
              ))
            : products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Box
                    sx={{
                      backgroundColor: colours[index],
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "150px",
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      ₱{product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToOrder(product)}
                    >
                      Add to Order
                    </Button>
                  </Box>
                </Grid>
              ))}
        </Grid>

        {/* Order Section */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Current Order:
          </Typography>
          {order.length > 0 ? (
            order.map((item) => (
              <Typography key={item.id} variant="body1">
                {item.name} - Quantity: {item.quantity} - ₱
                {item.price * item.quantity}
              </Typography>
            ))
          ) : (
            <Typography variant="body1">Your order is empty.</Typography>
          )}
        </Box>

        {/* Complete Order Button */}
        {order.length > 0 && (
          <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenCustomerModal}
            >
              Complete Order
            </Button>
          </Stack>
        )}
      </Box>

      {/* Customer Information Modal */}
      <Modal
        open={isCustomerModalOpen}
        onClose={handleCloseCustomerModal}
        aria-labelledby="customer-modal"
        aria-describedby="customer-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Customer Information
          </Typography>
          <Autocomplete
            options={[{ id: "new", fullname: "New Customer" }, ...customers]}
            getOptionLabel={(option) => option.fullname}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Customer"
                fullWidth
                required
              />
            )}
            onChange={(event, newValue) => {
              if (newValue) {
                setCustomerName(newValue.id);
                if (newValue.id === "new") {
                  setNewCustomerName("");
                }
              } else {
                setCustomerName("");
              }
            }}
            sx={{ mt: 2, mb: 2 }}
          />
          {customerName === "new" && (
            <TextField
              label="New Customer Name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="Amount Paid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            fullWidth
            required
            type="number"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCustomerSubmit}
          >
            Complete Transaction
          </Button>
        </Box>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        open={isReceiptModalOpen}
        onClose={handleCloseReceiptModal}
        aria-labelledby="receipt-modal"
        aria-describedby="receipt-modal-description"
      >
        <POSReceipt
          transactionDetails={transactionDetails}
          onClose={handleCloseReceiptModal}
        ></POSReceipt>
      </Modal>
    </>
  );
};

export default Products;
