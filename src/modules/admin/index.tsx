import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

import { FormConfig } from "../../global.types";
import { Snackbar } from "../../components/Snackbar";

interface AdminProps {
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig>>;
  formConfig: FormConfig;
}

const Admin: React.FC<AdminProps> = ({ setFormConfig, formConfig }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const information = ["aboutMe", "address", "birthdate"];

  // Handle component changes for Step 2 and Step 3
  const handleComponentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    section: "step2Components" | "step3Components"
  ) => {
    const { name, checked } = event.target;

    setFormConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };

      // Add the component to the respective step if checked
      if (checked) {
        updatedConfig[section].push(name);
      } else {
        // Remove it if unchecked
        updatedConfig[section] = updatedConfig[section].filter(
          (component) => component !== name
        );
      }

      return updatedConfig;
    });
  };

  // Handle disabling checkboxes for the opposite step
  const isComponentDisabled = (
    component: string,
    step: "step2" | "step3"
  ): boolean => {
    return step === "step2"
      ? formConfig.step3Components.includes(component)
      : formConfig.step2Components.includes(component);
  };

  // Check if at least one component is selected in each step
  const isStep2Valid = !!formConfig.step2Components.length;
  const isStep3Valid = !!formConfig.step3Components.length;

  // Function to handle Snackbar close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Function to show Snackbar
  const handleSave = () => {
    setOpenSnackbar(true); // Open Snackbar on Save
  };

  // generic function to setup the configuration for both steps
  const StepConfiguration = ({
    stepKey,
    title,
    selectedComponents,
    isValid,
  }: StepConfigurationArgs) => (
    <Box sx={{ marginTop: stepKey === "step3Components" ? 3 : 0 }}>
      <Typography variant="subtitle1">{title}</Typography>
      {information.map((component) => (
        <FormControlLabel
          key={component}
          control={
            <Checkbox
              name={component}
              checked={selectedComponents.includes(component)}
              onChange={(e) => handleComponentChange(e, stepKey)}
              disabled={isComponentDisabled(
                component,
                stepKey === "step2Components" ? "step2" : "step3"
              )}
            />
          }
          label={component.charAt(0).toUpperCase() + component.slice(1)}
        />
      ))}
      {!isValid && (
        <Alert severity="warning" sx={{ marginTop: 2 }}>
          You must select at least one component for {title}.
        </Alert>
      )}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Admin Section: Configure Form
      </Typography>
      <StepConfiguration
        stepKey="step2Components"
        title="Step 2 Configuration"
        selectedComponents={formConfig.step2Components}
        isValid={isStep2Valid}
      />
      <StepConfiguration
        stepKey="step3Components"
        title="Step 3 Configuration"
        selectedComponents={formConfig.step3Components}
        isValid={isStep3Valid}
      />
      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isStep2Valid || !isStep3Valid} // Disable save button if either step is invalid
        >
          Save
        </Button>
      </Box>

      <Snackbar
        isOpen={openSnackbar}
        onClose={handleCloseSnackbar}
        message="Configuration saved successfully!"
        severity="success"
      />
    </Box>
  );
};

export default Admin;

interface StepConfigurationArgs {
  stepKey: "step2Components" | "step3Components";
  title: string;
  selectedComponents: string[];
  isValid: boolean;
}
