import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  FaUserPlus,
  FaEye,
  FaShoppingCart,
  FaImages,
  FaComments
} from 'react-icons/fa';
import './DashboardStats.css';

const statsData = [
  {
    title: 'Utenti Iscritti',
    value: 1245,
    icon: <FaUserPlus />,
    color: '#4e73df'
  },
  {
    title: 'Visite al Sito',
    value: 9354,
    icon: <FaEye />,
    color: '#1cc88a'
  },
  {
    title: 'Totale Vendite',
    value: '€12.450',
    icon: <FaShoppingCart />,
    color: '#36b9cc'
  },
  {
    title: 'Totale Post',
    value: 782,
    icon: <FaImages />,
    color: '#f6c23e'
  },
  {
    title: 'Numero Feedback',
    value: 318,
    icon: <FaComments />,
    color: '#e74a3b'
  }
];

const DashboardStats = () => {
  return (
    <Container className="mt-2 pt-2">
      <Row className="g-3 justify-content-center">
        {statsData.map((stat, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={2}>
            <Card className="stat-card text-dark text-center shadow-sm">
              <Card.Body className="p-3 d-flex flex-column align-items-center justify-content-center">
                <div
                  className="icon-wrapper mb-2"
                  style={{ backgroundColor: stat.color }}
                >
                  {stat.icon}
                </div>
                <div className="stat-label text-muted small">{stat.title}</div>
                <div className="stat-value fw-bold fs-5">{stat.value}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DashboardStats;
