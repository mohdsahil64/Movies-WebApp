import { fetchFromTMDB } from "../services/tmdb.service.js";

// Hindi + English dono movies fetch karne wala endpoint
// with_original_language=hi,en → Bollywood + Hollywood sab aayega
const MIXED_MOVIES = "https://api.themoviedb.org/3/discover/movie?with_original_language=hi%7Cen&language=en-US&sort_by=popularity.desc";

export async function getTrendingMovie(req, res) {
	try {
		const data = await fetchFromTMDB(
			"https://api.themoviedb.org/3/trending/movie/day?language=en-US"
		);
		const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];
		res.json({ success: true, content: randomMovie });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieTrailers(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
		);
		res.json({ success: true, trailers: data.results });
	} catch (error) {
		if (error.message.includes("404")) return res.status(404).send(null);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieDetails(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/movie/${id}?language=en-US`
		);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) return res.status(404).send(null);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getSimilarMovies(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
		);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMoviesByCategory(req, res) {
	const { category } = req.params;

	// Category + Hindi/English mix
	const categoryMap = {
		popular:     `${MIXED_MOVIES}&page=1`,
		top_rated:   `${MIXED_MOVIES}&vote_count.gte=200&sort_by=vote_average.desc&page=1`,
		now_playing: `${MIXED_MOVIES}&page=1`,
		upcoming:    `${MIXED_MOVIES}&sort_by=release_date.desc&page=1`,
	};

	const url = categoryMap[category] ||
		`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`;

	try {
		const data = await fetchFromTMDB(url);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
