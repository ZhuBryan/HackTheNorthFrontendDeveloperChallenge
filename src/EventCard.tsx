import { TEvent } from "./types";
import {
  formatTimeRange,
  formatEventType,
  calculateDuration,
} from "./utils";
import "./EventCard.css";

interface EventCardProps {
  event: TEvent;
  isLoggedIn: boolean;
  onRelatedEventClick: (eventId: number) => void;
  eventNamesMap?: Record<number, string>;
}

/**
 * Component to display individual event information
 */
function EventCard({ event, isLoggedIn, onRelatedEventClick, eventNamesMap }: EventCardProps) {
  const duration = calculateDuration(event.start_time, event.end_time);
  const isPrivate = event.permission === "private";

  return (
    <article className={`event-card ${isPrivate ? "private-event" : ""}`}>
      <div className="event-header">
        <div className="event-meta">
          <span className="event-id">#{event.id}</span>
          <span className="event-type-badge">
            {formatEventType(event.event_type)}
          </span>
        </div>
        {isPrivate && (
          <span className="private-badge">
            Private
          </span>
        )}
      </div>

      <h2 className="event-title">{event.name}</h2>

      <div className="event-time">
        <span className="time-icon">🕒</span>
        <div className="time-text">
          <div className="time-range">{formatTimeRange(event.start_time, event.end_time)}</div>
          <div className="duration">Duration: {duration}</div>
        </div>
      </div>

      {event.description && (
        <p className="event-description">{event.description}</p>
      )}

      {event.speakers.length > 0 && (
        <div className="event-speakers">
          <h3>Speakers</h3>
          <ul className="speaker-list">
            {event.speakers.map((speaker, index) => (
              <li key={index}>- {speaker.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="event-actions">
        {isLoggedIn ? (
          <>
            <a href={event.private_url} target="_blank" rel="noopener noreferrer" className="event-link private-link">
              Hacker Link <span className="icon">↗</span>
            </a>
            {event.public_url && (
              <a href={event.public_url} target="_blank" rel="noopener noreferrer" className="event-link public-link">
                Public Stream <span className="icon">↗</span>
              </a>
            )}
          </>
        ) : (
          event.public_url && (
            <a href={event.public_url} target="_blank" rel="noopener noreferrer" className="event-link public-link">
              View Stream <span className="icon">↗</span>
            </a>
          )
        )}
      </div>

      {event.related_events.length > 0 && (
        <div className="related-events">
          <h3>Related Events</h3>
          <div className="related-links">
            {event.related_events.map((id) => (
              <button
                key={id}
                onClick={() => onRelatedEventClick(id)}
                className="related-event-btn"
              >
                {eventNamesMap?.[id] || `Event #${id}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default EventCard;
