import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Media, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CartItemBlock({ item }) {
  const api = useSelector(state => state.api);
  const dispatch = useDispatch();

  function updateQuantity(qty) {
    if (qty < 1) qty = 1;
    let newItem = { ...item };
    newItem.quantity = qty;
    dispatch({ type: "update_cart", payload: newItem });
  }
  function removeItem() {
    let newItem = { ...item };
    newItem.quantity = 0;
    dispatch({ type: "update_cart", payload: newItem });
  }

  return (
    <Media>
      <img
        width="80"
        height="80"
        className="mr-3"
        src={api + item.image[0].formats.thumbnail.url}
        alt={item.name}
      />
      <Media.Body>
        <h5>
          <Link to={`/item/${item.id}`} >{item.name}</Link>
        </h5>
        <p>
          {item.brand}
        </p>
      </Media.Body>
      <div className="ml-auto d-flex flex-wrap">
        <div className="mx-2">
          {item.discounted_price &&
            <span className="fs12">
              <strike>${item.price * item.quantity}</strike>
              <br />
              <strong style={{ "color": "red" }}>${item.discounted_price * item.quantity}</strong>
            </span>
          }
          {!item.discounted_price &&
            <span className="fs12">
              ${item.price * item.quantity}
            </span>
          }
        </div>

        <div className="mx-2">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <Button variant="outline-secondary"
                onClick={() => updateQuantity(item.quantity - 1)}
                disabled={item.quantity === 1}
              >
                -
              </Button>
            </InputGroup.Prepend>

            <FormControl
              style={{ "width": "3rem", "padding": "0", "textAlign": "center" }}
              value={item.quantity}
              onChange={e => updateQuantity(e.target.value)}
            />

            <InputGroup.Append>
              <Button variant="outline-secondary"
                onClick={() => updateQuantity(item.quantity + 1)}
                disabled={item.quantity === item.stock}
              >
                +
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>

        <div>
          <Button variant="outline-danger" onClick={removeItem}> Remove</Button>
        </div>
      </div>
    </Media>
  );
}

export default CartItemBlock;