import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
	ChevronLeft,
	ChevronRight,
	Play,
	Film,
	Download,
	X,
	Server,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

const getVidsrcInUrl = (id, type) =>
	type === "movie"
		? `https://vidsrc.in/embed/movie/${id}`
		: `https://vidsrc.in/embed/tv/${id}/1/1`;

const getVidsrcCcUrl = (id, type) =>
	type === "movie"
		? `https://vidsrc.cc/v2/embed/movie/${id}`
		: `https://vidsrc.cc/v2/embed/tv/${id}/1/1`;

const getVidsrcVipUrl = (id, type) =>
	type === "movie"
		? `https://vidsrc.vip/embed/movie/${id}`
		: `https://vidsrc.vip/embed/tv/${id}/1/1`;

const getVidsrcProUrl = (id, type) =>
	type === "movie"
		? `https://vidsrc.pro/embed/movie/${id}`
		: `https://vidsrc.pro/embed/tv/${id}/1/1`;

const get2EmbedUrl = (id, type) =>
	type === "movie"
		? `https://www.2embed.cc/embed/${id}`
		: `https://www.2embed.cc/embedtv/${id}&s=1&e=1`;


/* ─────────────────────────────────────────────
   Download quality options
───────────────────────────────────────────── */
const qualities = [
	{ label: "480p", size: "~700 MB", tag: "SD" },
	{ label: "720p", size: "~1.2 GB", tag: "HD" },
	{ label: "1080p", size: "~2.4 GB", tag: "FHD" },
	{ label: "4K", size: "~8 GB", tag: "UHD" },
];

