import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Image,
    Nav,
    Dropdown,
    Spinner,
    Card // Useremo Card per il contenitore principale con angoli smussati
} from 'react-bootstrap';
// Icone opzionali, se servono per il menu
// import { GearFill, BoxArrowRight } from 'react-bootstrap-icons';

// Dati fittizi per il profilo e i contenuti delle tab
const mockUserData = {
    username: "username",
    profileImageUrl: "https://via.placeholder.com/100/cccccc/808080?Text=User", // Placeholder grigio
    followers: 0,
    following: 0,
};

const mockPosts = [];
const mockSavedItems = [];
const mockBoughtItems = [];


function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('wardrobe'); // Tab attiva di default
    const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState(null); // Per la gestione degli errori

    // Contenuti delle tab (inizialmente vuoti o con dati fittizi)
    const [posts, setPosts] = useState(mockPosts);
    const [savedItems, setSavedItems] = useState(mockSavedItems);
    const [boughtItems, setBoughtItems] = useState(mockBoughtItems);

    useEffect(() => {
        // Simula il caricamento dei dati
        setIsLoading(true);
        setTimeout(() => {
            setUserData(mockUserData);
            // Qui potresti caricare anche i dati per la tab di default, es. wardrobeItems
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleSelectTab = async (selectedKey) => {
    setActiveTab(selectedKey);
    setIsLoading(true);

    try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        if (selectedKey === 'posts') {
            const res = await fetch("http://localhost:8006/post/miei-post", { headers });
            const data = await res.json();
            setPosts(data);
        } else if (selectedKey === 'saved') {
            const res = await fetch("http://localhost:8006/saved/salvati", { headers });
            const data = await res.json();
            setSavedItems(data);
        } else if (selectedKey === 'bought') {
            const res = await fetch("http://localhost:8006/acquisti/acquisti_miei", { headers });
            const data = await res.json();
            setBoughtItems(data);
        }
    } catch (error) {
        console.error("Errore nel caricamento dati:", error);
    } finally {
        setIsLoading(false);
    }
};

    const renderTabContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-5">
                    <Spinner animation="border" size="sm" />
                    <p className="mt-2">Loading content...</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'posts':
                return posts.length > 0 ? (
                    posts.map(item => <div key={item.id}>{item.title}</div>)
                ) : <p className="text-muted p-3">No posts yet.</p>;
            case 'saved':
                return savedItems.length > 0 ? (
                    savedItems.map(item => <div key={item.id}>{item.name}</div>)
                ) : <p className="text-muted p-3">No saved items.</p>;
            case 'bought':
                return boughtItems.length > 0 ? (
                    boughtItems.map(item => <div key={item.id}>{item.productName}</div>)
                ) : <p className="text-muted p-3">No items bought.</p>;
            default:
                return <p className="text-muted p-3">Select a tab.</p>;
        }
    };

    if (isLoading && !userData) { // Mostra spinner solo al caricamento iniziale dei dati utente
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!userData) { // Se i dati utente non sono stati caricati (es. errore non gestito qui)
        return <Container className="text-center mt-5"><p>Could not load user data.</p></Container>;
    }

    return (
        <Container fluid style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <Card style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Card.Header style={{ backgroundColor: 'white', borderBottom: '1px solid #e9ecef', padding: '1rem 1.5rem' }}>
                    <Row className="align-items-center">
                        <Col>
                            <h5 style={{ margin: 0, color: '#007bff', fontWeight: 'bold' }}>stAllist</h5>
                        </Col>
                        <Col xs="auto">
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="light" id="dropdown-basic" size="sm">
                                    Menu
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body style={{ padding: '2rem 1.5rem' }}>
                    <Row className="align-items-center mb-4">
                        <Col xs="auto">
                            <Image
                                src={userData.profileImageUrl}
                                roundedCircle
                                style={{ width: '80px', height: '80px', border: '2px solid #dee2e6' }}
                            />
                        </Col>
                        <Col>
                            <h4 style={{ fontWeight: '600', margin: 0 }}>@{userData.username}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                                {userData.followers} followers - {userData.following} following
                            </p>
                        </Col>
                    </Row>

                    <Nav variant="pills" activeKey={activeTab} onSelect={handleSelectTab} className="mb-4 custom-pills">
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

                    <div>
                        {renderTabContent()}
                    </div>
                </Card.Body>
            </Card>
            {/* CSS personalizzato per le pillole */}
            <style type="text/css">
                {`
                .custom-pills .nav-link {
                    color: #495057;
                    background-color: #e9ecef;
                    margin-right: 0.5rem;
                    border-radius: 0.5rem; /* Angoli più arrotondati per i pills */
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                }
                .custom-pills .nav-link.active {
                    color: white;
                    background-color: #343a40; /* Sfondo scuro per la tab attiva */
                }
                .custom-pills .nav-link:hover:not(.active) {
                    background-color: #dee2e6;
                }
                `}
            </style>
        </Container>
    );
}

export default ProfilePage;