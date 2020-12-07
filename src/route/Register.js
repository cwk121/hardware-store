import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

function Register() {
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const api = useSelector(state => state.api);
  const dispatch = useDispatch();

  useEffect(() => {
    if (register) {
      dispatch({ type: "set_loading", payload: true });
      if (password !== confirmPassword) {
        dispatch({ type: "set_loading", payload: false });
        return;
      }

      fetch(`${api}/auth/local/register`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password
        })
      }).then(response => response.json())
        .then(data => {
          if (data.user) {
            setError('');
            setSuccess(true);
          } else {
            setError(data.message[0].messages[0].message);
            setSuccess(false);
          }
          dispatch({ type: "set_loading", payload: false });
        });
      setRegister(false);
    }
  }, [register]);

  function handleSubmit(e) {
    e.preventDefault();
    setRegister(true);
  }

  return (
    <div className="container">
      <h1>Register</h1>
      <Form style={{ "maxWidth": "500px" }} onSubmit={handleSubmit} >

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Registration succeeded.</Alert>}

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="confirm">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
            className={password === confirmPassword ? null : "border border-danger"} />
        </Form.Group>

        <Button variant="outline-dark" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Register;