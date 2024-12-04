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
import { useAlert } from "../../context/AlertContext";
import TransactionSummary from "./TransactionSummary";

const getRandomDarkColor = (number) => {
  // const hue = Math.floor(Math.random() * 360);
  return `hsl(${number}, 30%, 50%)`;
};

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(true); // Added state for fetching
  const [order, setOrder] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [transactionDetails, setTransactionDetails] = useState({});
  const [customers, setCustomers] = useState([]); // Added state for customers
  const [colours, setColours] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isTransactionReceiptModalOpen, setIsTransactionReceiptModalOpen] =
    useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchProducts();
      fetchCustomers();
    }
  }, [authToken, navigate]);

  useEffect(() => {
    calculateTotalAmount();
  }, [order]);

  const fetchProducts = async () => {
    setIsFetching(true); // Set isFetching to true before fetching
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/inventory-lists",
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
        "http://localhost:8000/api/staff/show-client",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleCreateSuccess = () => {
    showAlert(`Transaction successfully saved.`, "success");
  };

  const handleError = (errorMessage) => {
    showAlert(
      errorMessage || "An error occurred while saving the transaction!",
      "error"
    );
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

  const handleNavigateToCustomerList = () => {
    if (confirm("Do you want to go to customer list?")) {
      navigate("/customer-list");
    }
  };

  const handleOpenCustomerModal = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCloseCustomerModal = async () => {
    setIsCustomerModalOpen(false);
  };

  const handleProceedPayment = async (e) => {
    e.preventDefault();
    setIsCustomerModalOpen(false);

    const change = parseFloat(amountPaid) - totalAmount;

    setTransactionDetails({
      customerName,
      totalAmount,
      amountPaid: parseFloat(amountPaid),
      change,
      items: order,
    });

    if (amountPaid < totalAmount) {
      handleError("Insufficient payment amount!");
    } else {
      setIsTransactionReceiptModalOpen(true);
    }
  };

  const handleFinalizeTransaction = async () => {
    if (
      confirm(
        "Are you sure all the details are correct before continuing? This action cannot be undone."
      )
    ) {
      try {
        await createTransaction();
        setIsTransactionReceiptModalOpen(false);
        setIsReceiptModalOpen(true);
        handleCreateSuccess();
      } catch (error) {
        handleError();
      }
    }
  };

  const calculateTotalAmount = () => {
    const total = order.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const createTransaction = async () => {
    const transactionData = {
      client_id: customerId,
      items: order.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/staff/cart/checkout",
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setOrder([]);
    setCustomerId(null);
    setCustomerName("");
    setAmountPaid("");
    setTransactionDetails({});
  };

  return (
    <>
      <Header title="POS SYSTEM" subtitle="Welcome to your point of sale" />

      <Box sx={{ padding: 4, backgroundColor: colors.primary[400] }}>
        <Grid container spacing={2}>
          {isFetching
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton
                    sx={{ borderRadius: "8px" }}
                    variant="rectangular"
                    width="100%"
                    height={150}
                  />
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
          <Typography
            fontSize={"1rem"}
            marginTop={"0.25rem"}
            key={"total"}
            variant="body1"
          >
            Total - ₱{totalAmount}
          </Typography>
        </Box>

        {/* Complete Order Button */}
        {order.length > 0 && (
          <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="info"
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
          component={"form"}
          onSubmit={handleProceedPayment}
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
            options={[
              { id: "new", fullname: "-- New Customer --" },
              ...customers,
            ]}
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
                setCustomerId(newValue.id);
                if (newValue) {
                  setCustomerId(newValue.id);
                  setCustomerName(newValue.fullname);
                  if (newValue.id === "new") {
                    handleNavigateToCustomerList();
                  }
                } else {
                  setCustomerId(null);
                  setCustomerName("");
                }
              } else {
                setCustomerId(null);
                setCustomerName("");
              }
            }}
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            label="Amount Paid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            fullWidth
            required
            type="number"
            sx={{ mb: 2 }}
          />

          <Button variant="contained" color="primary" type="submit">
            Complete Transaction
          </Button>
        </Box>
      </Modal>

      {isTransactionReceiptModalOpen && (
        <TransactionSummary
          transactionDetails={transactionDetails}
          onClose={() => setIsTransactionReceiptModalOpen(false)}
          onProceed={handleFinalizeTransaction}
        />
      )}

      {/* Receipt Modal */}
      <Modal
        open={isReceiptModalOpen}
        onClose={handleCloseReceiptModal}
        aria-labelledby="receipt-modal"
        aria-describedby="receipt-modal-description"
        style={{ overflowY: "auto" }}
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
