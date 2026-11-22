import { Link } from 'react-router-dom';

export default function PhotoCard({ photo, canDelete, onDelete, view }) {
  return (
    <article className={`photo-card ${view}`}>
      <Link to={`/photos/${photo._id}`}>
        <img src={`/uploads/${photo.fileName}`} alt={photo.title} />
      </Link>
      <div className="photo-card-body">
        <Link to={`/photos/${photo._id}`}><h3>{photo.title}</h3></Link>
        {photo.description && <p>{photo.description}</p>}
        {photo.userId?.firstName && (
          <small>By {photo.userId.firstName} {photo.userId.lastName}</small>
        )}
        {canDelete && <button className="danger" onClick={() => onDelete(photo._id)}>Delete</button>}
      </div>
    </article>
  );
}
