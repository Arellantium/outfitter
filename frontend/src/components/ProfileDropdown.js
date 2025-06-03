import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';


const ProfileDropdown = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8006/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error(`Errore: ${res.status}`);
        const data = await res.json();
        console.log(data);  // console.log invece di console()!
        setUser(data);  // aggiorna lo state e forza il render
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);  // Chiamata solo al primo caricamento

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="link" className="p-0 border-0 text-dark d-flex align-items-center">
        <FaUserCircle size={20} className="nav-icon" />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {user && (
          <Dropdown.Item href={`/profile/${user.id}`}>
            Profilo
          </Dropdown.Item>
        )}

        <Dropdown.Divider />

        <Dropdown.Item href="/login">
          <FaSignOutAlt className="me-2" />
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
