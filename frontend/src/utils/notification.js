// src/utils/notification.js
import { toast } from "react-toastify";
// The CSS import below has been removed. It should only be in App.js or your root.
// import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    closeButton: false,
    ariaLive: "polite",
    ...options,
  });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    closeButton: false,
    ariaLive: "polite",
    ...options,
  });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    closeButton: false,
    ariaLive: "polite",
    ...options,
  });
};

// You might also expose the `toast` object itself if you need more advanced control.
export default toast;
