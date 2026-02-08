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
      } catch (err) {
        setError("Failed to load events.");
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

  const handleRelatedEventClick = (eventId: number) => {
    setHighlightedEventId(eventId);
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightedEventId(null), 2000);
    }
  };

  const eventNamesMap = useMemo(() => {
    const map: Record<number, string> = {};
    events.forEach((event) => {
      map[event.id] = event.name;
    });
    return map;
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = filterEventsByPermission(events, isLoggedIn);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e => e.name.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q));
    }
    if (selectedEventType !== "all") {
      filtered = filtered.filter(e => e.event_type === selectedEventType);
    }
    return sortEventsByStartTime(filtered);
  }, [events, isLoggedIn, searchQuery, selectedEventType]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      public: events.filter(e => e.permission === "public").length,
      private: events.filter(e => e.permission === "private").length,
      workshops: events.filter(e => e.event_type === "workshop").length,
    };
  }, [events]);

  return (
    <div className="app">
      <div className="glow-spot glow-spot-1" aria-hidden="true"></div>
      <div className="glow-spot glow-spot-2" aria-hidden="true"></div>
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="htn-badge">HTN</div>
            <div className="brand-text">
              <span className="org">HACKATHON GLOBAL INC.</span>
              <span className="app-title">Hack the North Events</span>
            </div>
            <div className="live-indicator">
              <span className="dot"></span> LIVE
            </div>
          </div>
          <div className="header-actions">
            {isLoggedIn && <span className="access-status">Hacker Access Enabled</span>}
            {isLoggedIn ? (
              <button onClick={() => setIsLoggedIn(false)} className="logout-button">Logout</button>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="login-button-header">Hacker Login</button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="hero-section">
          <div className="hero-left">
            <span className="kicker">HTN 2026 SCHEDULE HUB</span>
            <h1>Design your hackathon sprint.</h1>
            <p>
              Discover sessions, mentor hours, and partner events. Public events are
              open to everyone. Log in to unlock private experiences.
            </p>
            <div className="hero-ctas">
              <button 
                className="btn-primary" 
                onClick={() => document.querySelector('.filters-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore events
              </button>
              {isLoggedIn ? (
                <button className="btn-secondary">Logged in</button>
              ) : (
                <button className="btn-secondary" onClick={() => setIsLoginModalOpen(true)}>Hacker access</button>
              )}
            </div>
          </div>
          <div className="hero-right">
            <div className="stats-board">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total events</span>
                  <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Public sessions</span>
                  <span className="stat-value">{stats.public}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Private sessions</span>
                  <span className="stat-value">{stats.private}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Workshops</span>
                  <span className="stat-value">{stats.workshops}</span>
                </div>
              </div>
              <div className="stats-footer">
                Curate your weekend by mixing talks, builds, and breaks.
              </div>
            </div>
          </div>
        </section>

        <section className="filters-section">
          <div className="filter-group">
            <label>Search events, speakers, or descriptions...</label>
            <input 
              type="text" 
              placeholder="Search events, speakers, or descriptions..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label>Filter by type:</label>
            <select 
              value={selectedEventType} 
              onChange={(e) => setSelectedEventType(e.target.value as any)}
              className="type-filter"
            >
              <option value="all">All Events</option>
              <option value="workshop">Workshop</option>
              <option value="activity">Activity</option>
              <option value="tech_talk">Tech Talk</option>
            </select>
          </div>
        </section>

        <div className="events-count">
          <span className="dot"></span> Showing {filteredEvents.length} events
        </div>

        {isLoading ? (
          <div className="events-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <div key={event.id} id={`event-${event.id}`} className={highlightedEventId === event.id ? "highlight" : ""}>
                <EventCard 
                  event={event} 
                  isLoggedIn={isLoggedIn} 
                  onRelatedEventClick={handleRelatedEventClick}
                  eventNamesMap={eventNamesMap}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Hackathon Global Inc.</p>
      </footer>

      {isLoginModalOpen && (
        <LoginModal 
          onLogin={handleLogin} 
          onClose={() => setIsLoginModalOpen(false)} 
          error={loginError}
        />
      )}
    </div>
  );
}

export default App;
