import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { useAuth } from '../services/auth.jsx';
import { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/expenditures', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setExpenditures(data);
        setLoading(false);
      });
  }, [token]);

  // Calculate summary stats
  const total = expenditures.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = expenditures.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);
  const largest = expenditures.reduce((max, e) => e.amount > max ? e.amount : max, 0);
  const recent = [...expenditures].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Dashboard</h2>
      <Row className="mb-4 g-3">
        <Col md>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <div className="fs-1 mb-2 text-primary"><FaMoneyBillWave /></div>
              <div className="fs-4 fw-semibold">{total.toFixed(2)}</div>
              <div className="text-muted">Total Expenditures</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <div className="fs-1 mb-2 text-success"><FaCalendarAlt /></div>
              <div className="fs-4 fw-semibold">₹{thisMonth.toFixed(2)}</div>
              <div className="text-muted">This Month</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <div className="fs-1 mb-2 text-danger"><FaChartLine /></div>
              <div className="fs-4 fw-semibold">₹{largest.toFixed(2)}</div>
              <div className="text-muted">Largest Expense</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3 fw-semibold">Recent Expenditures</h5>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="text-center text-muted py-4">No expenditures found.</div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(e => (
                  <tr key={e._id}>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.category}</td>
                    <td>{e.description || '-'}</td>
                    <td className="text-end">₹{e.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
