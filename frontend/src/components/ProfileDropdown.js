import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const ProfileDropdown = () => {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="link" className="p-0 border-0 text-dark d-flex align-items-center">
        <FaUserCircle size={20} className="nav-icon" />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/profile">
          <FaUser className="me-2" />
          Mio Profilo
        </Dropdown.Item>

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
