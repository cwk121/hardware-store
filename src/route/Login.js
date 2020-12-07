import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

function Login() {
  const [api, user] = useSelector(state => [state.api, state.user]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [login, setLogin] = useState(false);

  if (user.id) {
    history.push("/");
  }

  useEffect(() => {
    if (login) {
      dispatch({ type: "set_loading", payload: true });
      fetch(`${api}/auth/local`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      }).then(response => response.status === 200 ? response.json() : null)
        .then(data => {
          if (data != null) {
            dispatch({ type: "login", payload: { user: data.user, jwt: data.jwt } });
            history.push("/");
          } else {
            setError(true);
          }
          dispatch({ type: "set_loading", payload: false });
        });
      setLogin(false);
    }
  }, [login]);

  function handleSubmit(e) {
    e.preventDefault();
    setLogin(true);
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <Form style={{ "maxWidth": "500px" }} onSubmit={handleSubmit} >

        {error && <Alert variant="danger">Login failed.</Alert>}

        <Form.Group controlId="identifier">
          <Form.Label>Username or Email</Form.Label>
          <Form.Control type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <Button variant="outline-dark" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Login;