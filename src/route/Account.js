import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';

function Account() {
  const [api, user, jwt] = useSelector(state => [state.api, state.user, state.jwt]);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (jwt) {
      dispatch({ type: "set_loading", payload: true });
      fetch(`${api}/orders`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => response.status === 200 ? response.json() : [])
        .then(data => {
          setOrders(data);
          dispatch({ type: "set_loading", payload: false });
        })
    }
  }, [jwt])

  return (
    <div className="container">
      <h1>Order History</h1>
      {orders.map(order => (
        <div key={order.id} className="mb-4">
          <div className="row border border-dark rounded p-2">
            <div className="col-lg-1">#{order.id}</div>
            <div className="col-lg-2"><i className="fas fa-user"></i> {order.name}</div>
            <div className="col-lg-2"><i className="fas fa-phone-alt"></i> {order.phone}</div>
            <div className="col-lg-3"><i className="fas fa-map-marker-alt"></i> {order.address}</div>
            <div className="col-lg-2"><i className="fas fa-calendar-alt"></i> {order.created_at.split('T')[0]}</div>
            <div className="col-lg-2">Status: {order.status}</div>
            <Table bordered hover size="sm" className="mt-2">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.record.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.discounted_price ? <span><strike>{item.price}</strike> ${item.discounted_price}</span> : item.price}</td>
                    <td>{item.quantity}</td>
                    <td>${item.discounted_price ? item.discounted_price * item.quantity : item.price * item.quantity}</td>
                  </tr>
                ))}
                <tr>
                  <th colSpan="3">Total</th>
                  <th>${order.record.total}</th>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Account;
