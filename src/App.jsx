import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Login from "./components/Login";
import Dashboard from "./scenes/dashboard";
import Customerlist from "./scenes/customerlist";
import Settings from "./scenes/settings";
import Monthlylist from "./scenes/monthlylist";
import Payment from "./components/payment";
import PaymentForm from "./components/paymentForm";
import PaymentReceipt from "./components/paymentReceipt";
import CustomerArchive from "./scenes/customerlist/customerArchive";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Update from "./components/update";
import AccountSettings from "./scenes/settings/accountSettings";
import Products from "./scenes/products";
import MonthPaymentForm from "./scenes/products/monthPaymentForm";
import ChangePassword from "./components/changePassword";
import ForgotPassword from "./components/forgotPassword";
import EmployeeAttendance from "./scenes/employeeAttendance";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import Subscriptions from "./scenes/subscriptions";

// import InventoryForm from "./scenes/inventory/inventoryForm.jsx";
import EquipmentTable from "./scenes/inventory/equipmentTable.jsx";
import InventoryTable from "./scenes/inventory/inventoryTable.jsx";
import Report from "./scenes/inventory/report.jsx";
import Profile from "./components/Profile.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    document.title = "The Gym Republic | Staff"; // Set the title here
  }, []);

  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <div className="app">
                <ContentLayout
                  isSidebar={isSidebar}
                  setIsSidebar={setIsSidebar}
                />
              </div>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

function ContentLayout({ isSidebar, setIsSidebar }) {
  const location = useLocation();

  // Define routes where Sidebar and Topbar should be hidden
  const hideSidebarAndTopbar = [
    "/",
    "/change-password",
    "/forgot-password",
    "/payment-form",
    "/payment-receipt",
  ].includes(location.pathname);

  return (
    <>
      {!hideSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}
      <main className="content">
        {!hideSidebarAndTopbar && <Topbar setIsSidebar={setIsSidebar} />}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer-list" element={<Customerlist />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-form" element={<PaymentForm />} />
          <Route path="/payment-receipt" element={<PaymentReceipt />} />
          <Route path="/update" element={<Update />} />
          <Route path="/employee-attendance" element={<EmployeeAttendance />} />

          <Route path="/customer-archive" element={<CustomerArchive />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/products" element={<Products />} />
          <Route path="/month-payment-form" element={<MonthPaymentForm />} />
          <Route path="/monthly-list" element={<Monthlylist />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscriptions" element={<Subscriptions />} />

          {/* <Route path="/inventoryform" element={<InventoryForm />} /> */}
          <Route path="/equipmentTable" element={<EquipmentTable />} />
          <Route path="/inventory-table" element={<InventoryTable />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
