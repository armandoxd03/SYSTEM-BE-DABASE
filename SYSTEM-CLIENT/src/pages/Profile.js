import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/users/details', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === "USER-FOUND") {
          setUser(data.result);
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'User not found.',
            icon: 'error',
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch user data.',
          icon: 'error',
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'New Password does not match.',
        icon: 'error',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      switch (data.code) {
        case "PASSWORD-UPDATED":
          Swal.fire({
            title: 'Success!',
            text: 'Password updated successfully.',
            icon: 'success',
          });
          setOldPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          break;

        case "INVALID-OLD-PASSWORD":
          Swal.fire({
            title: 'Error!',
            text: 'The old password you entered is incorrect.',
            icon: 'error',
          });
          break;

        default:
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong.',
            icon: 'error',
          });
          break;
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Unable to process request.',
        icon: 'error',
      });
    }
  };

  return (
    <Container fluid className="vh-100 p-4 bg-light">
      {/* Page Title Section */}
      <Container className="mb-4">
        <h1 className="display-3 text-center mb-3 fw-bold">Change Password</h1>
      </Container>

      {/* Main Content */}
      {user ? (
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={12}>
            <Card className="shadow-sm rounded-3 p-4">
              <Card.Body>
                <h3 className="text-center mb-3">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-center mb-3 text-muted">{user.email}</p>
                <hr />

                {/* Password Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="oldPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="confirmNewPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Re-enter your new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-30 mt-2 rounded-pill fw-bold">
                    Update
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Container className="text-center mt-4">
          <p>Loading...</p>
        </Container>
      )}
    </Container>
  );
};

export default ProfileSettings;
