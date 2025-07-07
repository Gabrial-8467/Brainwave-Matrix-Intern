import { useAuth } from '../services/auth.jsx';
import { Card, Button, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/auth/profile/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) setProfile(data.user);
        else setError(data.message || 'Could not fetch profile');
        setLoading(false);
      })
      .catch(() => {
        setError('Server error.');
        setLoading(false);
      });
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: 420 }}>
        <Card.Body>
          <div className="d-flex align-items-center mb-4 justify-content-center">
            <FaUser className="fs-1 text-primary me-3" />
            <div>
              <h3 className="mb-0 fw-bold">Profile</h3>
              <div className="text-muted small">Account Details</div>
            </div>
          </div>
          {loading ? <Spinner animation="border" /> : error ? <Alert variant="danger">{error}</Alert> : (
            <>
              <Row className="mb-3 align-items-center">
                <Col xs="auto"><FaUser className="text-secondary" /></Col>
                <Col><span className="fw-semibold">Name:</span> {profile?.name || 'N/A'}</Col>
              </Row>
              <Row className="mb-3 align-items-center">
                <Col xs="auto"><FaEnvelope className="text-secondary" /></Col>
                <Col><span className="fw-semibold">Email:</span> {profile?.email}</Col>
              </Row>
            </>
          )}
          <Row className="mt-4 g-2">
            <Col>
              <Button variant="outline-primary" className="w-100 fw-semibold" onClick={() => navigate('/dashboard')}>
                <FaArrowLeft className="me-1" /> Back to Dashboard
              </Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={handleLogout} className="w-100 fw-semibold">
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
