import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Container, CssBaseline } from "@mui/material";

import UserOnboardingPage from "./pages/UserOnboarding";
import AdminPage from "./pages/Admin";
import DataTablePage from "./pages/DataTable";

import Header from "./components/Header";

const App = () => {
  const [formConfig, setFormConfig] = useState({
    step2Components: ["aboutMe", "address"],
    step3Components: ["birthdate"],
  });

  return (
    <div>
      <Router>
        <CssBaseline />
        <Header />
        <Container maxWidth="xl">
          <Routes>
            <Route
              path="/"
              element={<UserOnboardingPage formConfig={formConfig} />}
            />
            <Route
              path="/admin"
              element={
                <AdminPage
                  formConfig={formConfig}
                  setFormConfig={setFormConfig}
                />
              }
            />
            <Route path="/data" element={<DataTablePage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
