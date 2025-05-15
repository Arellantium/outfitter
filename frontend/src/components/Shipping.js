import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Card, ListGroup, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Shipping.css';

const API_URL = 'http://localhost:8006/shipping';

function Shipping() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const initialFormData = {
    full_name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchShippingAddresses = useCallback(async () => {
    if (!token) {
      setMessage({ text: 'Authentication token not found. Please log in.', type: 'danger' });
      setIsFetching(false);
      return;
    }
    setIsFetching(true);
    try {
      const res = await fetch(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to fetch shipping addresses');
      }
      const data = await res.json();
      setShippingAddresses(data);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message, type: 'danger' });
      setShippingAddresses([]);
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchShippingAddresses();
  }, [fetchShippingAddresses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { full_name, address, city, postal_code, country, phone } = formData;
    if (!full_name || !address || !city || !postal_code || !country || !phone) {
      setMessage({ text: 'All fields are required.', type: 'danger' });
      return false;
    }
    if (phone.length < 8) {
      setMessage({ text: 'Phone number must be at least 8 digits.', type: 'danger' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setMessage({ text: 'Authentication token not found. Please log in.', type: 'danger' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }
      setMessage({ text: 'Shipping information saved successfully!', type: 'success' });
      setFormData(initialFormData);
      fetchShippingAddresses();
    } catch (error) {
      console.error(error);
      setMessage({ text: error.message, type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5 shipping-container">
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible className="mb-4">
          {message.text}
        </Alert>
      )}

      <Row>
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="shadow-lg border-0 rounded-3">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold text-primary">Add New Shipping Address</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g., Mario Rossi"
                    required
                    className="shadow-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., Via Roma 123, Appartamento 4B"
                    required
                    className="shadow-sm"
                  />
                </Form.Group>

                <Row>
                  <Col sm={7}>
                    <Form.Group className="mb-3" controlId="formCity">
                      <Form.Label className="fw-semibold">City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g., Roma"
                        required
                        className="shadow-sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={5}>
                    <Form.Group className="mb-3" controlId="formPostalCode">
                      <Form.Label className="fw-semibold">Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="e.g., 00100"
                        required
                        className="shadow-sm"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formCountry">
                  <Form.Label className="fw-semibold">Country</Form.Label>
                  <Form.Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  >
                    <option value="">Select Country...</option>
                    <option value="IT">Italy</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPhone">
                  <Form.Label className="fw-semibold">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +393331234567"
                    required
                    className="shadow-sm"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold shadow-sm" disabled={isLoading}>
                  {isLoading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...</> : 'Save Shipping Address'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-lg border-0 rounded-3">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold text-primary">Your Shipping Addresses</h2>
              {isFetching ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading your addresses...</p>
                </div>
              ) : shippingAddresses.length > 0 ? (
                <ListGroup variant="flush">
                  {shippingAddresses.map((addr) => (
                    <ListGroup.Item key={addr.id} className="shipping-address-item">
                      <strong className="d-block">{addr.full_name}</strong>
                      <span className="d-block text-muted">{addr.address}</span>
                      <span className="d-block text-muted">{addr.city}, {addr.postal_code} - {addr.country}</span>
                      <span className="d-block text-muted">Phone: {addr.phone}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-center text-muted">You have no saved shipping addresses.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Shipping;