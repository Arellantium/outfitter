import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPaymentData, goToPreviousStep } from '../redux/reducers/checkoutReducer';
import { Form, Button, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { FaArrowLeft, FaPaypal, FaCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

const formatCardNumber = (value) => { /* ... stessa logica ... */ };
const getCardType = (cardNumber) => { /* ... stessa logica ... */ };

const PaymentStep = () => {
  const dispatch = useDispatch();
  const { paymentData, outfitDetails } = useSelector(state => state.checkout);
  const [formData, setFormData] = useState(paymentData);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardType, setCardType] = useState(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState(paymentData.paymentMethod || 'card');

  useEffect(() => {
    if (formData.cardnumber) {
      setCardType(getCardType(formData.cardnumber));
    }
  }, [formData.cardnumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "cardnumber") {
      processedValue = value.replace(/\D/g, '').slice(0, 19);
      setCardType(getCardType(processedValue));
    } else if (name === "cvv") {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === "expiry") {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 2) formatted = formatted.slice(0,2) + '/' + formatted.slice(2,4);
      processedValue = formatted.slice(0,5);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activePaymentMethod !== 'card') {
      setIsLoading(true);
      setTimeout(() => {
        dispatch(setPaymentData({ ...formData, paymentMethod: activePaymentMethod }));
        setIsLoading(false);
      }, 2000);
      return;
    }

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      setValidated(true);
      setIsLoading(true);
      setTimeout(() => {
        dispatch(setPaymentData({ ...formData, paymentMethod: 'card' }));
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div>
      <h3 className="step-title">2. Metodo di Pagamento</h3>
      {/* bottoni metodo pagamento */}
      {/* form pagamento */}
      <Row className="mt-4 pt-2 border-top">
        <Col xs={12} sm={6}>
          <Button variant="secondary-checkout" onClick={() => dispatch(goToPreviousStep())} className="w-100" disabled={isLoading}>
            <FaArrowLeft className="me-2" /> Indietro
          </Button>
        </Col>
        <Col xs={12} sm={6}>
          <Button variant="primary-checkout" type="submit" onClick={handleSubmit} className="w-100" disabled={isLoading}>
            {/* bottone con testo dinamico */}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentStep;
