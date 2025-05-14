import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Card, ListGroup, Spinner } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Payments.css';

const API_URL = 'http://localhost:8006/metodi-pagamento';

function Payments() {
  const [formData, setFormData] = useState({
    intestatario: '',
    numero_carta: '',
    scadenza: '',
    cvv: '',
    circuito: '',
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMethods, setIsFetchingMethods] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchPaymentMethods = useCallback(async () => {
    setIsFetchingMethods(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch payment methods');
      const data = await res.json();
      setPaymentMethods(data);
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setIsFetchingMethods(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPaymentMethods();
  }, [fetchPaymentMethods, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'numero_carta') {
      processedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'scadenza') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 2) {
        processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2, 4);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const validateForm = () => {
    const { intestatario, numero_carta, scadenza, cvv, circuito } = formData;
    if (!intestatario || !numero_carta || !scadenza || !cvv || !circuito) {
      setMessage({ text: 'All fields are required.', type: 'danger' });
      return false;
    }
    if (numero_carta.length !== 16) {
      setMessage({ text: 'Card number must be 16 digits.', type: 'danger' });
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(scadenza)) {
      setMessage({ text: 'Expiration date must be in MM/YY format.', type: 'danger' });
      return false;
    }
    const [month, year] = scadenza.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (+year < currentYear || (+year === currentYear && +month < currentMonth)) {
      setMessage({ text: 'Expiration date is in the past.', type: 'danger' });
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setMessage({ text: 'CVV must be 3 or 4 digits.', type: 'danger' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage({ text: 'Payment method added successfully.', type: 'success' });
      setFormData({ intestatario: '', numero_carta: '', scadenza: '', cvv: '', circuito: '' });
      fetchPaymentMethods();
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMethod = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error deleting payment method');
      setMessage({ text: 'Payment method deleted.', type: 'success' });
      fetchPaymentMethods();
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
          {message.text}
        </Alert>
      )}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4 className="mb-4 fw-bold">Add Payment Method</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    name="intestatario"
                    value={formData.intestatario}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    name="numero_carta"
                    value={formData.numero_carta}
                    onChange={handleChange}
                    maxLength={16}
                    required
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiration Date (MM/YY)</Form.Label>
                      <Form.Control
                        name="scadenza"
                        value={formData.scadenza}
                        onChange={handleChange}
                        maxLength={5}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        maxLength={4}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label>Card Network</Form.Label>
                  <Form.Select
                    name="circuito"
                    value={formData.circuito}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select...</option>
                    <option>Visa</option>
                    <option>MasterCard</option>
                    <option>American Express</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Payment Method'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-4 fw-bold">Your Payment Methods</h4>
              {isFetchingMethods ? (
                <Spinner animation="border" />
              ) : paymentMethods.length > 0 ? (
                <ListGroup>
                  {paymentMethods.map((method) => (
                    <ListGroup.Item
                      key={method.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{method.intestatario}</strong>
                        <br />
                        <small>{method.circuito} - {method.numero_carta_mascherata || method.numero_carta}</small>
                        <br />
                        <small>Expires: {method.scadenza}</small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteMethod(method.id)}
                        disabled={isLoading}
                      >
                        <Trash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No payment methods saved.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Payments;
