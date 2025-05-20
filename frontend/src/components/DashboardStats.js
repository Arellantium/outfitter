import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {
  FaUserPlus,
  FaEye,
  FaShoppingCart,
  FaImages,
  FaComments
} from 'react-icons/fa';
import './DashboardStats.css';
import { fetchDashboardStats } from '../redux/reducers/dashboardStatsReducer';

const DashboardStats = () => {
  const dispatch = useDispatch();
  const { data: stats, loading, error } = useSelector((state) => state.dashboardStats);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const statsData = stats ? [
    {
      title: 'Utenti Iscritti',
      value: stats.utenti_iscritti,
      icon: <FaUserPlus />,
      color: '#4e73df'
    },
    {
      title: 'Visite al Sito',
      value: stats.visite_sito,
      icon: <FaEye />,
      color: '#1cc88a'
    },
    {
      title: 'Totale Vendite',
      value: `€${stats.totale_vendite}`,
      icon: <FaShoppingCart />,
      color: '#36b9cc'
    },
    {
      title: 'Totale Post',
      value: stats.totale_post,
      icon: <FaImages />,
      color: '#f6c23e'
    },
    {
      title: 'Numero Feedback',
      value: stats.numero_feedback,
      icon: <FaComments />,
      color: '#e74a3b'
    }
  ] : [];

  return (
    <Container className="mt-2 pt-2">
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          Errore nel caricamento: {error}
        </Alert>
      )}

      {!loading && !error && (
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
      )}
    </Container>
  );
};

export default DashboardStats;
