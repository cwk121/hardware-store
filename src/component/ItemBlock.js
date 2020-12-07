import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Media, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ItemBlock({ item }) {
  const [api, cart] = useSelector(state => [state.api, state.cart]);
  const dispatch = useDispatch();

  function handleAdd() {
    let newItem = { ...item };
    newItem.quantity = 1;
    // If item alreay in cart, add 1
    cart.forEach(cartItem => {
      if (cartItem.id === newItem.id) {
        newItem.quantity += Number(cartItem.quantity);
      }
    });
    dispatch({ type: "update_cart", payload: newItem });
    dispatch({ type: "set_cart_overlay", payload: true });
  }

  return (
    <Media className="mb-3 p-2 border rounded item-block">
      <img
        width="80"
        height="80"
        className="mr-3"
        src={api + item.image[0].formats.thumbnail.url}
        alt="item image"
      />
      <Media.Body>
        <h5>
          <Link to={`/item/${item.id}`} >{item.name}</Link>
        </h5>
        <p>
          {item.brand}
        </p>
      </Media.Body>
      <div className="ml-auto d-flex">
        <div className="mx-4 align-middle">
          {item.discounted_price &&
            <span className="fs12">
              <strike>${item.price}</strike>
              <br />
              <strong style={{ "color": "red" }}>${item.discounted_price}</strong>
            </span>
          }
          {!item.discounted_price &&
            <span className="fs12">
              ${item.price}
            </span>
          }
        </div>

        <div>
          {item.stock > 0 &&
            <Button variant="outline-primary" onClick={handleAdd}>Add to Cart</Button>
          }
          {item.stock <= 0 &&
            <Button variant="outline-secondary" disabled>Out of Stock</Button>
          }
        </div>
      </div>
    </Media>
  );
}

export default ItemBlock;