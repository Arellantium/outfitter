// src/components/ProfilePage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Image, Nav, Spinner, Form, Alert,Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaUserCircle, FaShoppingBag, FaCalendarAlt, FaEuroSign } from 'react-icons/fa';
import "./ProfiloPage.css";
/* =========================================
   Costanti e helper PURE – dichiarati
   fuori dal componente così la reference
   NON cambia ad ogni render
   ========================================= */
const API_BASE = 'http://localhost:8006';

const themeColors = {
  primary: '#CAA870',
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0',
  text: '#333333',
  lightText: '#555555',
  surface: '#ffffff',
  error: '#d32f2f',
  success: '#388e3c',
  inputBorder: '#ced4da',
  inputFocusBorder: '#c89f65',
  lightBackground: '#f8f9fa',
  iconColor: '#4a4a4a',
  borderColor: '#e9ecef',
};

export const buildFullImageUrl = (relativeUrl) => {
  if (!relativeUrl) return null;
  if (/^https?:\/\//.test(relativeUrl) || relativeUrl.startsWith('//')) return relativeUrl;
  return `${API_BASE}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
};

/* ========================================= */
function ProfilePage() {
  console.log('ProfilePage RENDER - Top Level');
  const navigate = useNavigate();
  const { id: profileIdFromUrl } = useParams();

  // stato auth
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loggedInUserData, setLoggedInUserData] = useState(undefined); // undefined -> loading, null -> errore

  // stato profilo visualizzato
  const [viewedUserCoreDetails, setViewedUserCoreDetails] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCountFromStats, setPostsCountFromStats] = useState(0);

  // stato tab
  const [postsItems, setPostsItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  // loading / error flag
  const [profileLoading, setProfileLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabError, setTabError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // avatar
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  /* ---------------- fetch helper ---------------- */
  const fetchData = useCallback(
    async (endpoint, options = {}) => {
      if (!token) return { error: 'Token mancante', data: null, status: 0 };

      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const responseData = isJson ? await res.json() : await res.text();

        if (!res.ok) {
          return { error: responseData.detail || `Errore ${res.status}`, data: null, status: res.status };
        }
        return { data: responseData, error: null, status: res.status };
      } catch (err) {
        return { error: err.message, data: null, status: 0 };
      }
    },
    [token]
  );

  /* ---------- 1. /me ---------- */
  useEffect(() => {
    if (!token) {
      setLoggedInUserData(null);
      setProfileLoading(false);
      return;
    }

    if (loggedInUserData !== undefined) return; // già caricati o falliti

    setProfileLoading(true);
    fetchData('/me').then(({ data, error: meErr }) => {
      if (meErr || !data?.id) {
        setError(meErr || 'Sessione non valida');
        setLoggedInUserData(null);
        localStorage.removeItem('access_token');
        setToken(null);
      } else {
        setLoggedInUserData(data);
      }
      setProfileLoading(false);
    });
  }, [token, loggedInUserData, fetchData]);

  /* ---------- 2. dati core profilo visualizzato ---------- */
  useEffect(() => {
    if (!token || !profileIdFromUrl || loggedInUserData === undefined) return;
    if (loggedInUserData === null) return; // errore /me

    const idNum = Number(profileIdFromUrl);
    if (isNaN(idNum)) {
      setError(`ID profilo ${profileIdFromUrl} non valido`);
      return;
    }

    if (viewedUserCoreDetails && viewedUserCoreDetails.id === idNum) return; // già presente

    let cancelled = false;
    const loadCore = async () => {
      setProfileLoading(true);
      let aggregatedError = '';

      // stats
      const { data: stats, error: statsErr } = await fetchData(`/social/profilo/statistiche/${idNum}`);
      if (!cancelled) {
        if (statsErr) {
          aggregatedError += `Statistiche: ${statsErr}\n`;
          setFollowersCount(0);
          setFollowingCount(0);
          setPostsCountFromStats(0);
        } else {
          setFollowersCount(stats.follower_count || 0);
          setFollowingCount(stats.following_count || 0);
          setPostsCountFromStats(stats.post_count || 0);
        }
      }

      // core details
      let core;
      if (!cancelled) {
        if (loggedInUserData && loggedInUserData.id === idNum) {
          core = {
            id: loggedInUserData.id,
            nome: loggedInUserData.nome,
            display_name: loggedInUserData.display_name || loggedInUserData.nome,
            avatar_url: loggedInUserData.avatar_url || null,
          };
        } else {
          const { data: otherUser, error: otherErr } = await fetchData(`/utenti/${idNum}`);
          if (otherErr || !otherUser?.id) {
            aggregatedError += `Dettagli utente: ${otherErr || 'non trovati'}\n`;
            core = { id: idNum, nome: `utente_${idNum}`, display_name: `Utente ${idNum}`, avatar_url: null };
          } else {
            otherUser.display_name = otherUser.display_name || otherUser.nome;
            core = otherUser;
          }
        }
      }

      if (!cancelled) {
        setViewedUserCoreDetails(core);
        setAvatarPreview(core?.avatar_url ? buildFullImageUrl(core.avatar_url) : null);
        if (aggregatedError) setError((prev) => (prev ? prev + '\n' : '') + aggregatedError.trim());
        setProfileLoading(false);
      }
    };

    loadCore();
    return () => {
      cancelled = true;
    };
  }, [token, profileIdFromUrl, loggedInUserData, viewedUserCoreDetails, fetchData]);

  const isOwnProfile = loggedInUserData && viewedUserCoreDetails && loggedInUserData.id === viewedUserCoreDetails.id;

  /* ---------- 3. dati TAB ---------- */
  const loadTabData = useCallback(
    async (tabKey) => {
      const idNum = viewedUserCoreDetails?.id;
      if (!idNum || !token) return;

      setTabLoading(true);
      setTabError(null);
      let fetchFailed = false;
      let endpoint = '';

      switch (tabKey) {
        case 'posts':
          endpoint = `/posts/utenti/${idNum}/post`;
          break;
        case 'saved':
          if (isOwnProfile) endpoint = '/saved/salvati';
          break;
        case 'bought':
          endpoint = `/utenti/${idNum}/acquisti`;
          break;
        default:
          break;
      }

      try {
        if (!endpoint) {
          if (tabKey === 'saved') setSavedItems([]);
          setTabLoading(false);
          return;
        }
        const { data, error: fetchErr } = await fetchData(endpoint);
        if (fetchErr) {
          fetchFailed = true;
          setTabError(`${tabKey}: ${fetchErr}`);
        }
        if (!fetchFailed) {
          const mapImg = (arr) =>
            arr.map((item) => ({ ...item, image_url: item.image_url }));
          switch (tabKey) {
            case 'posts':
              setPostsItems(Array.isArray(data) ? mapImg(data) : []);
              break;
            case 'saved':
              setSavedItems(Array.isArray(data) ? mapImg(data) : []);
              break;
            case 'bought':
              setBoughtItems(Array.isArray(data) ? mapImg(data) : []);
              break;
            default:
              break;
          }
        }
      } catch (err) {
        setTabError(`Errore ${tabKey}: ${err.message}`);
      } finally {
        setTabLoading(false);
      }
    },
    [viewedUserCoreDetails, token, fetchData, isOwnProfile]
  );

  useEffect(() => {
    if (!profileLoading && viewedUserCoreDetails?.id) {
      loadTabData(activeTab);
    }
  }, [activeTab, loadTabData, profileLoading, viewedUserCoreDetails]);

  /* ---------- handlers UI ---------- */
  const handleSelectTab = (key) => {
    setTabError(null);
    setActiveTab(key);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && isOwnProfile) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setSuccessMessage('Anteprima avatar aggiornata');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  /* ---------- render helper TAB ---------- */
  const renderTabContent = () => {
    if (tabLoading)
      return (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: themeColors.primary }} />
          <p className="mt-2">Caricamento…</p>
        </div>
      );

    if (tabError)
      return (
        <Alert variant="danger" className="text-center py-4">
          {tabError}
        </Alert>
      );

    let items = [];
    let msg = '';
    switch (activeTab) {
      case 'posts':
        items = postsItems;
        msg = 'Nessun post.';
        break;
      case 'saved':
        if (!isOwnProfile) return <p className="text-muted text-center py-4">Solo i tuoi salvati.</p>;
        items = savedItems;
        msg = 'Nessun salvato.';
        break;
      case 'bought':
        items = boughtItems;
        msg = 'Nessun acquisto.';
        break;
      default:
        break;
    }

    if (!items.length) return <p className="text-muted text-center py-4">{msg}</p>;

    if (activeTab === 'bought') {
        return (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {items.map((a) => (
            <Col key={a.id || a.order_id}>
                <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                    <FaShoppingBag size={20} style={{ color: '#CAA870', marginRight: '8px' }} />
                    <Card.Title className="h6 mb-0">
                        Ordine #{a.order_id || a.id}
                    </Card.Title>
                    </div>
                    <Card.Text className="mb-2">
                    <strong>{a.item_name || 'Articolo'}</strong>
                    </Card.Text>
                    <Card.Text className="mb-1 text-muted small">
                    <FaEuroSign size={12} /> Prezzo: {a.prezzo_pagato?.toFixed(2)}€
                    </Card.Text>
                    <Card.Text className="mb-0 text-muted small">
                    <FaCalendarAlt size={12} /> Data: {new Date(a.created_at || a.data_acquisto).toLocaleDateString()}
                    </Card.Text>
                </Card.Body>
                </Card>
            </Col>
            ))}
        </Row>
        );
    }

    return (
      <Row xs={2} sm={3} md={4} className="g-3">
        {items.map((item) => (
            <Col key={item.id || item.post_id}>
            <Card className="h-100 border-0 shadow-sm position-relative profile-post-card">
                {/* Badge VENDUTO */}
                {item.venduto && (
                <Badge
                    bg="danger"
                    className="position-absolute top-0 start-0 m-2"
                    style={{ borderRadius: '8px', fontSize: '0.75rem', padding: '4px 8px' }}
                >
                    VENDUTO
                </Badge>
                )}

                {/* Immagine */}
                {item.image_url && (
                <Image
                    src={`/${item.image_url}`}
                    alt={item.description || 'Immagine'}
                    fluid
                    className="profile-post-image"
                    style={{
                    objectFit: 'cover',
                    height: '300px',
                    width: '100%',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                    }}
                />
                )}

                {/* Contenuto Card */}
                <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Text className="text-muted small">
                    {item.description || 'Nessuna descrizione'}
                </Card.Text>

                <div className="d-flex align-items-center">
                    {item.likes > 0 ? (
                        <>
                        <FaHeart style={{ color: 'red' }} />
                        <span className="text-dark m-1 small">({item.likes})</span>
                        </>
                    ) : (
                        <>
                        <FaRegHeart />
                        </>
                    )}
                </div>
                </Card.Body>
            </Card>
            </Col>
        ))}
        </Row>

    );
  };

  /* ---------- early returns ---------- */
  if (profileLoading || loggedInUserData === undefined)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" style={{ color: themeColors.primary }} />
        <span className="ms-3">Caricamento…</span>
      </Container>
    );

  if (!token || loggedInUserData === null)
    return (
      <Container className="text-center mt-5 pt-5">
        <Alert variant="danger">Accesso richiesto</Alert>
      </Container>
    );

  if (!viewedUserCoreDetails)
    return (
      <Container className="text-center mt-5 pt-5">
        <Alert variant="warning">Profilo non trovato</Alert>
      </Container>
    );

  /* ---------- render principale ---------- */
  return (
    <>
      {/* styles inline per semplicità (uguali ai tuoi) */}
      <style>{`:root{--theme-primary:${themeColors.primary};--theme-primary-darker:${themeColors.primaryDarker};--theme-text:${themeColors.text};--theme-light-text:${themeColors.lightText};--theme-surface:${themeColors.surface};--theme-page-bg:${themeColors.secondary};}`}</style>

      <Container className="profile-page-container py-5">
        <div className="profile-main-card position-relative p-4 bg-white rounded-4 shadow-sm">
          <Link to="/"
              className="logo-text ms-2 ms-md-3"
              aria-label="Pagina principale StAIlist"
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <span className="stailist-st">st</span>
              <span className="stailist-ai">AI</span>
              <span className="stailist-list">list</span>
          </Link>

          {/* Avatar */}
          <div className="text-center mt-4">
            <div
              className={`profile-avatar-wrapper ${isOwnProfile ? 'profile-avatar-wrapper-editable' : ''}`}
            >
              
            <div className="profile-avatar-overlay">
                <FaUserCircle size={60} />
            </div>
              
            </div>
            {isOwnProfile && (
              <Form.Control
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            )}
          </div>

          {/* Nome + stats */}
          <div className="text-center mt-3">
            <h1>{viewedUserCoreDetails.display_name}</h1>
            <p className="username-handle">@{viewedUserCoreDetails.nome}</p>
          </div>
          <div className="profile-stats d-flex justify-content-center gap-4 my-3">
            <div className="text-center">
                <div className="stat-number">{postsCountFromStats || postsItems.length}</div>
                <div className="stat-label">Posts</div>
            </div>
            <div className="text-center">
                <div className="stat-number">{followersCount}</div>
                <div className="stat-label">Followers</div>
            </div>
            <div className="text-center">
                <div className="stat-number">{followingCount}</div>
                <div className="stat-label">Following</div>
            </div>
            </div>

          {/* Messaggi */}
          {successMessage && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setSuccessMessage(null)}
              className="mx-auto mb-3"
              style={{ maxWidth: 500 }}
            >
              {successMessage}
            </Alert>
          )}
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
              className="mx-auto mb-3"
              style={{ maxWidth: 500, whiteSpace: 'pre-wrap' }}
            >
              {error}
            </Alert>
          )}

          {/* NAV Tabs */}
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={handleSelectTab}
            className="justify-content-center profile-tabs-nav-compact"
            >
            <Nav.Item>
                <Nav.Link eventKey="posts">
                <span className="tab-text">Post</span>
                </Nav.Link>
            </Nav.Item>
            {isOwnProfile && (
                <Nav.Item>
                <Nav.Link eventKey="saved">
                    <span className="tab-text">Salvati</span>
                </Nav.Link>
                </Nav.Item>
            )}
            <Nav.Item>
                <Nav.Link eventKey="bought">
                <span className="tab-text">Acquisti</span>
                </Nav.Link>
            </Nav.Item>
        </Nav>


          {/* TAB content */}
          <div className="profile-content-area-integrated mt-3">{renderTabContent()}</div>
        </div>
      </Container>
    </>
  );
}

export default ProfilePage;
