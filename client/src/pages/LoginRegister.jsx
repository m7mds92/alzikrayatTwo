import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginRegister({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', location: '', description: '', occupation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login'
      ? { email: form.email, password: form.password }
      : form;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');
      onLogin(data);
      navigate('/gallery');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-aside">
        <p className="eyebrow"><span /> Member archive</p>
        <h1>Keep your<br /><em>story</em> close.</h1>
      </div>
      <div className="auth-card">
        <div className="tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        <form onSubmit={submit} className="stacked-form">
          {mode === 'register' && (
            <>
              <input name="firstName" placeholder="First name" value={form.firstName} onChange={change} required />
              <input name="lastName" placeholder="Last name" value={form.lastName} onChange={change} required />
              <input name="location" placeholder="Location (optional)" value={form.location} onChange={change} />
              <input name="occupation" placeholder="Occupation (optional)" value={form.occupation} onChange={change} />
              <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={change} />
            </>
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} minLength={mode === 'register' ? 6 : undefined} required />
          {error && <p className="error">{error}</p>}
          <button disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}</button>
        </form>
      </div>
    </section>
  );
}
