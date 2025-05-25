import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Row,
    Col,
    Image,
    Nav,
    Dropdown,
    Spinner,
    Card // Useremo Card per il contenitore principale
} from 'react-bootstrap';

const API_BASE = "http://localhost:8006"; // Il tuo URL base dell'API

function UserProfilePageStAylist() {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const [postsItems, setPostsItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]); // Non presente nello script originale, ma c'è la tab
    const [boughtItems, setBoughtItems] = useState([]);

    const [activeTab, setActiveTab] = useState('wardrobe');
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingTabContent, setIsLoadingTabContent] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            setError("Token non trovato. Effettua il login.");
            setIsLoadingProfile(false);
        }
    }, []);

    const fetchData = useCallback(async (endpoint, options = {}) => {
        if (!token) return { error: "Token non disponibile" };
        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: res.statusText }));
                console.error(`Errore API ${res.status} per ${endpoint}:`, errorData);
                throw new Error(errorData.message || `Errore ${res.status}`);
            }
            return await res.json();
        } catch (err) {
            console.error(`Errore di rete o fetch per ${endpoint}:`, err);
            setError(err.message);
            return { error: err.message };
        }
    }, [token]);


    useEffect(() => {
        if (!token) {
            setIsLoadingProfile(false);
            return;
        }

        const loadProfileData = async () => {
            setIsLoadingProfile(true);
            setError(null);

            const userRes = await fetchData("/me");
            if (userRes.error || !userRes.id) {
                setError(userRes.error || "Impossibile caricare i dati utente.");
                setIsLoadingProfile(false);
                return;
            }
            setUserData(userRes);

            const [followersRes, followingRes] = await Promise.all([
                fetchData(`/social/followers/${userRes.id}`).catch(e => ({ followers: [] })), // Gestisci errori individuali
                fetchData(`/social/following/${userRes.id}`).catch(e => ({ following: [] }))
            ]);

            setFollowersCount(followersRes.followers?.length || 0);
            setFollowingCount(followingRes.following?.length || 0);

            setIsLoadingProfile(false);
        };

        loadProfileData();
    }, [token, fetchData]);


    const loadTabData = useCallback(async (tabKey) => {
        if (!userData || !userData.id || !token) return;

        setIsLoadingTabContent(true);
        setError(null);
        let data;

        try {
            switch (tabKey) {
                case 'posts':
                    // Il tuo JS originale filtrava i post lato client.
                    // Idealmente, il backend dovrebbe fornire un endpoint per i post dell'utente.
                    // Qui replico il filtro, ma considera di modificarlo.
                    const allPosts = await fetchData(`/posts/my-post`);
                    if (!allPosts.error) {
                        const userPostsData = allPosts.filter(p => p.author === userData.nome);
                        setPostsItems(userPostsData || []);
                    }
                    break;
                case 'saved':
                    // Aggiungi qui la logica per caricare gli elementi salvati
                    data = await fetchData(`/saved/salvati`);
                    setSavedItems([]); // Placeholder
                    console.warn("Logica per 'Saved' non implementata nell'API originale.");
                    break;
                case 'bought':
                    data = await fetchData(`/acquisti_miei`);
                    if (!data.error) setBoughtItems(data || []);
                    break;
                default:
                    break;
            }
            if (data && data.error) {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingTabContent(false);
        }
    }, [userData, token, fetchData]);


    useEffect(() => {
        if (userData && userData.id) {
            loadTabData(activeTab);
        }
    }, [activeTab, userData, loadTabData]);

    const handleSelectTab = (selectedKey) => {
        setActiveTab(selectedKey);
    };

    const renderTabContent = () => {
        if (isLoadingTabContent) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Caricamento...</p>
                </div>
            );
        }
        if (error && activeTab) return <p className="text-danger p-3">Errore nel caricamento: {error}</p>;


        switch (activeTab) {
            case 'posts':
                return postsItems.length > 0 ? (
                    postsItems.map(p => (
                        <div key={p.id || p.created_at} className="post-item-react mb-4">
                            {p.image_url && (
                                <Image
                                    className="post-img-react mb-2"
                                    src={`${API_BASE}/${p.image_url}`}
                                    alt="Post Image"
                                    fluid
                                    rounded
                                />
                            )}
                            <p><strong>{p.description}</strong></p>
                            <small className="text-muted">{new Date(p.created_at).toLocaleString()}</small>
                        </div>
                    ))
                ) : <p className="text-muted">No posts yet.</p>;
            case 'saved':
                return savedItems.length > 0 ? (
                    savedItems.map(item => <div key={item.id}>Elemento salvato: {item.name}</div>)
                ) : <p className="text-muted">No saved items.</p>;
            case 'bought':
                return boughtItems.length > 0 ? (
                    boughtItems.map(a => <div key={a.id}>Acquisto #{a.id} – €{a.prezzo_pagato}</div>)
                ) : <p className="text-muted">No purchases yet.</p>;
            default:
                return <p className="text-muted">Select a tab.</p>;
        }
    };

    if (isLoadingProfile && !userData) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" /> <span className="ms-2">Caricamento Profilo...</span>
            </Container>
        );
    }

    if (!token || (error && !userData)) { // Se non c'è token o c'è un errore prima che userData sia settato
        return (
            <Container className="text-center mt-5">
                <Card className="p-4">
                    <h3 className="text-danger">Errore</h3>
                    <p>{error || "Autenticazione richiesta."}</p>
                    {/* Potresti aggiungere un link al login */}
                </Card>
            </Container>
        );
    }
    
    if (!userData && !isLoadingProfile) { // Caso in cui il caricamento è finito ma userData è null senza un errore specifico precedente
        return (
             <Container className="text-center mt-5">
                <Card className="p-4">
                    <h3 className="text-warning">Attenzione</h3>
                    <p>Impossibile caricare i dati del profilo. Riprova più tardi.</p>
                </Card>
            </Container>
        );
    }


    return (
        <>
            {/* Stili globali e specifici per il componente */}
            <style type="text/css">{`
                body { background-color: #f4f4f4; color: #333; font-family: 'Inter', sans-serif; }
                .user-profile-card { padding: 30px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); background-color: #fff; }
                .user-profile-avatar { width: 100px; height: 100px; }
                .user-profile-info h2 { font-size: 24px; font-weight: 600; }
                .user-profile-info p { margin-top: 5px; font-size: 16px; color: #666; }
                
                .custom-profile-tabs .nav-link {
                    padding: 10px 20px;
                    background-color: #e9e9e9;
                    border-radius: 20px; /* Molto arrotondato come da CSS originale */
                    color: #333;
                    font-weight: normal;
                    margin-right: 15px; /* Spazio tra le tab */
                    transition: background-color 0.3s, color 0.3s;
                    border: none; /* Rimuove il bordo di default di react-bootstrap */
                }
                .custom-profile-tabs .nav-link:last-child {
                    margin-right: 0;
                }
                .custom-profile-tabs .nav-link:hover,
                .custom-profile-tabs .nav-link.active {
                    background-color: #333;
                    color: #fff;
                }
                .profile-content-area { margin-top: 30px; min-height: 200px; }
                .post-img-react { max-width: 250px; width: 100%; border-radius: 12px; }
                .dropdown-btn-custom { background-color: #f0f0f0; border: none; padding: 10px 15px; border-radius: 10px; font-weight: 600; }
                .logo-custom { font-weight: bold; font-size: 1.5rem; color: #007bff } /* Esempio colore logo */
            `}</style>

            <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Card className="user-profile-card">
                    <Row className="mb-4 align-items-center">
                        <Col>
                            <div className="logo-custom">stAIlist</div>
                        </Col>
                        <Col xs="auto">
                            <Dropdown>
                                <Dropdown.Toggle className="dropdown-btn-custom" id="dropdown-profile-menu">
                                    Menu ▾
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" style={{ borderRadius: '10px', boxShadow: '0px 8px 16px rgba(0,0,0,0.1)', minWidth: '220px' }}>
                                    <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item href="#/orders">My Orders</Dropdown.Item>
                                    <Dropdown.Item href="#/balance">
                                        Balance <span className="fw-bold">{(userData?.guadagni_totali || 0).toFixed(2)} €</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
                                    <Dropdown.Item href="#/shipping">Shipping</Dropdown.Item>
                                    <Dropdown.Item href="#/payments">Payments</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#/logout" className="text-danger">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>

                    <Row className="align-items-center mb-4">
                        <Col xs="auto">
                            <Image
                                className="user-profile-avatar"
                                src={userData?.avatar_url ? `${API_BASE}/${userData.avatar_url}` : "https://via.placeholder.com/100/cccccc/808080?Text=User"}
                                roundedCircle
                            />
                        </Col>
                        <Col className="user-profile-info">
                            <h2>@{userData?.nome || "username"}</h2>
                            <p>{followersCount} followers · {followingCount} following</p>
                        </Col>
                    </Row>

                    <Nav variant="pills" activeKey={activeTab} onSelect={handleSelectTab} className="custom-profile-tabs mb-4">

                        <Nav.Item>
                            <Nav.Link eventKey="posts">Posts</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="saved">Saved</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="bought">Bought</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <div className="profile-content-area">
                        {renderTabContent()}
                    </div>
                </Card>
            </Container>
        </>
    );
}

export default UserProfilePageStAylist;