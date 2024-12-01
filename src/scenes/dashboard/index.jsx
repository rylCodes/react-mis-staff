import {
  Box,
  Typography,
  useTheme,
  TextField,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../theme";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import StatBox from "../../components/StatBOx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [activeInstructors, setActiveInstructors] = useState([
    { name: "Mia Aquino", status: "active", employeeId: "EMP001" },
    { name: "John Puti", status: "inactive", employeeId: "EMP002" },
    { name: "Carlo Diaz", status: "active", employeeId: "EMP003" },
    { name: "Patrick Kalan", status: "active", employeeId: "EMP004" },
    { name: "Jose De Giba", status: "active", employeeId: "EMP005" },
  ]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const generateEmployeeId = () => {
    // Generate Employee ID based on the current list length
    return `EMP${(activeInstructors.length + 1).toString().padStart(3, "0")}`;
  };

  const handleTimeIn = () => {
    if (!timeIn) {
      setAlertMessage("Time In cannot be empty!");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    const newEmpId = generateEmployeeId();

    setAlertMessage(`Time In submitted successfully! Employee ID: ${newEmpId}`);
    setAlertType("success");
    setAlertOpen(true);

    setActiveInstructors([
      ...activeInstructors,
      {
        name: `Instructor ${activeInstructors.length + 1}`,
        status: "active",
        employeeId: newEmpId,
      },
    ]);
    setTimeIn("");
  };

  const handleTimeOut = () => {
    if (!timeOut) {
      setAlertMessage("Time Out cannot be empty!");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }
    setAlertMessage("Time Out submitted successfully!");
    setAlertType("success");
    setAlertOpen(true);
    setTimeOut("");
  };

  // Toggle instructor status between "active" and "inactive"
  const toggleInstructorStatus = (name) => {
    setActiveInstructors(
      activeInstructors.map((instructor) =>
        instructor.name === name
          ? {
              ...instructor,
              status: instructor.status === "active" ? "inactive" : "active",
            }
          : instructor
      )
    );
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="49"
            subtitle="Equipment"
            progress="0.75"
            increase="+14%"
            icon={
              <FitnessCenterOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="30"
            subtitle="Products"
            progress="0.50"
            increase="+21%"
            icon={
              <InventoryOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="9"
            subtitle="Customers"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Employee ID
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <TextField
              label="Enter the ID"
              variant="outlined"
              value={timeIn}
              onChange={(e) => setTimeIn(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleTimeIn}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Employee ID
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <TextField
              label="Enter the ID"
              variant="outlined"
              value={timeOut}
              onChange={(e) => setTimeOut(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleTimeOut}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        {/* Active Instructors Section */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          sx={{ maxHeight: "400px", overflowY: "scroll" }}
        >
          <Typography variant="h5" fontWeight="600">
            Active Instructors
          </Typography>
          <Box mt="20px">
            {activeInstructors.map((instructor, index) => (
              <Card
                key={index}
                sx={{
                  padding: "15px",
                  marginBottom: "10px",
                  backgroundColor: colors.primary[400],
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{instructor.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {instructor.status === "active"
                      ? "Active Instructor"
                      : "Inactive Instructor"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Employee ID: {instructor.employeeId}
                  </Typography>
                </CardContent>
                <IconButton
                  onClick={() => toggleInstructorStatus(instructor.name)}
                  color={instructor.status === "active" ? "success" : "error"}
                >
                  {instructor.status === "active" ? (
                    <CheckCircleIcon />
                  ) : (
                    <CancelIcon />
                  )}
                </IconButton>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={2000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
