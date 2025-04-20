import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import SidebarComponentSchoolContact from "../../components/SidebarComponentSchoolContact";
import HeaderComponent from "../../components/HeaderComponent";

const DashboardPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Visits", value: 0, icon: "👤" },
    { label: "Visits this Week", value: 0, icon: "📦" },
    { label: "Visits this Month", value: 0, icon: "📈" },
    { label: "Organization Hours", value: 0, icon: "📈" },
  ]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const accessToken = currentUser?.accessToken;
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/get/mentor_logs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        const logs = data.logs || [];
        setLogs(logs);

        const now = new Date();
        const currentWeek = new Date(now);
        currentWeek.setDate(now.getDate() - now.getDay());
        const currentMonth = now.getMonth();

        let totalVisits = logs.length;
        let visitsThisWeek = 0;
        let visitsThisMonth = 0;
        let totalHours = 0;
        const monthlyHours = Array(12).fill(0);

        logs.forEach((log) => {
          const logDate = new Date(log.date);
          totalHours += parseFloat(log.hours_logged || 0);

          if (logDate >= currentWeek) visitsThisWeek++;
          if (logDate.getMonth() === currentMonth) visitsThisMonth++;
          monthlyHours[logDate.getMonth()] += parseFloat(log.hours_logged || 0);
        });

        setStats([
          { label: "Total Visits", value: totalVisits, icon: "👤" },
          { label: "Visits this Week", value: visitsThisWeek, icon: "📦" },
          { label: "Visits this Month", value: visitsThisMonth, icon: "📈" },
          { label: "Organization Hours", value: totalHours.toFixed(0), icon: "📈" },
        ]);

        const monthLabels = [
          "JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE",
          "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"
        ];

        const dataFormatted = monthlyHours.map((hours, i) => ({
          month: monthLabels[i],
          hours: hours,
        }));

        setChartData(dataFormatted);
      } catch (error) {
        console.error("Failed to fetch mentor logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", fontFamily: "Poppins" }}>
      <SidebarComponentSchoolContact currentPage="Dashboard" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <HeaderComponent />
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F5F6FA" }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, fontFamily: "Nunito Sans" }}>
            Dashboard
          </Typography>

          {/* Stats Cards */}
          <Grid container spacing={2} mb={3}>
            {stats.map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#fff",
                  }}
                >
                  <Box sx={{ fontSize: 32, mb: 1 }}>{stat.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontFamily: "Poppins", fontSize: 24 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 400, fontSize: 14, fontFamily: "Poppins", color: "#777" }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Line Chart */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontFamily: "Nunito Sans" }}>
              Mentoring Hours
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#57C5CC"
                  activeDot={{ r: 6 }}
                  dot={{ r: 3 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;