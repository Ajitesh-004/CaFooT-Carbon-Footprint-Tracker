import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { LoginAPI } from "../api_calls/LoginAPI";
import { Alert, Snackbar, Box, Typography } from "@mui/material";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await LoginAPI(email, password);
      const { user, token, message } = response;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      setSnackbarMessage(message || "Login successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      navigate("/dashboard");
    } catch (err: any) {
      setSnackbarMessage(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-800 to-blue-900 p-6 rounded-xl shadow-lg max-w-md w-full text-white relative">
        {/* Glow Effects */}
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-green-500 blur-3xl opacity-30"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-500 blur-3xl opacity-30"></div>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Typography variant="h5" className="font-bold">
            CaFooT
          </Typography>
          <Typography variant="body2" className="text-gray-300">
            Secure Login to Your Carbon Footprint Tracker Portal
          </Typography>
        </div>

        {/* Welcome Message */}
        <Typography variant="h6" className="text-teal-400 mb-4 text-center">
          Welcome back!
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box
            className="p-4 rounded-lg shadow-lg bg-white/10 border border-teal-500"
            component="div"
          >
            {/* Email Field */}
            <div className="mb-4 relative">
              <label className="block text-white font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-white/80 h-6 w-6" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-12 border border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-teal-600 dark:text-white hover:shadow-teal-500/50"
                  placeholder="Enter your email"
                  required
                  aria-label="Email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-white font-medium mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-white/80 h-6 w-6" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-12 border border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-teal-600 dark:text-white hover:shadow-teal-500/50"
                  placeholder="Enter your password"
                  required
                  aria-label="Password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <AiFillEye className="text-white/80 h-6 w-6" />
                  ) : (
                    <AiFillEyeInvisible className="text-white/80 h-6 w-6" />
                  )}
                </span>
              </div>
            </div>
          </Box>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 mt-6 font-bold text-white bg-teal-500 rounded-lg transition-all duration-300 hover:bg-teal-600 ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <br />
        {/* Register Redirect */}
        <Typography
          variant="body2"
          className="text-gray-300 text-center cursor-pointer hover:underline hover:text-teal-400 mt-4"
          onClick={() => navigate("/register")}
        >
          Not registered? Click here to register.
        </Typography>

        {/* Inspirational Quote */}
        <Box className="mt-8 text-center">
          <Typography variant="body2" className="text-gray-400 italic">
            "The Earth is what we all have in common." - Wendell Berry
          </Typography>
        </Box>

        {/* Snackbar for all messages */}
        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              bgcolor: snackbarSeverity === "success" ? "green" : "red",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Login;