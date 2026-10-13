import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles.css";

const interests = [
  { id: "MUSIC", icon: "🎸", label: "Live music" },
  { id: "WORKSHOP", icon: "🎨", label: "Hands-on workshops" },
  { id: "FOOD", icon: "🍜", label: "Food & culture" },
  { id: "COMEDY", icon: "😂", label: "Comedy & theatre" },
  { id: "SPORTS", icon: "⚽", label: "Sports" },
  { id: "TECH", icon: "💡", label: "Tech & learning" },
];
const moods = [
  { id: "CHILL", label: "Relaxed", detail: "A calm, creative plan", icon: "🌿" },
  { id: "SOCIAL", label: "Social", detail: "Meet people and share an experience", icon: "🫶" },
  { id: "ENERGY", label: "High energy", detail: "Music, cheering and big moments", icon: "⚡" },
  { id: "LEARN", label: "Learn something", detail: "Leave with a new skill or idea", icon: "🧠" },
];

function scoreEvent(event, interest, mood) {
  const text = `${event.title || ""} ${event.description || ""} ${event.category || ""}`.toLowerCase();
  const category = (event.category || "").toUpperCase();
  let score = 0;
  const keywords = {
    MUSIC: ["music", "concert", "indie", "open mic", "live"],
    WORKSHOP: ["workshop", "pottery", "paint", "art", "craft", "candle", "coffee", "terrarium", "masterclass"],
    FOOD: ["food", "culture", "coffee", "taste", "festival"],
    COMEDY: ["comedy", "theatre", "theater", "stand-up", "funny"],
    SPORTS: ["sport", "football", "cricket", "match", "stadium"],
    TECH: ["tech", "innovation", "summit", "learn", "conference", "coding"]
  };
  if (interest === "MUSIC" && ["MUSIC", "CONCERT"].includes(category)) score += 5;
  if (interest === "WORKSHOP" && category === "WORKSHOP") score += 7;
  if (interest === "FOOD" && ["FOOD", "FESTIVAL"].includes(category)) score += 4;
  if (interest === "COMEDY" && ["COMEDY", "THEATRE", "THEATER"].includes(category)) score += 6;
  if (interest === "SPORTS" && category === "SPORTS") score += 7;
  if (interest === "TECH" && ["TECH", "CONFERENCE"].includes(category)) score += 5;
  score += (keywords[interest] || []).reduce((sum, word) => sum + (text.includes(word) ? 2 : 0), 0);
  if (mood === "CHILL" && /pottery|paint|art|terrarium|candle|acoustic|coffee/.test(text)) score += 4;
  if (mood === "SOCIAL" && /festival|open mic|workshop|food|culture|network/.test(text)) score += 3;
  if (mood === "ENERGY" && /concert|music|football|sport|festival|live/.test(text)) score += 4;
  if (mood === "LEARN" && /workshop|learn|masterclass|summit|innovation|pottery|brewing/.test(text)) score += 4;
  return score;
}

