import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Table, Form, Col } from 'react-bootstrap';

function CheckoutModal({ showCheckout, setShowCheckout, setMessage }) {
  const [api, cart, jwt] = useSelector(state => [state.api, state.cart, state.jwt]);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (showCheckout === true) {
      setReady(false);
      createOrder();
    }
    setReady(true);
  }, [showCheckout]);

  async function createOrder() {
    // Sync items information from server
    let updatedItems = [];
    for (let item of cart) {
      await fetch(`${api}/items/${item.id}`)
        .then(response => response.json())
        .then(data => {
          data.quantity = item.quantity;
          updatedItems.push(data);
        })
    }
    dispatch({ type: "set_cart", payload: updatedItems });

    // Set total amount
    let total = 0;
    cart.forEach(item => {
      let price = item.discounted_price ? item.discounted_price : item.price;
      total += item.quantity * price;
    })
    setTotal(total);
  }

  function handleCheckout() {
    dispatch({ type: "set_loading", payload: true });
    fetch(`${api}/orders`, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        address: address,
        items: cart
      })
    }).then(response => response.status === 200 ? response.json() : null)
      .then(data => {
        if (data) {
          dispatch({ type: "clear_cart" });
          setShowCheckout(false);
          setMessage("Your order has been received. Thank you for your purchase!");
        }
        dispatch({ type: "set_loading", payload: false });
      })
  }

  
  if (!ready) {
    return <div>Loading...</div>;
  }
  return (
    <Modal
      show={showCheckout}
      size="lg"
      onHide={() => setShowCheckout(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Checkout
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group as={Col} controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" value={address} onChange={e => setAddress(e.target.value)} required />
          </Form.Group>
        </Form>

        <Table striped bordered hover size="sm" className="mt-2">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.discounted_price ? <span><strike>{item.price}</strike> ${item.discounted_price}</span> : item.price}</td>
                <td>{item.quantity}</td>
                <td>${item.discounted_price ? item.discounted_price * item.quantity : item.price * item.quantity}</td>
              </tr>
            ))}
            <tr>
              <th colSpan="3">Total</th>
              <th>${total}</th>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCheckout(false)}>
          Cancel
          </Button>
        <Button variant="primary" onClick={handleCheckout}>
          Confirm
          </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CheckoutModal;