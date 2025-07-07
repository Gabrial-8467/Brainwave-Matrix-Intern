import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../services/auth.jsx';
import { FaUserCircle } from 'react-icons/fa';

export default function NavigationBar() {
  const { user } = useAuth();
  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
          <span className="me-2"><FaUserCircle /></span>Expenditure Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            {user ? (
              <>
                <Nav.Link as={Link} to="/" className="fw-semibold">Home</Nav.Link>
                <Nav.Link as={Link} to="/dashboard" className="fw-semibold">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/profile" className="fw-semibold">Profile</Nav.Link>
                <span className="d-none d-md-inline text-secondary ms-3"><FaUserCircle className="me-1" />{user.name || user.email}</span>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="fw-semibold">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
