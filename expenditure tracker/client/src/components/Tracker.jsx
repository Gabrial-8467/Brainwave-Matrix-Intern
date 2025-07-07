import { Container, Card, Button, Form, Table, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../services/auth.jsx';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTachometerAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const categories = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'
];

export default function Tracker() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', amount: '', category: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      // Try to recover token from localStorage if lost on refresh
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        window.location.reload(); // Force reload to rehydrate context
        return;
      }
      setLoading(false);
      return;
    }
    fetch('http://localhost:5000/api/expenditures', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setExpenditures(data);
        setLoading(false);
      });
  }, [token, success]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.date || !form.amount || !form.category) {
      setError('Date, amount, and category are required.');
      return;
    }
    if (!token) {
      setError('You are not authenticated. Please log in again.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/expenditures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount), // Ensure amount is a number
          date: new Date(form.date) // Ensure date is a Date object
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ date: '', amount: '', category: '', description: '' });
        setSuccess('Expenditure added!');
        setExpenditures(prev => [data, ...prev]); // Optimistically update UI
      } else {
        setError(data.message || 'Failed to add expenditure.');
      }
    } catch {
      setError('Server error.');
    }
    setSubmitting(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this expenditure?')) return;
    await fetch(`http://localhost:5000/api/expenditures/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuccess('Expenditure deleted!');
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container className="py-5">
        <Card className="shadow-lg p-4 mb-4 w-100 mx-auto" style={{ maxWidth: 600, borderRadius: 16 }}>
          <Card.Body>
            <h2 className="mb-3 fw-bold text-center">
              <FaTachometerAlt className="me-2 text-primary" />
              {user ? `Welcome, ${user.name || user.email.split('@')[0]}!` : 'Welcome!'}
            </h2>
            <p className="mb-4 text-secondary text-center fs-5">
              Track your expenditures, analyze your spending, and stay in control of your finances.
            </p>
            <Row className="mb-3">
              <Col>
                <Button variant="primary" onClick={() => navigate('/profile')} className="fw-semibold w-100 mb-2">
                  <FaUser className="me-1" /> View Profile
                </Button>
              </Col>
              <Col>
                <Button variant="success" onClick={() => navigate('/dashboard')} className="fw-semibold w-100 mb-2">
                  <FaTachometerAlt className="me-1" /> Go to Dashboard
                </Button>
              </Col>
            </Row>
            <h4 className="fw-semibold mb-3 mt-4"><FaPlus className="me-2 text-success" />Add Expenditure</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} className="mb-4">
              <Row className="g-2">
                <Col md={4}>
                  <Form.Control type="date" name="date" value={form.date} onChange={handleChange} required />
                </Col>
                <Col md={3}>
                  <Form.Control type="number" name="amount" value={form.amount} onChange={handleChange} required min="0.01" step="0.01" placeholder="Amount" />
                </Col>
                <Col md={3}>
                  <Form.Select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Category</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button type="submit" variant="success" className="w-100" disabled={submitting}>
                    {submitting ? <Spinner animation="border" size="sm" /> : <><FaPlus className="me-1" />Add</>}
                  </Button>
                </Col>
              </Row>
              <Form.Control className="mt-2" type="text" name="description" value={form.description} onChange={handleChange} placeholder="Description (optional)" />
            </Form>
            <h5 className="fw-semibold mb-3">Your Expenditures</h5>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : expenditures.length === 0 ? (
              <div className="text-center text-muted py-4">No expenditures found.</div>
            ) : (
              <Table responsive hover className="mb-0 align-middle bg-white">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expenditures.map(e => (
                    <tr key={e._id}>
                      <td>{new Date(e.date).toLocaleDateString()}</td>
                      <td>{e.category}</td>
                      <td>{e.description || '-'}</td>
                      <td className="text-end">₹{e.amount.toFixed(2)}</td>
                      <td className="text-end">
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(e._id)} title="Delete">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
