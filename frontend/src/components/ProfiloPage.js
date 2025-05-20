import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Card, Nav, Tab } from 'react-bootstrap';
import { PersonPlus, PersonCheck, BarChartFill } from 'react-bootstrap-icons'; // Icone di esempio

// Componenti fittizi per i post e la dashboard
const PostCard = ({ post }) => (
    <Card className="mb-3">
        {post.imageUrl && <Card.Img variant="top" src={post.imageUrl} alt={post.caption} />}
        <Card.Body>
            <Card.Text>{post.caption}</Card.Text>
        </Card.Body>
    </Card>
);

const EarningsDashboard = ({ earningsData }) => (
    <Card>
        <Card.Header as="h5">
            <BarChartFill className="me-2" />
            Guadagni del Profilo
        </Card.Header>
        <Card.Body>
            <p><strong>Guadagni Totali:</strong> €{earningsData.totalEarnings || 0}</p>
            <p><strong>Vendite del Mese:</strong> €{earningsData.monthlySales || 0}</p>
            {/* Aggiungi altri grafici o statistiche qui */}
        </Card.Body>
    </Card>
);


function ProfilePage({ userId, currentUserId }) { // userId del profilo da visualizzare, currentUserId dell'utente loggato
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [earnings, setEarnings] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simula il recupero dei dati del profilo
    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // --- Chiamata API al backend FastAPI per i dati del profilo ---
                // Esempio: const response = await fetch(`/api/users/${userId}`);
                // const data = await response.json();

                // Dati fittizi per l'esempio
                const mockProfileData = {
                    id: userId,
                    name: "Mario Rossi",
                    profileImageUrl: "https://via.placeholder.com/150", // Sostituisci con l'URL reale
                    followers: 1250,
                    following: 300,
                    isOwnProfile: userId === currentUserId, // Determina se è il profilo dell'utente loggato
                };
                setProfileData(mockProfileData);

                // --- Chiamata API per lo stato "segui" ---
                // Esempio: const followStatusResponse = await fetch(`/api/users/${currentUserId}/following/${userId}`);
                // const followStatusData = await followStatusResponse.json();
                // setIsFollowing(followStatusData.isFollowing);
                setIsFollowing(false); // Valore fittizio iniziale

                // --- Chiamata API per i post ---
                // Esempio: const postsResponse = await fetch(`/api/users/${userId}/posts`);
                // const postsData = await postsResponse.json();
                const mockPosts = [
                    { id: 1, imageUrl: "https://via.placeholder.com/600x400?text=Post+1", caption: "Descrizione del primo post!" },
                    { id: 2, imageUrl: "https://via.placeholder.com/600x400?text=Post+2", caption: "Un altro bellissimo post." },
                    { id: 3, caption: "Solo testo per questo post." }, // Post senza immagine
                ];
                setPosts(mockPosts);

                // --- Chiamata API per i guadagni (solo se è il profilo dell'utente) ---
                if (mockProfileData.isOwnProfile) {
                    // Esempio: const earningsResponse = await fetch(`/api/users/${userId}/earnings`);
                    // const earningsData = await earningsResponse.json();
                    const mockEarnings = {
                        totalEarnings: 5780.50,
                        monthlySales: 750.20,
                    };
                    setEarnings(mockEarnings);
                }

            } catch (err) {
                setError("Errore nel caricamento dei dati del profilo.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId, currentUserId]);

    const handleFollowToggle = async () => {
        // --- Chiamata API al backend FastAPI per seguire/smettere di seguire ---
        try {
            // Esempio:
            // const method = isFollowing ? 'DELETE' : 'POST';
            // await fetch(`/api/users/${currentUserId}/follow/${userId}`, { method });
            setIsFollowing(!isFollowing);
            // Aggiorna il conteggio dei follower se necessario (potrebbe essere gestito dal backend)
            setProfileData(prevData => ({
                ...prevData,
                followers: isFollowing ? prevData.followers -1 : prevData.followers + 1
            }));
        } catch (err) {
            console.error("Errore durante l'azione di follow/unfollow:", err);
            // Potresti voler mostrare un messaggio di errore all'utente
        }
    };

    if (isLoading) {
        return <Container className="text-center mt-5"><p>Caricamento...</p></Container>;
    }

    if (error) {
        return <Container className="text-center mt-5 alert alert-danger"><p>{error}</p></Container>;
    }

    if (!profileData) {
        return <Container className="text-center mt-5"><p>Profilo non trovato.</p></Container>;
    }

    return (
        <Container fluid style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '20px' }}>
            {/* Sezione Header Profilo */}
            <Row className="mb-4 p-3 bg-white shadow-sm align-items-center" style={{ borderBottom: '1px solid #dee2e6' }}>
                <Col xs="auto">
                    <Image
                        src={profileData.profileImageUrl || "https://via.placeholder.com/100?text=No+Img"}
                        roundedCircle
                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #dee2e6' }}
                    />
                </Col>
                <Col>
                    <h2 className="mb-0">{profileData.name}</h2>
                    <div className="text-muted">
                        <span><strong>{profileData.followers}</strong> Followers</span>
                        <span className="ms-3"><strong>{profileData.following}</strong> Seguiti</span>
                    </div>
                </Col>
                {!profileData.isOwnProfile && (
                    <Col xs="auto">
                        <Button
                            variant={isFollowing ? "outline-secondary" : "primary"}
                            onClick={handleFollowToggle}
                        >
                            {isFollowing ? <PersonCheck className="me-1" /> : <PersonPlus className="me-1" />}
                            {isFollowing ? "Seguito" : "Segui"}
                        </Button>
                    </Col>
                )}
            </Row>

            {/* Tabbed Content: Posts e Dashboard Guadagni */}
            <Tab.Container id="profile-tabs" defaultActiveKey="posts">
                <Row>
                    <Col>
                        <Nav variant="pills" className="flex-row mb-3 justify-content-center">
                            <Nav.Item>
                                <Nav.Link eventKey="posts">Post</Nav.Link>
                            </Nav.Item>
                            {profileData.isOwnProfile && ( // Mostra tab guadagni solo se è il proprio profilo
                                <Nav.Item>
                                    <Nav.Link eventKey="earnings">Dashboard Guadagni</Nav.Link>
                                </Nav.Item>
                            )}
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tab.Content>
                            <Tab.Pane eventKey="posts">
                                <h3 className="mb-3 text-center">Post di {profileData.name}</h3>
                                <Row xs={1} md={2} lg={3} className="g-4">
                                    {posts.length > 0 ? (
                                        posts.map(post => (
                                            <Col key={post.id}>
                                                <PostCard post={post} />
                                            </Col>
                                        ))
                                    ) : (
                                        <p className="text-center">Nessun post da mostrare.</p>
                                    )}
                                </Row>
                            </Tab.Pane>
                            {profileData.isOwnProfile && (
                                <Tab.Pane eventKey="earnings">
                                    <EarningsDashboard earningsData={earnings} />
                                </Tab.Pane>
                            )}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
}

export default ProfilePage;