/* ─────────────────────────────────────────────
   Download Modal
───────────────────────────────────────────── */
function DownloadModal({ content, contentType, tmdbId, onClose }) {
	const [selected, setSelected] = useState(null);
	const [preparing, setPreparing] = useState(false);

	const handleDownload = (q) => {
		setSelected(q.label);
		setPreparing(true);

		setTimeout(() => {
			setPreparing(false);
			// Smart redirect — tries vidsrc download endpoint first
			const name = encodeURIComponent(content?.title || content?.name || "movie");
			const url =
				contentType === "movie"
					? `https://dl.vidsrc.vip/movie/${tmdbId}`
					: `https://dl.vidsrc.vip/tv/${tmdbId}`;
			window.open(url, "_blank");
		}, 2000);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
			style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
		>
			{/* Modal Card */}
			<div className="w-full sm:max-w-md bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
					<div className="flex items-center gap-2">
						<Download size={18} className="text-red-500" />
						<span className="font-bold text-white text-base">Download</span>
					</div>
					<button
						onClick={onClose}
						className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition"
					>
						<X size={16} />
					</button>
				</div>

				{/* Movie info row */}
				<div className="flex items-center gap-3 px-5 py-3 bg-gray-800/50 border-b border-gray-800">
					{content?.poster_path && (
						<img
							src={SMALL_IMG_BASE_URL + content.poster_path}
							alt="poster"
							className="w-10 h-14 rounded object-cover flex-shrink-0"
						/>
					)}
					<div>
						<p className="text-white font-semibold text-sm leading-tight">
							{content?.title || content?.name}
						</p>
						<p className="text-gray-400 text-xs mt-0.5">
							{formatReleaseDate(content?.release_date || content?.first_air_date)}
						</p>
					</div>
				</div>

				{/* Quality Options */}
				<div className="px-5 py-4">
					<p className="text-gray-400 text-xs mb-3 uppercase tracking-wider font-medium">
						Select Quality
					</p>
					<div className="grid grid-cols-2 gap-3">
						{qualities.map((q) => (
							<button
								key={q.label}
								onClick={() => handleDownload(q)}
								disabled={preparing}
								className={`relative flex flex-col items-start px-4 py-3 rounded-xl border transition-all duration-200 text-left group
									${selected === q.label
										? "border-red-500 bg-red-500/10"
										: "border-gray-700 bg-gray-800 hover:border-gray-500 hover:bg-gray-700"
									} ${preparing && selected !== q.label ? "opacity-40 cursor-not-allowed" : ""}`}
							>
								<span className="flex items-center gap-2 w-full">
									<span className="text-white font-bold text-base">{q.label}</span>
									<span
										className={`ml-auto text-xs px-1.5 py-0.5 rounded font-semibold
										${q.tag === "UHD" ? "bg-purple-600/80 text-purple-100"
											: q.tag === "FHD" ? "bg-blue-600/80 text-blue-100"
											: q.tag === "HD" ? "bg-green-600/80 text-green-100"
											: "bg-gray-600/80 text-gray-100"}`}
									>
										{q.tag}
									</span>
								</span>
								<span className="text-gray-400 text-xs mt-0.5">{q.size}</span>

								{/* Preparing indicator */}
								{preparing && selected === q.label && (
									<div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl gap-2">
										<Loader2 size={16} className="text-red-500 animate-spin" />
										<span className="text-red-400 text-sm font-medium">Preparing...</span>
									</div>
								)}
							</button>
						))}
					</div>

					<p className="text-gray-600 text-xs text-center mt-4">
						🔒 Secure download via our servers
					</p>
				</div>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   Main WatchPage
───────────────────────────────────────────── */
const WatchPage = () => {
	const { id } = useParams();
	const [trailers, setTrailers] = useState([]);
	const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState({});
	const [similarContent, setSimilarContent] = useState([]);
	const [activeTab, setActiveTab] = useState("watch");   // "watch" | "trailer"
	const [activeServer, setActiveServer] = useState(1);   // 1=vidsrc.in 2=vidsrc.cc 3=vidsrc.vip 4=vidsrc.pro

	const [showDownload, setShowDownload] = useState(false);
	const { contentType } = useContentStore();
	const sliderRef = useRef(null);

	/* Embed URL based on active server */
	const embedUrl =
		activeServer === 1 ? getVidsrcInUrl(id, contentType) :
		activeServer === 2 ? getVidsrcCcUrl(id, contentType) :
		activeServer === 3 ? getVidsrcVipUrl(id, contentType) :
		getVidsrcProUrl(id, contentType);

	/* ── Fetch ALL data in parallel ── */
	useEffect(() => {
		const fetchAll = async () => {
			setLoading(true);
			try {
				const [trailersRes, similarRes, detailsRes] = await Promise.allSettled([
					axios.get(`/api/v1/${contentType}/${id}/trailers`),
					axios.get(`/api/v1/${contentType}/${id}/similar`),
					axios.get(`/api/v1/${contentType}/${id}/details`),
				]);

				setTrailers(
					trailersRes.status === "fulfilled" ? trailersRes.value.data.trailers : []
				);
				setSimilarContent(
					similarRes.status === "fulfilled" ? similarRes.value.data.similar : []
				);
				setContent(
					detailsRes.status === "fulfilled" ? detailsRes.value.data.content : null
				);
			} catch {
				setContent(null);
			} finally {
				setLoading(false);
			}
		};

		fetchAll();
	}, [contentType, id]);

	/* Reset on id change */
	useEffect(() => {
		setActiveTab("watch");
		setActiveServer(1);
		setCurrentTrailerIdx(0);
	}, [id]);

	const handleNext = () => {
		if (currentTrailerIdx < trailers.length - 1) setCurrentTrailerIdx(currentTrailerIdx + 1);
	};
	const handlePrev = () => {
		if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
	};
	const scrollLeft = () =>
		sliderRef.current?.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
	const scrollRight = () =>
		sliderRef.current?.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });

	/* ── Loading ── */
	if (loading)
		return (
			<div className="min-h-screen bg-black p-10">
				<WatchPageSkeleton />
			</div>
		);

	/* ── Not found ── */
	if (!content)
		return (
			<div className="bg-black text-white h-screen">
				<div className="max-w-6xl mx-auto">
					<Navbar />
					<div className="text-center mx-auto px-4 py-8 h-full mt-40">
						<h2 className="text-2xl sm:text-5xl font-bold text-balance">
							Content not found 😥
						</h2>
					</div>
				</div>
			</div>
		);

	return (
		<div className="bg-black min-h-screen text-white">
			{/* Download Modal */}
			{showDownload && (
				<DownloadModal
					content={content}
					contentType={contentType}
					tmdbId={id}
					onClose={() => setShowDownload(false)}
				/>
			)}

			<div className="mx-auto container px-3 sm:px-4 py-6 sm:py-8 h-full">
				<Navbar />

				{/* ═══ TAB BAR + ACTION BUTTONS ═══ */}
				<div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-0 sm:px-6 md:px-20">
					{/* Left — Tabs */}
					<div className="flex gap-2">
						<button
							onClick={() => setActiveTab("watch")}
							className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200
								${activeTab === "watch"
									? "bg-red-600 text-white shadow-lg shadow-red-600/30"
									: "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
						>
							<Play size={13} />
							Watch
						</button>
						<button
							onClick={() => setActiveTab("trailer")}
							className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200
								${activeTab === "trailer"
									? "bg-red-600 text-white shadow-lg shadow-red-600/30"
									: "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
						>
							<Film size={13} />
							Trailers{trailers.length > 0 ? ` (${trailers.length})` : ""}
						</button>
					</div>

					{/* Right — Server Switcher + Download */}
					{activeTab === "watch" && (
						<div className="flex items-center gap-2">
							{/* Server switcher */}
							<div className="flex items-center bg-gray-800 rounded-full p-1 gap-1">
								{[
									{ num: 1, label: "Server 1 (Hindi Dubbed)" },
									{ num: 2, label: "Server 2 (Multi Audio)" },
									{ num: 3, label: "Server 3 (HDR)" },
									{ num: 4, label: "Server 4 (PRO)" },
								].map((s) => (
									<button
										key={s.num}
										onClick={() => setActiveServer(s.num)}
										className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap
											${activeServer === s.num
												? "bg-red-600 text-white shadow-md"
												: "text-gray-400 hover:text-white"}`}
									>
										<Server size={11} className="shrink-0" />
										{s.label}
									</button>
								))}
							</div>

							{/* Download button */}
							<button
								onClick={() => setShowDownload(true)}
								className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-500 text-gray-300 hover:text-white text-sm font-semibold transition-all duration-200 group"
							>
								<Download
									size={14}
									className="group-hover:text-red-500 transition-colors duration-200"
								/>
								<span className="hidden xs:inline">Download</span>
							</button>
						</div>
					)}
				</div>

				{/* ═══ WATCH NOW — Embed Player ═══ */}
				{activeTab === "watch" && (
					<div className="mb-6 px-0 sm:px-6 md:px-20">
						{/* Player wrapper — nice rounded box */}
						<div
							className="w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-950 shadow-2xl shadow-black/60"
							style={{ height: "56vw", maxHeight: "72vh", minHeight: "240px" }}
						>
							<iframe
								key={`${activeServer}-${id}`}
								src={embedUrl}
								width="100%"
								height="100%"
								allowFullScreen
								allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
								referrerPolicy="origin"
								title={content?.title || content?.name}
								style={{ border: "none", display: "block" }}
							/>
						</div>

						{/* Server status bar */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 px-1 gap-2">
							<div className="flex items-center gap-1.5 text-xs text-gray-400">
								<CheckCircle2 size={12} className="text-green-500" />
								<span>
									Playing via{" "}
									<span className="text-gray-300 font-medium">
										Server {activeServer}
									</span>
								</span>
							</div>
							
							{/* Note for Dual Audio / Hindi Dubbed */}
							<div className="text-xs text-amber-500/90 font-medium flex items-center bg-amber-500/10 px-2.5 py-1 rounded-md">
								<span>💡 Tip: Click on Player's Settings/Audio to switch to Hindi (if available)</span>
							</div>
						</div>
					</div>
				)}

				{/* ═══ TRAILERS — YouTube ReactPlayer ═══ */}
				{activeTab === "trailer" && (
					<div className="mb-6 px-0 sm:px-6 md:px-20">
						{trailers.length > 0 ? (
							<>
								{/* Prev / Next */}
								<div className="flex items-center justify-between mb-3">
									<button
										onClick={handlePrev}
										disabled={currentTrailerIdx === 0}
										className={`flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm transition
											${currentTrailerIdx === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
									>
										<ChevronLeft size={18} /> Prev
									</button>
									<span className="text-gray-400 text-sm">
										{currentTrailerIdx + 1} / {trailers.length}
									</span>
									<button
										onClick={handleNext}
										disabled={currentTrailerIdx === trailers.length - 1}
										className={`flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm transition
											${currentTrailerIdx === trailers.length - 1 ? "opacity-40 cursor-not-allowed" : ""}`}
									>
										Next <ChevronRight size={18} />
									</button>
								</div>

								{/* Player */}
								<div
									className="w-full rounded-xl overflow-hidden border border-gray-800 bg-black"
									style={{ height: "56vw", maxHeight: "72vh", minHeight: "240px" }}
								>
									<ReactPlayer
										controls
										width="100%"
										height="100%"
										url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
									/>
								</div>
							</>
						) : (
							<div
								className="w-full rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-center"
								style={{ height: "240px" }}
							>
								<p className="text-gray-500 text-center px-4">
									No trailers available for{" "}
									<span className="text-red-500 font-semibold">
										{content?.title || content?.name}
									</span>{" "}
									😥
								</p>
							</div>
						)}
					</div>
				)}

				{/* ═══ MOVIE DETAILS ═══ */}
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16 max-w-5xl mx-auto px-0 sm:px-6 md:px-20 mb-12">
					{/* Info */}
					<div className="flex-1 min-w-0">
						<h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
							{content?.title || content?.name}
						</h2>
						<div className="flex flex-wrap items-center gap-2 mt-3">
							<span className="text-gray-400 text-sm">
								{formatReleaseDate(content?.release_date || content?.first_air_date)}
							</span>
							<span className="text-gray-600">•</span>
							<span
								className={`text-xs font-bold px-2 py-0.5 rounded border ${
									content?.adult
										? "border-red-500 text-red-400"
										: "border-green-500 text-green-400"
								}`}
							>
								{content?.adult ? "18+" : "PG-13"}
							</span>
							{content?.vote_average > 0 && (
								<>
									<span className="text-gray-600">•</span>
									<span className="text-yellow-400 text-sm font-semibold">
										⭐ {content.vote_average.toFixed(1)}
									</span>
								</>
							)}
						</div>
						<p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-5">
							{content?.overview}
						</p>

						{/* Action buttons */}
						<div className="flex flex-wrap gap-3 mt-5">
							<button
								onClick={() => { setActiveTab("watch"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
								className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-600/30"
							>
								<Play size={15} fill="white" /> Play Now
							</button>
							<button
								onClick={() => setShowDownload(true)}
								className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
							>
								<Download size={15} /> Download
							</button>
						</div>
					</div>

					{/* Poster */}
					{content?.poster_path && (
						<img
							src={ORIGINAL_IMG_BASE_URL + content.poster_path}
							alt="Poster"
							className="w-36 sm:w-48 md:w-56 rounded-xl shadow-2xl flex-shrink-0 mx-auto md:mx-0"
						/>
					)}
				</div>

				{/* ═══ SIMILAR CONTENT ═══ */}
				{similarContent.length > 0 && (
					<div className="max-w-5xl mx-auto relative px-0 sm:px-6 md:px-20">
						<h3 className="text-xl sm:text-2xl font-bold mb-4">
							Similar {contentType === "movie" ? "Movies" : "Shows"}
						</h3>
						<div
							className="flex overflow-x-scroll scrollbar-hide gap-3 pb-4 group"
							ref={sliderRef}
						>
							{similarContent.map((item) => {
								if (!item.poster_path) return null;
								return (
									<Link
										key={item.id}
										to={`/watch/${item.id}`}
										className="w-32 sm:w-44 flex-none group/card"
									>
										<div className="relative overflow-hidden rounded-lg">
											<img
												src={SMALL_IMG_BASE_URL + item.poster_path}
												alt={item.title || item.name}
												className="w-full h-auto rounded-lg group-hover/card:scale-105 transition-transform duration-300"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-2">
												<Play size={20} className="text-white mx-auto mb-1" />
											</div>
										</div>
										<h4 className="mt-2 text-xs sm:text-sm font-medium text-gray-300 line-clamp-2">
											{item.title || item.name}
										</h4>
									</Link>
								);
							})}

							{/* Scroll arrows — hidden on mobile */}
							<button
								onClick={scrollRight}
								className="hidden sm:flex absolute top-12 -translate-y-1/2 right-0 w-9 h-9 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg"
							>
								<ChevronRight size={18} />
							</button>
							<button
								onClick={scrollLeft}
								className="hidden sm:flex absolute top-12 -translate-y-1/2 left-0 w-9 h-9 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg"
							>
								<ChevronLeft size={18} />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default WatchPage;
