import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SimpleSnackbar = ({
  open,
  message,
  onClose,
  severity="error"
}: {
  open: boolean;
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  onClose: () => void;
}) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SimpleSnackbar;

