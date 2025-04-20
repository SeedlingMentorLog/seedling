import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PeopleIcon from "@mui/icons-material/People"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import StarIcon from "@mui/icons-material/Star"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

const LandingPage = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogin = () => {
    navigate("/login")
  }

  const handleSignup = () => {
    navigate("/signup")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const features = [
    {
      icon: <CalendarTodayIcon fontSize="large" sx={{ color: "#57C5CC" }} />,
      title: "Schedule Meetings",
      description: "Easily schedule and manage mentoring sessions with our intuitive calendar system.",
    },
    {
      icon: <PeopleIcon fontSize="large" sx={{ color: "#57C5CC" }} />,
      title: "Find Mentors",
      description: "Connect with experienced mentors who can guide you on your professional journey.",
    },
    {
      icon: <AccessTimeIcon fontSize="large" sx={{ color: "#57C5CC" }} />,
      title: "Track Hours",
      description: "Log and track your mentoring hours to measure progress and growth.",
    },
  ]

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: "white" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: "#57C5CC", fontWeight: 600 }}>
            Seedling
          </Typography>

          {isMobile ? (
            <IconButton edge="end" color="inherit" onClick={toggleMobileMenu} sx={{ color: "#333" }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" sx={{ color: "#333" }}>
                Features
              </Button>
              <Button color="inherit" sx={{ color: "#333" }}>
                About
              </Button>
              <Button color="inherit" sx={{ color: "#333" }}>
                Contact
              </Button>
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  borderColor: "#57C5CC",
                  color: "#57C5CC",
                  "&:hover": {
                    borderColor: "#7ac9c9",
                    backgroundColor: "rgba(143, 215, 215, 0.04)",
                  },
                }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                onClick={handleSignup}
                sx={{
                  backgroundColor: "#57C5CC",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#7ac9c9",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMobileMenu}>
          <List>
            <ListItem button>
              <ListItemText primary="Features" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogin}>
              <ListItemText primary="Log In" />
            </ListItem>
            <ListItem button onClick={handleSignup}>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#f9fcfc",
          position: "relative",
          overflow: "hidden",
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
        }}
      >
        {/* Background shapes */}
        <Box
          sx={{
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "#e6f7f7",
            width: "600px",
            height: "600px",
            bottom: "-300px",
            left: "-200px",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "#e6f7f7",
            width: "400px",
            height: "400px",
            top: "-200px",
            right: "-100px",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  color: "#333",
                }}
              >
                Grow Your Potential with Mentorship
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#666",
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                Connect with mentors, schedule meetings, and track your progress all in one place.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSignup}
                  sx={{
                    backgroundColor: "#57C5CC",
                    color: "white",
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#7ac9c9",
                    },
                    flexGrow: { xs: 1, sm: 0 },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleLogin}
                  sx={{
                    borderColor: "#57C5CC",
                    color: "#57C5CC",
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#7ac9c9",
                      backgroundColor: "rgba(143, 215, 215, 0.04)",
                    },
                    flexGrow: { xs: 1, sm: 0 },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 600, mb: 2, color: "#333" }}>
          Features
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: "#666", mb: 8, maxWidth: 700, mx: "auto" }}>
          Seedling provides all the tools you need for successful mentorship relationships
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  p: 2,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: "#f9fcfc", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 600, mb: 2, color: "#333" }}>
            How It Works
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: "#666", mb: 8, maxWidth: 700, mx: "auto" }}>
            Getting started with Seedling is easy
          </Typography>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/placeholder.svg?height=400&width=500"
                alt="Platform screenshot"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e6f7f7",
                      color: "#57C5CC",
                      width: 48,
                      height: 48,
                      fontWeight: 600,
                    }}
                  >
                    1
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Create an Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Sign up as a mentor or mentee and complete your profile with your interests and goals.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e6f7f7",
                      color: "#57C5CC",
                      width: 48,
                      height: 48,
                      fontWeight: 600,
                    }}
                  >
                    2
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Find Your Match
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Browse through potential mentors or mentees and connect with those who align with your goals.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e6f7f7",
                      color: "#57C5CC",
                      width: 48,
                      height: 48,
                      fontWeight: 600,
                    }}
                  >
                    3
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Schedule Sessions
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Use our calendar to schedule meetings, set goals, and track your progress over time.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: "#57C5CC",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background shapes */}
        <Box
          sx={{
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            width: "400px",
            height: "400px",
            bottom: "-200px",
            left: "-100px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            width: "300px",
            height: "300px",
            top: "-150px",
            right: "-50px",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: "white" }}>
              Ready to Start Your Mentorship Journey?
            </Typography>
            <Typography variant="h6" sx={{ color: "white", mb: 4, opacity: 0.9, maxWidth: 700, mx: "auto" }}>
              Join thousands of mentors and mentees who are growing together on our platform.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleSignup}
              sx={{
                backgroundColor: "white",
                color: "#57C5CC",
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>

    </Box>
  )
}

export default LandingPage
