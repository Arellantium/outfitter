// ✅ PaymentStep.js aggiornato con validazione sicura + comportamento Sold Out in ConfirmationStep
import React, { useState, useEffect, useRef } from 'react'; // Importa useRef
import { useSelector, useDispatch } from 'react-redux';
import { setPaymentData, goToPreviousStep } from '../redux/reducers/checkoutReducer';
import { Form, Button, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { FaArrowLeft, FaPaypal, FaCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,19}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  return parts.length ? parts.join(' ') : value;
};

const getCardType = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, '');
  if (/^4/.test(num)) return 'visa';
  if (/^5[1-5]/.test(num)) return 'mastercard';
  if (/^3[47]/.test(num)) return 'amex';
  return null;
};

const PaymentStep = () => {
  const dispatch = useDispatch();
  const { paymentData, outfitDetails } = useSelector(state => state.checkout);
  const [formData, setFormData] = useState(paymentData || {
    cardholder: '', cardnumber: '', expiry: '', cvv: '', paymentMethod: 'card'
  });
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardType, setCardType] = useState(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState(formData.paymentMethod || 'card');

  const formRef = useRef(null); // Aggiungi un ref per il form

  useEffect(() => {
    if (formData.cardnumber) {
      setCardType(getCardType(formData.cardnumber));
    }
  }, [formData.cardnumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'cardnumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 19);
      setCardType(getCardType(processedValue));
    } else if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'expiry') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 2) formatted = formatted.slice(0,2) + '/' + formatted.slice(2,4);
      processedValue = formatted.slice(0,5);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
     // Se l'utente modifica un campo dopo che è stato visualizzato un errore,
     // potresti voler resettare lo stato di 'validated' per i campi specifici o per l'intero form.
     // Per semplicità, qui lo lascio così, ma in un'app complessa potresti voler
     // validare on-the-fly o resettare `validated` se `formRef.current.checkValidity()` diventa true.
    if (validated) { // Resetta 'validated' se l'utente sta correggendo gli errori
        if (formRef.current && formRef.current.checkValidity()) {
            setValidated(false);
        }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene il submit nativo del form

    if (activePaymentMethod === 'paypal') {
      setIsLoading(true);
      // Simula chiamata API PayPal
      setTimeout(() => {
        console.log('Processing PayPal...');
        // Per PayPal, assumiamo che la validazione sia gestita esternamente
        // o che non ci siano campi da validare nel nostro form.
        dispatch(setPaymentData({ ...formData, paymentMethod: 'paypal' }));
        // Qui lo step successivo avverrà tramite il reducer che ascolta setPaymentData
        setIsLoading(false);
      }, 1500);
      return; // Esce dalla funzione per PayPal
    }

    // Logica per il pagamento con carta
    const form = formRef.current; // Usa il ref per accedere all'elemento form

    setValidated(true); // Attiva la visualizzazione dei feedback di validazione di Bootstrap

    if (form && form.checkValidity() === false) {
      e.stopPropagation(); // Ferma l'evento se il form non è valido
      // Non fare nulla, i messaggi di errore verranno mostrati da Bootstrap
      console.log('Form card non valido');
    } else if (form) {
      // Il form della carta è valido
      console.log('Form card valido, procedo con il pagamento');
      setIsLoading(true);
      // Simula chiamata API di pagamento
      setTimeout(() => {
        dispatch(setPaymentData({ ...formData, paymentMethod: 'card' }));
        // Qui lo step successivo avverrà tramite il reducer che ascolta setPaymentData
        setIsLoading(false);
      }, 1500);
    }
  };

  const renderCardIcon = () => {
    if (cardType === 'visa') return <FaCcVisa size="2em" className="text-primary" />;
    if (cardType === 'mastercard') return <FaCcMastercard size="2em" className="text-danger" />;
    if (cardType === 'amex') return <FaCcAmex size="2em" className="text-success" />;
    return <FaCreditCard size="2em" className="text-muted" />;
  };

  // Calcolo del totale per il bottone di pagamento
  const totalAmount = (
    (outfitDetails?.totalPrice || 0) +
    (outfitDetails?.shippingCost || 0) -
    (outfitDetails?.discountAmount || 0)
  ).toFixed(2);
  const currencySymbol = outfitDetails?.currency || '$';


  return (
    <div>
      <h3 className="step-title">2. Metodo di Pagamento</h3>

      <div className="mb-4 payment-method-selector">
        <Button
          variant={activePaymentMethod === 'card' ? 'primary-checkout' : 'outline-secondary-checkout'}
          onClick={() => {
            setActivePaymentMethod('card');
            setValidated(false); // Resetta la validazione quando si cambia metodo
          }}
          className="me-2 payment-method-btn"
          disabled={isLoading}
        >
          <FaCreditCard className="me-2" /> Carta di Credito/Debito
        </Button>
        <Button
          variant={activePaymentMethod === 'paypal' ? 'primary-checkout' : 'outline-secondary-checkout'}
          onClick={() => {
            setActivePaymentMethod('paypal');
            setValidated(false); // Resetta la validazione quando si cambia metodo
          }}
          className="payment-method-btn"
          disabled={isLoading}
        >
          <FaPaypal className="me-2" /> PayPal
        </Button>
      </div>

      {/*
        Il Form viene renderizzato condizionatamente, ma il suo submit
        è gestito dal bottone "Paga" / "Continua con PayPal" più in basso,
        che chiama handleSubmit.
        L'attributo onSubmit sul Form è una buona pratica per l'accessibilità
        e per i casi in cui l'utente preme "Invio" in un campo.
      */}
      <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
        {activePaymentMethod === 'card' && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Titolare Carta</Form.Label>
              <Form.Control
                type="text"
                name="cardholder"
                value={formData.cardholder || ''}
                onChange={handleChange}
                required
                placeholder="Mario Rossi"
                disabled={isLoading}
                aria-describedby="cardholderHelp"
              />
              <Form.Control.Feedback type="invalid">
                Inserisci il nome del titolare.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Numero Carta</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  name="cardnumber"
                  value={formatCardNumber(formData.cardnumber || '')}
                  onChange={handleChange}
                  pattern="[0-9\s]{15,23}" // Adjusted to allow spaces, actual validation happens in JS or backend
                  required
                  placeholder="•••• •••• •••• ••••"
                  disabled={isLoading}
                  maxLength={23} // Max length for formatted number with spaces
                />
                <InputGroup.Text>{renderCardIcon()}</InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                Numero carta non valido (13-19 cifre).
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="mb-4">
              <Col xs={7} sm={8} md={7}>
                <Form.Group>
                  <Form.Label>Scadenza</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    name="expiry"
                    value={formData.expiry || ''}
                    onChange={handleChange}
                    pattern="(0[1-9]|1[0-2])\/([0-9]{2})" // MM/YY
                    required
                    placeholder="MM/AA"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Formato scadenza non valido (MM/AA). Es: 12/25.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={5} sm={4} md={5}>
                <Form.Group>
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    name="cvv"
                    value={formData.cvv || ''}
                    onChange={handleChange}
                    pattern="\d{3,4}" // 3 or 4 digits
                    required
                    placeholder="•••"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Inserisci un CVV valido (3 o 4 cifre).
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
      </Form> {/* Fine del tag Form che ora wrappa solo i campi carta */}


      {activePaymentMethod === 'paypal' && (
        <div className="text-center p-4 border rounded bg-light">
          <FaPaypal size="3em" className="mb-3 text-primary" />
          <p>Verrai reindirizzato a PayPal per completare il pagamento in modo sicuro.</p>
        </div>
      )}

      <Row className="mt-4 pt-2 border-top">
        <Col xs={12} sm={6} className="mb-2 mb-sm-0">
          <Button
            variant="secondary-checkout"
            onClick={() => dispatch(goToPreviousStep())}
            className="w-100 btn-lg-checkout"
            disabled={isLoading}
          >
            <FaArrowLeft className="me-2" /> Indietro
          </Button>
        </Col>
        <Col xs={12} sm={6}>
          {/*
            Questo bottone ora chiama handleSubmit.
            Se activePaymentMethod è 'card', handleSubmit userà formRef.current.checkValidity().
            Se activePaymentMethod è 'paypal', handleSubmit salterà la validazione del form.
            L'attributo `type="submit"` è utile se il form fosse sempre visibile e questo bottone
            fosse sempre interpretato come il submit del form. Data la logica condizionale,
            l'onClick esplicito su handleSubmit è più robusto.
            Ho rimosso `type="submit"` per evitare confusione, dato che handleSubmit
            ora gestisce tutto esplicitamente.
          */}
          <Button
            variant="primary-checkout"
            onClick={handleSubmit} // Questo chiama la funzione handleSubmit definita sopra
            className="w-100 btn-lg-checkout"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                {activePaymentMethod === 'paypal' ? 'Attendere...' : 'Pagamento...'}
              </>
            ) : (
              activePaymentMethod === 'paypal'
                ? 'Continua con PayPal'
                : `Paga ${currencySymbol}${totalAmount}`
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentStep;