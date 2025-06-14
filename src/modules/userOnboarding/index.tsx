import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import {
  Box,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import { auth } from "../../lib/firebase";
import { FormConfig, Severity } from "../../global.types";
import { Snackbar } from "../../components/Snackbar";
import { createUser, saveUserData } from "../../api";

interface UserOnboardingProps {
  formConfig: FormConfig;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ formConfig }) => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const initialFormState = {
    email: "",
    password: "",
    aboutMe: "",
    address: "",
    birthdate: "",
    city: "",
    state: "",
    zipCode: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message?: string;
    severity?: Severity;
  }>({
    isOpen: false,
  });

  const steps = [
    "Step 1: Sign Up",
    "Step 2: Information",
    "Step 3: Additional Information",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: any) => {
        if (user) {
          // User is signed in
          setUserId(user.uid);
          // Skip to Step 2 if the user is already signed in
          setActiveStep(1);
        } else {
          // User is not signed in, stay on Step 1
          setUserId(null);
          setActiveStep(0);
        }
      },
      (error) => {
        console.error("Error detecting auth state: ", error);
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  const handleNext = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (activeStep === 0) {
        // for step 1 create new user
        const uid = await createUser(auth, formData.email, formData.password);
        setUserId(uid);
      } else if (activeStep === 2) {
        if (userId) {
          // save the user information once users passes the step 3
          await saveUserData(userId, formData);
          // snackbar for success message
          setSnackbar({
            isOpen: true,
            severity: "success",
            message: "You have successfully completed the onboarding process!",
          });
          // reset states
          setUserId("");
          setActiveStep(0);
          setFormData(initialFormState);
          await signOut(auth);
          navigate("/data");
        }
      }
      updateStep();
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleError = (error: any) => {
    let errorMessage = error.message || "Something went wrong";
    let severity: Severity = "error";

    // if the user already exist in firebase show an error message
    if ((error as FirebaseError).code === "auth/email-already-in-use") {
      errorMessage = "You have already been Onboarded";
      severity = "warning";
    }

    setSnackbar({
      isOpen: true,
      severity: severity,
      message: errorMessage,
    });
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ isOpen: false });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name: string; value: string }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderFields = (components: string[]) => {
    return (
      <>
        {components.includes("email") && (
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            type="email"
            sx={{ marginBottom: 2 }}
            required
          />
        )}

        {components.includes("password") && (
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            type="password"
            required
            inputProps={{ minLength: 6 }}
          />
        )}
        {components.includes("aboutMe") && (
          <TextField
            label="About Me"
            name="aboutMe"
            value={formData.aboutMe || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: 2 }}
            required
          />
        )}

        {components.includes("address") && (
          <>
            <TextField
              label="Street Address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="City"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="State"
              name="state"
              value={formData.state || ""}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Zip Code"
              name="zipCode"
              type="number"
              value={formData.zipCode || ""}
              onChange={handleChange}
              fullWidth
              required
            />
          </>
        )}

        {components.includes("birthdate") && (
          <TextField
            label="Birthdate"
            name="birthdate"
            type="date"
            value={formData.birthdate || ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        )}
      </>
    );
  };

  const renderStep1Fields = () => renderFields(["email", "password"]);

  const renderStep2Fields = () => renderFields(formConfig.step2Components);

  const renderStep3Fields = () => renderFields(formConfig.step3Components);

  return (
    <Box>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ marginBottom: 5, marginTop: 5 }}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ marginTop: 2 }} component={"form"} onSubmit={handleNext}>
        {activeStep === 0 && renderStep1Fields()}
        {activeStep === 1 && renderStep2Fields()}
        {activeStep === 2 && renderStep3Fields()}

        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{ mr: 2 }}
            disabled={activeStep === 0 || activeStep === 1 || loading}
          >
            Back
          </Button>
          <Button variant="contained" type="submit" loading={loading}>
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </Box>

      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default UserOnboarding;
