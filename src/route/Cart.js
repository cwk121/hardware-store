import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, Button, Modal, Alert } from 'react-bootstrap';
import CartItemBlock from '../component/CartItemBlock';
import CheckoutModal from '../component/CheckoutModal';

function Cart() {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    // Update total amount
    let total = 0;
    cart.forEach(item => {
      let price = item.discounted_price ? item.discounted_price : item.price;
      total += item.quantity * price;
    })
    setTotal(total);
  }, [cart]);

  function handleClear() {
    dispatch({ type: "clear_cart" });
    setShow(false);
  }

  return (
    <div className="container">
      <h1>Cart</h1>
      {message &&
        <Alert variant="success">
          {message}
        </Alert>
      }

      <ListGroup variant="flush">
        {cart.map(item => (
          <ListGroup.Item key={item.id}>
            <CartItemBlock item={item} />
          </ListGroup.Item>
        ))}
      </ListGroup>

      {cart.length !== 0 &&
        <div className="my-4 d-flex align-items-end flex-column">
          <div className="h4">
            Total: ${total}
          </div>
          <div>
            <Button variant="danger" onClick={() => setShow(true)}>
              <i className="fas fa-trash"></i> Clear Cart
          </Button>
            <Button variant="primary" className="ml-2" onClick={() => setShowCheckout(true)}>
              <i className="fas fa-credit-card"></i> Checkout
          </Button>
          </div>
        </div>
      }
      {cart.length === 0 && 
        <p>There is no item in your cart.</p>
      }

      {/* Clear cart confirm modal */}
      <Modal
        show={show}
        size="sm"
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClear}>
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkout modal */}
      <CheckoutModal showCheckout={showCheckout} setShowCheckout={setShowCheckout} setMessage={setMessage} />
    </div>
  );
}

export default Cart;