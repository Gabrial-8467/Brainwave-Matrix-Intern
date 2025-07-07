import { useAuth } from '../services/auth.jsx';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

function validateEmail(email) {
  // Allow special characters in local part, stricter domain validation
  return /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email);
}
function validatePassword(password) {
  // At least 6 chars, 1 number, 1 letter
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
}

export default function SignupForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name) {
      setError('Name is required.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(form.password)) {
      setError('Password must be at least 6 characters, include a letter and a number.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
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
          if (typeof window !== 'undefined') window.location.reload(); // Ensure context is rehydrated
        }
        navigate('/');
      } else {
        setError(data.message || 'Signup failed');
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
            <FaUserPlus className="fs-2 text-primary me-2" />
            <h3 className="mb-0">Sign Up</h3>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group className="mb-3" controlId="signupName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required isInvalid={!!error && !form.name} placeholder="Enter your name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="signupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required isInvalid={!!error && !validateEmail(form.email)} placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required isInvalid={!!error && !validatePassword(form.password)} placeholder="Create a password" />
                <Button variant="outline-secondary" type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <Form.Text>Password must be at least 6 characters, include a letter and a number.</Form.Text>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 fw-semibold" disabled={loading} size="lg">
              {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <a href="/login" className="text-decoration-none">Already have an account? Login</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
