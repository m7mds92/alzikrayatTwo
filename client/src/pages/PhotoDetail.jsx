import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentForm from '../components/CommentForm';

export default function PhotoDetail({ user }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/photos/${id}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Could not load photo');
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addComment = async (comment) => {
    if (!user) throw new Error('Please login to comment');
    const response = await fetch(`/api/photos/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user._id
      },
      body: JSON.stringify({ comment })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not add comment');
    setData((current) => ({ ...current, comments: [...current.comments, data] }));
  };

  if (loading) return <p className="page-status">Loading photo...</p>;
  if (error) return <p className="page-status error">{error}</p>;

  const { photo, comments } = data;
  return (
    <section className="detail-page">
      <Link className="back-link" to="/gallery">← All memories</Link>
      <div className="detail-layout">
        <img className="detail-image" src={`/uploads/${photo.fileName}`} alt={photo.title} />
        <div className="detail-info">
          <h1>{photo.title}</h1>
          {photo.description && <p>{photo.description}</p>}
          {photo.userId?.firstName && <small>Shared by {photo.userId.firstName} {photo.userId.lastName}</small>}
          <h2>Comments ({comments.length})</h2>
          <div className="comments">
            {comments.length === 0 && <p>No comments yet.</p>}
            {comments.map((item) => (
              <article className="comment" key={item._id}>
                <strong>{item.userId?.firstName} {item.userId?.lastName}</strong>
                <p>{item.comment}</p>
                <small>{new Date(item.dateTime).toLocaleString()}</small>
              </article>
            ))}
          </div>
          {user ? <CommentForm onSubmit={addComment} /> : <p><Link to="/login">Login</Link> to add a comment.</p>}
        </div>
      </div>
    </section>
  );
}
