import { useState } from 'react';

export default function CommentForm({ onSubmit }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onSubmit(comment);
      setComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="comment-form" onSubmit={submit}>
      <label htmlFor="comment">Add a comment</label>
      <textarea id="comment" value={comment} onChange={(event) => setComment(event.target.value)} required maxLength="1000" />
      {error && <p className="error">{error}</p>}
      <button type="submit">Post Comment</button>
    </form>
  );
}
