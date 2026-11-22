import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PhotoCard from '../components/PhotoCard';

export default function Gallery({ user }) {
  const [photos, setPhotos] = useState([]);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', photo: null });

  const loadPhotos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load photos');
      setPhotos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPhotos(); }, []);

  const upload = async (event) => {
    event.preventDefault();
    setError('');
    if (!user) {
      setError('Please login to upload a photo');
      return;
    }
    const body = new FormData();
    body.append('title', form.title);
    body.append('description', form.description);
    body.append('photo', form.photo);
    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'x-user-id': user._id },
        body
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      setForm({ title: '', description: '', photo: null });
      event.target.reset();
      setPhotos((current) => [data, ...current]);
    } catch (err) {
      setError(err.message);
    }
  };

  const removePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user._id }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Delete failed');
      }
      setPhotos((current) => current.filter((photo) => photo._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="gallery-page">
      <header className="gallery-header">
        <div>
          <p className="eyebrow"><span /> The collection</p>
          <h1>Moments, <em>collected.</em></h1>
        </div>
        <div className="view-controls" aria-label="Gallery display style">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>Grid</button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>List</button>
        </div>
      </header>

      {user ? (
        <form className="upload-form" onSubmit={upload}>
          <h2>Add a photo</h2>
          <input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required maxLength="120" />
          <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setForm({ ...form, photo: event.target.files[0] })} required />
          <button type="submit">Upload Photo</button>
        </form>
      ) : (
        <p className="login-prompt"><Link to="/login">Login</Link> to upload a photo.</p>
      )}

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading photos...</p>}
      {!loading && photos.length === 0 && <p>No photos yet.</p>}
      <div className={`photo-gallery ${view}`}>
        {photos.map((photo) => (
          <PhotoCard
            key={photo._id}
            photo={photo}
            view={view}
            canDelete={Boolean(user && photo.userId && photo.userId._id === user._id)}
            onDelete={removePhoto}
          />
        ))}
      </div>
    </section>
  );
}
