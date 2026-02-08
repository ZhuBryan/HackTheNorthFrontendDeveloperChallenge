import { TEvent } from "./types";
import { formatTimeRange, calculateDuration } from "./utils";
import "./EventCard.css";

interface EventCardProps {
  event: TEvent;
  isLoggedIn: boolean;
  onRelatedEventClick: (eventId: number) => void;
  eventNamesMap: Record<number, string>;
}

function EventCard({ event, isLoggedIn, onRelatedEventClick, eventNamesMap }: EventCardProps) {
  const isPrivate = event.permission === "private";

  return (
    <article className={`event-card ${isPrivate ? "private-event" : ""}`}>
      <div className="event-header">
        <div className="event-meta">
          <span className="event-id">#{event.id}</span>
          <div className="event-type-badge">
            {event.event_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
        </div>
        {isPrivate && <div className="private-badge" aria-label="Private event">Private</div>}
      </div>

      <h2 className="event-title">{event.name}</h2>

      <div className="event-time">
        <div className="time-details">
          <div className="time-range">
            <span className="time-symbol"></span> {formatTimeRange(event.start_time, event.end_time)}
          </div>
          <div className="duration">Duration: {calculateDuration(event.start_time, event.end_time)}</div>
        </div>
      </div>

      <p className="event-description">{event.description}</p>

      {event.speakers.length > 0 && (
        <div className="event-speakers">
          <h3>Speakers</h3>
          <ul>
            {event.speakers.map((speaker, idx) => (
              <li key={idx}>{speaker.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="event-actions">
        {isLoggedIn && event.private_url && (
          <a
            href={event.private_url}
            target="_blank"
            rel="noopener noreferrer"
            className="event-link private-link"
          >
            Hacker Link <span className="link-icon"></span>
          </a>
        )}
        {event.public_url && (
          <a
            href={event.public_url}
            target="_blank"
            rel="noopener noreferrer"
            className="event-link public-link"
          >
            Public Stream <span className="link-icon"></span>
          </a>
        )}
      </div>

      {event.related_events.length > 0 && (
        <div className="related-events">
          <h3>Related Events</h3>
          <div className="related-events-list">
            {event.related_events.map((id) => (
              <button
                key={id}
                onClick={() => onRelatedEventClick(id)}
                className="related-event-button"
              >
                {eventNamesMap[id] || `Event #${id}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default EventCard;
