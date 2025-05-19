import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner, InputGroup } from 'react-bootstrap'; // Aggiunto Spinner, InputGroup
import { FaArrowRight } from 'react-icons/fa';

// Definiamo le opzioni di spedizione
const shippingOptions = [
    { id: 'standard', name: 'Spedizione Standard', price: 0, currency: '€', eta: '3-5 giorni lavorativi' },
    { id: 'express', name: 'Spedizione Espressa', price: 5.00, currency: '€', eta: '1-2 giorni lavorativi' },
];

const ShippingStep = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        ...initialData,
        shippingMethod: initialData.shippingMethod || shippingOptions[0].id, // Default alla prima opzione
    });
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Stato per il caricamento

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            ...initialData,
            shippingMethod: initialData.shippingMethod || shippingOptions[0].id,
        }));
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleShippingMethodChange = (e) => {
        const selectedOptionId = e.target.value;
        setFormData(prev => ({ ...prev, shippingMethod: selectedOptionId }));
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
            // Simuliamo un delay per l'elaborazione
            setTimeout(() => {
                onSubmit({ ...formData, selectedShippingOption }); // Passiamo anche l'opzione di spedizione completa
                setIsLoading(false);
            }, 1000); // Delay di 1 secondo
        }
    };

    const selectedShippingOptionDetails = shippingOptions.find(opt => opt.id === formData.shippingMethod);

    return (
        <div>
            <h3 className="step-title">1. Indirizzo di Spedizione e Contatti</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* ... (campi form Nome, Email, Telefono, Indirizzo, Città, CAP, Paese - invariati) ... */}
                <Form.Group className="mb-3" controlId="formFullname">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                        placeholder="Es. Mario Rossi"
                        disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">Inserisci il nome completo.</Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-3">
                    <Col md={6} className="mb-3 mb-md-0">
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Es. mario.rossi@esempio.com"
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">Inserisci un'email valida.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                         <Form.Group controlId="formPhone">
                            <Form.Label>Telefono <span className="text-muted-checkout">(Opzionale)</span></Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Es. 3331234567"
                                disabled={isLoading}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Indirizzo (Via/Piazza, Numero Civico)</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Es. Via Roma, 10"
                        disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">Inserisci l'indirizzo.</Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-3"> {/* Ridotto mb a 3, il successivo mb-4 per spedizione darà più spazio */}
                    <Form.Group as={Col} md="5" className="mb-3 mb-md-0" controlId="formCity">
                        <Form.Label>Città</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            placeholder="Es. Milano"
                            disabled={isLoading}
                        />
                        <Form.Control.Feedback type="invalid">Inserisci la città.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" xs="6" className="mb-3 mb-md-0" controlId="formZip">
                        <Form.Label>CAP</Form.Label>
                        <Form.Control
                            type="text"
                            inputMode="numeric"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            pattern="[0-9]{5}"
                            required
                            placeholder="Es. 20100"
                            disabled={isLoading}
                        />
                        <Form.Control.Feedback type="invalid">CAP non valido (5 cifre).</Form.Control.Feedback>
                    </Form.Group>
                     <Form.Group as={Col} md="4" xs="6" controlId="formCountry">
                        <Form.Label>Paese</Form.Label>
                        <Form.Select name="country" value={formData.country} onChange={handleChange} required disabled={isLoading}>
                            <option value="IT">Italia</option>
                            <option value="FR">Francia</option>
                            <option value="DE">Germania</option>
                            <option value="ES">Spagna</option>
                        </Form.Select>
                    </Form.Group>
                </Row>

                {/* Sezione Metodi di Spedizione */}
                <Form.Group className="my-4">
                    <Form.Label as="h6" className="mb-3">Metodo di Spedizione</Form.Label>
                    {shippingOptions.map((option) => (
                        <Form.Check
                            type="radio"
                            key={option.id}
                            id={`shipping-${option.id}`}
                            name="shippingMethod" // Deve essere lo stesso nome per tutti i radio
                            value={option.id}
                            checked={formData.shippingMethod === option.id}
                            onChange={handleShippingMethodChange}
                            disabled={isLoading}
                            label={
                                <div className="d-flex justify-content-between w-100">
                                    <span>{option.name} <small className="text-muted d-block">{option.eta}</small></span>
                                    <strong>
                                        {option.price > 0 ? `${option.currency}${option.price.toFixed(2)}` : 'Gratuita'}
                                    </strong>
                                </div>
                            }
                            className="mb-2 p-3 border rounded shipping-option-check"
                        />
                    ))}
                </Form.Group>


                <Button variant="primary-checkout" type="submit" className="w-100 mt-3 btn-lg-checkout" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
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