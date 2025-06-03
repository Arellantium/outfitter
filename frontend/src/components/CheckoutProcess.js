import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import OrderSummarySidebar from './OrderSummarySidebar';
import {
  setShippingData,
  setPaymentData,
  goToPreviousStep,
  applyDiscount
} from '../redux/reducers/checkoutReducer';

import './CheckoutProcess.css';

const CheckoutProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentStep,
    shippingData,
    paymentData,
    orderNumber,
    outfitDetails
  } = useSelector(state => state.checkout);

  useEffect(() => {
    if (!outfitDetails || !outfitDetails.items || outfitDetails.items.length === 0) {
      navigate('/');
    }
  }, [outfitDetails, navigate]);

  const handleShippingSubmit = (data) => {
    dispatch(setShippingData(data));
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (data) => {
    dispatch(setPaymentData(data));
    window.scrollTo(0, 0);
  };

  const handleDiscountApplied = (discountValue) => {
    dispatch(applyDiscount(discountValue));
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingStep onSubmit={handleShippingSubmit} />;
      case 2:
        return (
          <PaymentStep
            onSubmit={handlePaymentSubmit}
            onBack={() => dispatch(goToPreviousStep())}
            outfit={outfitDetails}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            orderNumber={orderNumber}
            shippingData={shippingData}
            paymentData={paymentData}
            outfit={outfitDetails}
          />
        );
      default:
        return <ShippingStep onSubmit={handleShippingSubmit} />;
    }
  };

  const progress = Math.min((currentStep / 3) * 100, 100);
  const showSidebar = currentStep === 1 || currentStep === 2;
  const stepLabels = ["Spedizione", "Pagamento", "Conferma"];

  return (
    <div className="checkout-page-background">
      <Container className="checkout-main-container my-4 my-md-5">
        <Row className="justify-content-center mb-4">
          <Col md={10} lg={8}>
            <div className="checkout-header-wrapper">
              <div className="checkout-logo">
                <span className="logo-st">st</span>
                <span className="logo-ai">AI</span>
                <span className="logo-llist">llist</span>
              </div>
              <h2 className="checkout-main-title">Procedura di Acquisto</h2>
            </div>
            {currentStep <= 2 && (
              <div className="progress-wrapper mx-auto mb-4">
                <ProgressBar
                  now={progress}
                  variant="checkout-progress"
                  aria-label={`Progresso: Step ${currentStep} di 3 - ${stepLabels[currentStep - 1]}`}
                />
              </div>
            )}
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col
            md={showSidebar ? 7 : 10}
            lg={showSidebar ? 7 : (currentStep === 3 ? 8 : 10)}
            className="checkout-form-col mb-4 mb-md-0"
          >
            <div className={`checkout-step-content-wrapper ${currentStep === 3 ? 'confirmation-wrapper confirmation-card' : ''}`}>
              {renderStepComponent()}
            </div>
          </Col>

          {showSidebar && (
            <Col md={5} lg={5} className="checkout-sidebar-col">
              <OrderSummarySidebar outfit={outfitDetails} shippingOption={shippingData.selectedShippingOption} onDiscountApply={handleDiscountApplied} />
            </Col>
          )}
        </Row>

        <footer className="checkout-app-footer">
          <p>© {new Date().getFullYear()} stAllist - Tutti i diritti riservati.</p>
        </footer>
      </Container>
    </div>
  );
};

export default CheckoutProcess;
