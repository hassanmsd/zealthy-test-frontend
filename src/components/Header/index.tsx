import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const Header = () => (
  <AppBar position="static" sx={{ marginBottom: 2 }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        User Onboarding App
      </Typography>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button color="inherit" component={Link} to="/admin">
        Admin
      </Button>
      <Button color="inherit" component={Link} to="/data">
        Data
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header;
