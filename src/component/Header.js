import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import CartOverlay from '../component/CartOverlay';

function Header() {
  const urlQuery = new URLSearchParams(useLocation().search).get('q');
  const [query, setQuery] = useState(urlQuery ? urlQuery : '');
  const [user, cart] = useSelector(state => [state.user, state.cart]);
  const dispatch = useDispatch();
  let history = useHistory();

  function handleSearch(e) {
    e.preventDefault();
    history.push(`/search?q=${query}`);
  }

  function handleLogout() {
    dispatch({ type: 'logout' });
    history.push('/');
  }

  function hoverCart() {
    dispatch({ type: "set_cart_overlay", payload: true });
  }
  function exitCart() {
    dispatch({ type: "set_cart_overlay", payload: false });
  }

  return (
    <header style={{ "backgroundColor": "#343a40" }}>
      <Navbar bg="dark" variant="dark" expand="lg" className="container">
        <Navbar.Brand as={Link} to="/">Hardware-Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mr-auto">
            <Form inline className="position-relative" onSubmit={handleSearch}>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" value={query} onChange={e => setQuery(e.target.value)} required />
              <Button type="submit" id="search-button">
                <i className="fas fa-search"></i>
              </Button>
            </Form>
            <Nav.Link as={Link} to="/cpu">CPU</Nav.Link>
            <Nav.Link as={Link} to="/motherboard">Motherboard</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <div className="position-relative" onMouseOver={hoverCart} onMouseOut={exitCart}>
              <Nav.Link as={Link} to="/cart" className="mr-2">
                <i className="fas fa-shopping-cart"></i> ({cart.length})
              </Nav.Link>
              <CartOverlay />
            </div>

            {!user.id &&
              <React.Fragment>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </React.Fragment>
            }
            {user.id &&
              <React.Fragment>
                <Nav.Link as={Link} to="/account"><i className="fas fa-user"></i> {user.username}</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </React.Fragment>
            }
          </Nav>

        </Navbar.Collapse>
      </Navbar>

    </header>
  );
}

export default Header;
