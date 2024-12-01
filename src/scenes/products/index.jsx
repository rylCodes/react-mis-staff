import React, { useState } from "react";
import { Grid, Box, Typography, Button, Stack, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Products = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const products = [
    { name: "SUPPLEMENT", color: "#f4a89a" },
    { name: "WATER", color: "#c5b6f1" },
    { name: "SOFTDRINKS", color: "#aaf4cc" },
    { name: "SOYA", color: "#f4a89a" },
    { name: "Energy drink", color: "#c5b6f1" },
    { name: "Egg", color: "#c5b6f1" },
  ];

  const handleAddToCart = (productName) => {
    if (!cart.includes(productName)) {
      setCart([...cart, productName]);
    }
  };

  const handleSubmit = () => {
    navigate("/month-payment-form", { state: { receipt: cart } }); // Navigate to Receipt Page with cart data
    setCart([]); // Optionally clear the cart
  };

  return (
    <>
    <Header title="PRODUCTS" subtitle="Welcome to your dashboard" />

   
    <Box sx={{ padding: 4,backgroundColor: colors.primary[400] }}>
      
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                backgroundColor: product.color,
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
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                {product.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddToCart(product.name)}
                disabled={cart.includes(product.name)} // Disable if already in the cart
              >
                {cart.includes(product.name) ? "Added" : "Add to Cart"}
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Cart Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Cart:
        </Typography>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <Typography key={index} variant="body1">
              - {item}
            </Typography>
          ))
        ) : (
          <Typography variant="body1">Your cart is empty.</Typography>
        )}
      </Box>

      {/* Submit Button */}
      {cart.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Done to Cart
          </Button>
        </Stack>
      )}
    </Box>
     </>
  );
};

export default Products;
