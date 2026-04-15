import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Automatically prefix all API calls with our server URL from .env (e.g. backend domain)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";
// Required to send and receive JWT cookies cross-origin
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
