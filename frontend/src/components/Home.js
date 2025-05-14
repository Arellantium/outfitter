import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Card, InputGroup, Button, Badge, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const dummyProducts = [
    {
      id: 1,
      title: 'Geo Seamless T-Shirt',
      fit: 'Slim Fit',
      color: 'Black',
      price: 'US$40',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1556909212-ef180e877ff3',
      badge: 'NEW',
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      title: 'Arrival Shorts',
      fit: 'Slim Fit',
      color: 'Black',
      price: 'US$35',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1592878849121-d2fd4ddc91ec',
      badge: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
    },
    {
      id: 3,
      title: 'Crest Hoodie',
      fit: 'Slim Fit',
      color: 'Black',
      price: 'US$60',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1610088441625-869d433b82c5',
      badge: '',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 4,
      title: 'Crest T-Shirt (Tall)',
      fit: 'Regular Fit',
      color: 'White',
      price: 'US$28',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1618354691221-8b56e6f7ba5a',
      badge: 'NEW',
      sizes: ['S', 'M', 'L', 'XL']
    }
  ];

  return (
    <div style={{ backgroundColor: '#f0ece3' }}>
      {/* Navbar */}
      <Navbar expand="lg" className="bg-white shadow-sm px-4 py-2">
        <Navbar.Brand href="#" className="fw-bold fs-4" style={{ color: '#222' }}>
          st<span style={{ color: '#B28B67' }}>AI</span>list
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <InputGroup className="me-3" style={{ maxWidth: '400px' }}>
            <Form.Control
              placeholder="Search outfits or users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
          <Nav>
            <Nav.Link href="#"><i className="bi bi-person fs-5 me-3"></i></Nav.Link>
            <Nav.Link href="#"><i className="bi bi-bag fs-5"></i></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="px-4 py-5">
        {/* AI Video Panel */}
        <Row className="mb-5">
          <Col md={10} className="mx-auto">
            <Card className="overflow-hidden border-0" style={{ borderRadius: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <video autoPlay loop muted playsInline style={{ width: '100%', objectFit: 'cover', height: '500px', filter: 'brightness(55%)' }}>
                  <source src="https://cdn.coverr.co/videos/coverr-closeup-of-young-woman-6899/1080p.mp4" type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', top: '20%', left: '8%', color: 'white', maxWidth: '60%' }}>
                  <h1 className="fw-bold display-5">Empower Your Look<br />with AI-Driven Style</h1>
                  <p className="lead">Discover fashion curated just for you, by AI.</p>
                  <Button variant="light" className="mt-3 px-4 py-2 rounded-pill fw-semibold">
                    Discover Now
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Product Grid with Hover */}
        <Row className="g-4">
          {dummyProducts.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
              <div className="position-relative rounded overflow-hidden shadow-sm" style={{ backgroundColor: '#fffaf0', height: '450px' }}>
                <img src={item.image} alt={item.title} className="img-fluid w-100 h-100" style={{ objectFit: 'cover', borderRadius: '0.75rem' }} />
                {item.badge && (
                  <Badge bg="light" text="dark" className="position-absolute top-0 start-0 m-2">
                    {item.badge}
                  </Badge>
                )}
                <div className="position-absolute top-0 w-100 h-100 d-flex flex-column justify-content-end p-3 hover-overlay" style={{ background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }}>
                  <div className="bg-white bg-opacity-75 rounded p-2 text-dark" style={{ display: 'none' }}>
                    <h6 className="fw-bold mb-1">{item.title}</h6>
                    <p className="mb-1" style={{ fontSize: '0.9rem' }}>{item.fit} - {item.color}</p>
                    <p className="mb-1 fw-bold">{item.price}</p>
                    <p className="mb-1">⭐ {item.rating}</p>
                    <div className="d-flex flex-wrap gap-1">
                      {item.sizes.map(size => (
                        <Badge bg="secondary" key={size}>{size}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <style>{`
                .hover-overlay:hover {
                  background: rgba(0,0,0,0.5);
                }
                .hover-overlay:hover .bg-white {
                  display: block !important;
                }
              `}</style>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
