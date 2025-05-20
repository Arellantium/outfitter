import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setShippingData } from '../redux/reducers/checkoutReducer';

const shippingOptions = [
  { id: 'standard', name: 'Spedizione Standard', price: 0, currency: '€', eta: '3-5 giorni lavorativi' },
  { id: 'express', name: 'Spedizione Espressa', price: 5.00, currency: '€', eta: '1-2 giorni lavorativi' },
];

const ShippingStep = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullname: '', email: '', phone: '', address: '', city: '', zip: '', country: 'IT',
    shippingMethod: shippingOptions[0].id,
  });
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        {/* campi fullname, email, phone, address, city, zip, country... */}
        {/* sezione metodi di spedizione */}
        <Button variant="primary-checkout" type="submit" className="w-100 mt-3 btn-lg-checkout" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Attendere...
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
