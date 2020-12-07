import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';

function Item() {
  const [api, cart] = useSelector(state => [state.api, state.cart]);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${api}/items/${id}`)
      .then(response => response.json())
      .then(data => {
        setItem(data);
        let images = [];
        data.image.forEach(image => {
          let imageItem = {};
          imageItem.original = api + image.url;
          imageItem.thumbnail = api + image.formats.thumbnail.url;
          images.push(imageItem);
        })
        setImages(images);
      });
  }, [id]);

  function updateQuantity(e) {
    let qty = e.target.value;
    if (qty < 1) qty = 1;
    if (qty > item.stock) qty = item.stock;
    setQuantity(qty);
  }

  function handleAdd() {
    let newItem = { ...item };
    newItem.quantity = Number(quantity);
    // If item alreay in cart, add quantity
    cart.forEach(cartItem => {
      if (cartItem.id === newItem.id) {
        newItem.quantity += Number(cartItem.quantity);
      }
    });
    dispatch({ type: "update_cart", payload: newItem });
    dispatch({ type: "set_cart_overlay", payload: true });
  }

  return (
    <div className="container">
      <Container>
        <Row>
          <Col md={5}>
            <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} />
          </Col>
          <Col md={7}>
            <h1>{item.name}</h1>
            <div className="fs12">
              <div>
                <div className="item-key">Category:</div>
                <Link to={item.category ? "/" + item.category.toLowerCase() : "/"}>{item.category}</Link>
              </div>
              <div>
                <div className="item-key">Brand:</div>
                {item.brand}
              </div>
              <div>
                <div className="item-key">Stock:</div>
                {item.stock}
              </div>
              {item.discounted_price &&
                <div>
                  <div className="item-key">Price:</div>
                  <strike>${item.price}</strike> <strong style={{ "color": "red" }}>${item.discounted_price}</strong>
                </div>
              }
              {!item.discounted_price &&
                <div>
                  <div className="item-key">Price:</div>
                  <strong>${item.price}</strong>
                </div>
              }
            </div>
            <div className="mt-4 d-flex">
              {item.stock > 0 &&
                <React.Fragment>
                  <input type="number" name="quantity" min="1"
                    className="item-quantity-input"
                    value={quantity}
                    onChange={updateQuantity}
                  />
                  <Button variant="outline-primary" onClick={handleAdd}>Add to Cart</Button>
                </React.Fragment>
              }
              {item.stock <= 0 &&
                <Button variant="outline-secondary" disabled>Out of Stock</Button>
              }
            </div>
          </Col>
        </Row>
        <hr />
        <div>
          <h2>Description</h2>
          <p className="item-description">{item.description}</p>
        </div>
      </Container>

    </div>
  );
}

export default Item;