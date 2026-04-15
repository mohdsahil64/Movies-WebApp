import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromTMDB = async (url, retries = 4) => {
	const options = {
		headers: {
			accept: "application/json",
			Authorization: "Bearer " + ENV_VARS.TMDB_API_KEY,
		},
		timeout: 8000, // 8 second timeout
	};

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const response = await axios.get(url, options);
			if (response.status !== 200) {
				throw new Error("Failed to fetch data from TMDB: " + response.statusText);
			}
			return response.data;
		} catch (error) {
			const isLastAttempt = attempt === retries;
			const isRetryable =
				error.code === "ECONNRESET" ||
				error.code === "ETIMEDOUT" ||
				error.code === "ECONNABORTED";

			if (isRetryable && !isLastAttempt) {
				// Wait 1500ms before retrying to allow network to stabilize
				await new Promise((r) => setTimeout(r, 1500));
				continue;
			}
			throw error;
		}
	}
};

