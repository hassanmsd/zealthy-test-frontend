import { Alert, Snackbar as MUISnackbar } from "@mui/material";
import { Severity } from "../../global.types";

interface Snackbar {
  isOpen: boolean;
  onClose: () => void;
  severity?: Severity;
  message?: string;
  autoHideDuration?: number;
}

export const Snackbar = ({
  isOpen,
  onClose,
  severity,
  message,
  autoHideDuration = 5000,
}: Snackbar) => {
  return (
    <div>
      {isOpen && (
        <MUISnackbar
          open={isOpen}
          autoHideDuration={autoHideDuration}
          onClose={onClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={onClose} severity={severity} variant="filled">
            {message}
          </Alert>
        </MUISnackbar>
      )}
    </div>
  );
};

export default Snackbar;
