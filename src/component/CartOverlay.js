import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Media, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

function CartOverlay() {
  const [api, cart, cartOverlay] = useSelector(state => [state.api, state.cart, state.cartOverlay]);

  const dispatch = useDispatch();

  function removeItem(item) {
    let newItem = { ...item };
    newItem.quantity = 0;
    dispatch({ type: "update_cart", payload: newItem });
  }

  return (
    <div id="cart-overlay" hidden={!cartOverlay}>
      <ListGroup>
        {cart.map(item => (
          <ListGroup.Item key={item.id}>
            <Media>
              <img
                width={40}
                height={40}
                className="mr-3"
                src={api + item.image[0].formats.thumbnail.url}
                alt="thumbnail"
              />
              <Media.Body>
                <div className="cart-overlay-item">
                  <Link to={`/item/${item.id}`}>
                    {item.name}
                  </Link>
                </div>
                <div>
                  ${item.discounted_price ? item.discounted_price : item.price} x {item.quantity}
                </div>
              </Media.Body>
              <Button variant="outline-danger" onClick={() => removeItem(item)}><i className="fas fa-trash"></i></Button>
            </Media>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default CartOverlay;