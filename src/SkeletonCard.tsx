import "./SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-badge"></div>
        <div className="skeleton-badge-small"></div>
      </div>
      <div className="skeleton-title"></div>
      <div className="skeleton-time">
        <div className="skeleton-icon"></div>
        <div className="skeleton-text-group">
          <div className="skeleton-line-long"></div>
          <div className="skeleton-line-short"></div>
        </div>
      </div>
      <div className="skeleton-description">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line-mid"></div>
      </div>
      <div className="skeleton-footer"></div>
    </div>
  );
}

export default SkeletonCard;
