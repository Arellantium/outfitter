// ✅ ShippingStep.js aggiornato per Redux
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setShippingData } from '../redux/reducers/checkoutReducer';

const shippingOptions = [
  { id: 'standard', name: 'Spedizione Standard', price: 0, currency: '€', eta: '3-5 giorni lavorativi' },
  { id: 'express', name: 'Spedizione Espressa', price: 5.00, currency: '€', eta: '1-2 giorni lavorativi' },
];

const ShippingStep = () => {
  const dispatch = useDispatch();
  const shippingDataFromStore = useSelector((state) => state.checkout.shippingData);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'IT',
    shippingMethod: shippingOptions[0].id,
  });

  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Inizializza formData da Redux se presente
  useEffect(() => {
    if (shippingDataFromStore && Object.keys(shippingDataFromStore).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...shippingDataFromStore,
        shippingMethod: shippingDataFromStore.shippingMethod || shippingOptions[0].id
      }));
    }
  }, [shippingDataFromStore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      setValidated(true);
      setIsLoading(true);
      const selectedShippingOption = shippingOptions.find(opt => opt.id === formData.shippingMethod);
      setTimeout(() => {
        dispatch(setShippingData({ ...formData, selectedShippingOption }));
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div>
      <h3 className="step-title">1. Indirizzo di Spedizione e Contatti</h3>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Control
              required
              placeholder="Nome e Cognome"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Control
              required
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Control
              required
              placeholder="Telefono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Control
              required
              placeholder="Indirizzo"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-3">
            <Form.Control
              required
              placeholder="Città"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Control
              required
              placeholder="CAP"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Control
              required
              placeholder="Nazione"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <h5 className="mt-4 mb-2">Metodo di Spedizione</h5>
        {shippingOptions.map(opt => (
          <Form.Check
            key={opt.id}
            type="radio"
            name="shippingMethod"
            id={`shipping-${opt.id}`}
            label={`${opt.name} (${opt.currency}${opt.price} - ${opt.eta})`}
            value={opt.id}
            checked={formData.shippingMethod === opt.id}
            onChange={handleChange}
            className="mb-2"
          />
        ))}

        <Button variant="primary-checkout" type="submit" className="w-100 mt-3 btn-lg-checkout" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Attendere...
            </>
          ) : (
            <>
              Prosegui al Pagamento <FaArrowRight className="ms-2" />
            </>
          )}
        </Button>
      </Form>
    </div>
  );
};

export default ShippingStep;