export default function VibeMatch() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interest, setInterest] = useState("WORKSHOP");
  const [mood, setMood] = useState("CHILL");
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err.response?.data?.message || "Couldn't load events. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  const recommendations = useMemo(() => events
    .filter((event) => !event.status || ["APPROVED", "PUBLISHED", "ACTIVE"].includes(String(event.status).toUpperCase()))
    .map((event) => ({ ...event, matchScore: scoreEvent(event, interest, mood) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6), [events, interest, mood]);

  const book = (id) => {
    if (!localStorage.getItem("ticketflowUser")) return navigate("/login");
    navigate(`/customer/book/${id}`);
  };

  return <div style={{ minHeight: "100vh", background: "var(--background, #f5f7fb)" }}>
    <Navbar />
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 22px 64px" }}>
      <section style={{ borderRadius: 26, padding: "clamp(24px, 5vw, 48px)", color: "white", background: "linear-gradient(125deg, #111827, #253e80 62%, #6d5bd0)", marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, opacity: .85 }}>TICKETFLOW VIBE MATCH</div>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", lineHeight: 1.1, margin: "12px 0" }}>Your next great plan starts here.</h1>
        <p style={{ maxWidth: 650, lineHeight: 1.7, opacity: .9, margin: 0 }}>Tell us what you’re into and the kind of day you want. We’ll match you with events and experiences from the TicketFlow lineup.</p>
      </section>

      <section style={{ background: "var(--surface, #fff)", border: "1px solid var(--border, #e5e7eb)", borderRadius: 22, padding: "clamp(18px, 3vw, 30px)", marginBottom: 30 }}>
        <h2 style={{ marginTop: 0 }}>1. What are you in the mood for?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 12 }}>
          {interests.map((item) => <button key={item.id} type="button" onClick={() => { setInterest(item.id); setMatched(true); }} aria-pressed={interest === item.id} style={{ cursor: "pointer", textAlign: "left", borderRadius: 15, padding: 16, border: interest === item.id ? "2px solid #3563eb" : "1px solid var(--border, #e5e7eb)", background: interest === item.id ? "#edf2ff" : "var(--surface, white)", color: "var(--text, #172033)" }}><span style={{ fontSize: 27 }}>{item.icon}</span><div style={{ fontWeight: 750, marginTop: 8 }}>{item.label}</div></button>)}
        </div>
        <h2 style={{ marginTop: 28 }}>2. Choose your vibe</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          {moods.map((item) => <button key={item.id} type="button" onClick={() => { setMood(item.id); setMatched(true); }} aria-pressed={mood === item.id} style={{ cursor: "pointer", textAlign: "left", borderRadius: 15, padding: 16, border: mood === item.id ? "2px solid #3563eb" : "1px solid var(--border, #e5e7eb)", background: mood === item.id ? "#edf2ff" : "var(--surface, white)", color: "var(--text, #172033)" }}><span style={{ fontSize: 25 }}>{item.icon}</span><div style={{ fontWeight: 750, marginTop: 8 }}>{item.label}</div><small style={{ display: "block", marginTop: 5, color: "var(--text-muted, #64748b)", lineHeight: 1.5 }}>{item.detail}</small></button>)}
        </div>
        <button type="button" onClick={() => setMatched(true)} style={{ marginTop: 22, border: 0, borderRadius: 12, padding: "13px 20px", background: "#2859e8", color: "white", fontWeight: 800, cursor: "pointer" }}>Find my matches ✨</button>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap", marginBottom: 18 }}><div><div style={{ color: "#3563eb", fontSize: 12, letterSpacing: 1.6, fontWeight: 800 }}>PICKED FOR YOUR VIBE</div><h2 style={{ margin: "6px 0" }}>{matched ? "Your best-fit experiences" : "Suggested experiences"}</h2></div><span style={{ color: "var(--text-muted, #64748b)" }}>Based on your choices · updates instantly</span></div>
        {loading && <p>Finding events for you…</p>}
        {error && <div role="alert" style={{ padding: 16, borderRadius: 12, background: "#fff1f2", color: "#9f1239" }}>{error}</div>}
        {!loading && !error && recommendations.length === 0 && <div style={{ padding: 26, borderRadius: 16, background: "white" }}>No events are available yet. Ask the organizer to publish an event, then refresh this page.</div>}
        {!loading && !error && recommendations.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 18 }}>
          {recommendations.map((event, index) => <article key={event.id} style={{ overflow: "hidden", borderRadius: 18, border: "1px solid var(--border, #e5e7eb)", background: "var(--surface, white)", boxShadow: "0 8px 26px rgba(15,23,42,.05)" }}>
            <div style={{ height: 155, background: "linear-gradient(135deg,#dbeafe,#ede9fe)", overflow: "hidden", position: "relative" }}>{event.imageUrl ? <img src={event.imageUrl} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 46 }}>🎟️</div>}<span style={{ position: "absolute", top: 12, left: 12, borderRadius: 999, padding: "6px 10px", background: "rgba(17,24,39,.86)", color: "white", fontSize: 11, fontWeight: 800 }}>{index === 0 ? "BEST MATCH" : `${Math.max(75, 96 - index * 6)}% VIBE FIT`}</span></div>
            <div style={{ padding: 18 }}><div style={{ fontSize: 11, color: "#3563eb", fontWeight: 800, letterSpacing: 1 }}>{event.category || "EXPERIENCE"}</div><h3 style={{ margin: "8px 0", fontSize: 19 }}>{event.title}</h3><p style={{ color: "var(--text-muted, #64748b)", fontSize: 13, lineHeight: 1.6, minHeight: 42 }}>{event.description || "Discover this upcoming TicketFlow experience."}</p><div style={{ fontSize: 13, marginBottom: 6 }}>📍 {event.venue?.name || "Venue to be announced"}</div><div style={{ fontSize: 13, marginBottom: 16 }}>📅 {event.eventDate ? new Date(`${event.eventDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date to be announced"}</div><button type="button" onClick={() => book(event.id)} style={{ width: "100%", border: 0, borderRadius: 10, padding: 12, background: "#2859e8", color: "white", fontWeight: 800, cursor: "pointer" }}>View seats & book →</button></div>
          </article>)}
        </div>}
        <div style={{ textAlign: "center", marginTop: 28 }}><button type="button" onClick={() => navigate("/events")} style={{ padding: "12px 18px", borderRadius: 10, border: "1px solid var(--border, #dbe1eb)", background: "transparent", cursor: "pointer", fontWeight: 700 }}>Browse every event instead</button></div>
      </section>
    </main>
  </div>;
}
