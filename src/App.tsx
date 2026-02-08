import { useState, useEffect, useMemo } from "react";
import { TEvent, TEventType } from "./types";
import { fetchAllEvents } from "./api";
import { sortEventsByStartTime, filterEventsByPermission } from "./utils";
import EventCard from "./EventCard";
import LoginModal from "./LoginModal";
import SkeletonCard from "./SkeletonCard";
import "./App.css";

const VALID_USERNAME = "hacker";
const VALID_PASSWORD = "htn2026";

function App() {
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<TEventType | "all">("all");
  const [highlightedEventId, setHighlightedEventId] = useState<number | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllEvents();
        setEvents(data);
        setError(undefined);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginError(undefined);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => setIsLoggedIn(false);

  const handleRelatedEventClick = (eventId: number) => {
    // Clear filters to ensure the target event is visible
    setSearchQuery("");
    setSelectedEventType("all");
    
    // Use setTimeout to wait for state updates and re-rendering
    setTimeout(() => {
      setHighlightedEventId(eventId);
      const element = document.getElementById(`event-${eventId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlightedEventId(null), 2000);
      }
    }, 100);
  };

  const filteredEvents = useMemo(() => {
    let filtered = filterEventsByPermission(events, isLoggedIn);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.speakers.some((speaker) =>
            speaker.name.toLowerCase().includes(query)
          )
      );
    }
    if (selectedEventType !== "all") {
      filtered = filtered.filter((event) => event.event_type === selectedEventType);
    }
    return sortEventsByStartTime(filtered);
  }, [events, isLoggedIn, searchQuery, selectedEventType]);

  const eventTypes: (TEventType | "all")[] = ["all", "workshop", "activity", "tech_talk"];

  const eventNamesMap = useMemo(() => {
    const map: Record<number, string> = {};
    events.forEach((event) => { map[event.id] = event.name; });
    return map;
  }, [events]);

  const stats = useMemo(() => {
    const total = events.length;
    const privateCount = events.filter((event) => event.permission === "private").length;
    const publicCount = total - privateCount;
    const workshopCount = events.filter((event) => event.event_type === "workshop").length;
    return { total, publicCount, privateCount, workshopCount };
  }, [events]);

  return (
    <div className="app">
      <div className="glow-spot glow-spot-1" aria-hidden="true"></div>
      <div className="glow-spot glow-spot-2" aria-hidden="true"></div>
      <div className="glow-spot glow-spot-3" aria-hidden="true"></div>
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-mark">HTN</div>
            <div className="brand-text">
              <span className="brand-kicker">Hackathon Global Inc.</span>
              <span className="brand-title">Hack the North Events</span>
            </div>
            <div className="signal" aria-hidden="true">
              <span className="signal-dot"></span>
              <span className="signal-text">LIVE</span>
            </div>
          </div>
          <div className="header-actions">
            {isLoggedIn ? (
              <div className="user-info">
                <span className="welcome-text">Hacker Access Enabled</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="login-button-header">Hacker Login</button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="hero">
          <div className="hero-content">
            <p className="hero-kicker">HTN 2026 Schedule Hub</p>
            <h1>Design your hackathon sprint.</h1>
            <p className="hero-lede">
              Discover sessions, mentor hours, and partner events. Public events are open to everyone.
              Log in to unlock private experiences.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="#events">Explore events</a>
              {isLoggedIn ? (
                <span className="status-pill">Logged in</span>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="secondary-cta">Hacker Login</button>
              )}
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-label">Total events</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Public sessions</span>
                <span className="stat-value">{stats.publicCount}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Private sessions</span>
                <span className="stat-value">{stats.privateCount}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Workshops</span>
                <span className="stat-value">{stats.workshopCount}</span>
              </div>
            </div>
            <div className="hero-note">Curate your weekend by mixing talks, builds, and breaks.</div>
          </div>
        </section>

        <section className="filters-section" aria-label="Event filters">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search events, speakers, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search events"
            />
          </div>
          <div className="filter-container">
            <label htmlFor="event-type-filter" className="filter-label">Filter by type:</label>
            <select
              id="event-type-filter"
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value as TEventType | "all")}
              className="filter-select"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Events" : type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </section>

        {isLoading ? (
          <div className="events-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="error-state"><p>{error}</p></div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>No events found matching your criteria.</p>
            {!isLoggedIn && (
              <p className="hint-text">
                <button onClick={() => setIsLoginModalOpen(true)} className="inline-login-button">Log in</button> to see private events
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="events-count" id="events">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </div>
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  id={`event-${event.id}`}
                  className={`event-card-container ${highlightedEventId === event.id ? "highlight-event" : ""}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <EventCard
                    event={event}
                    isLoggedIn={isLoggedIn}
                    onRelatedEventClick={handleRelatedEventClick}
                    eventNamesMap={eventNamesMap}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p> 2026 Hack the North Events. Explore with curiosity.</p>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => { setIsLoginModalOpen(false); setLoginError(undefined); }}
        onLogin={handleLogin}
        error={loginError}
      />
    </div>
  );
}

export default App;
