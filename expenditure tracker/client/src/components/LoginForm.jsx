import { useAuth } from '../services/auth.jsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.password) {
      setError('Password is required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        if (data.token) {
          if (typeof window !== 'undefined') localStorage.setItem('token', data.token);
          if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = '/'; // Redirect to home after login
          return;
        }
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: 400 }}>
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <FaSignInAlt className="fs-2 text-primary me-2" />
            <h3 className="mb-0">Login</h3>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required isInvalid={!!error && !validateEmail(form.email)} placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required isInvalid={!!error && !form.password} placeholder="Enter your password" />
                <Button variant="outline-secondary" type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 fw-semibold" disabled={loading} size="lg">
              {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <a href="/signup" className="text-decoration-none">Don't have an account? Sign up</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
