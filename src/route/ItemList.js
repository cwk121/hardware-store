import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav } from 'react-bootstrap';
import ItemBlock from '../component/ItemBlock';

function ItemList({ category }) {
  const api = useSelector(state => state.api);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [brandFilter, setBrandFilter] = useState('all');
  const [order, setOrder] = useState('default');
  const [fromPrice, setFromPrice] = useState('');
  const [toPrice, setToPrice] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    dispatch({ type: "set_loading", payload: true });
    fetch(`${api}/items?category=${category}`, { method: "GET" })
      .then(response => response.status === 200 ? response.json() : [])
      .then(data => {
        setItems(data);
        setFiltered(data);
        const brands = [...new Set(data.map(item => item.brand))];
        setBrands(brands);

        // Reset filters
        setBrandFilter('all');
        setOrder('default');
        setFromPrice('');
        setToPrice('');
        setNameFilter('');

        dispatch({ type: "set_loading", payload: false });
      });
  }, [category]);

  useEffect(() => {
    setFiltered(filterItems());
  }, [fromPrice, toPrice, nameFilter, brandFilter, order]);

  function filterItems() {
    let filteredItems = [...items];
    let indexToRemove = [];

    filteredItems.forEach((item, index) => {
      let finalPrice = item.discounted_price ? item.discounted_price : item.price;
      item.final_price = finalPrice;

      if (nameFilter !== '' && !item.name.toLowerCase().includes(nameFilter)) {
        indexToRemove.push(index);
        return;
      }
      if (brandFilter !== 'all' && item.brand !== brandFilter) {
        indexToRemove.push(index);
        return;
      }
      if (fromPrice !== '' && finalPrice < fromPrice) {
        indexToRemove.push(index);
        return;
      }
      if (toPrice !== '' && finalPrice > toPrice) {
        indexToRemove.push(index);
        return;
      }
    });

    indexToRemove = indexToRemove.sort((a, b) => b - a);
    indexToRemove.forEach(index => {
      filteredItems.splice(index, 1);
    });

    if (order !== 'default') {
      if (order === 'asc') {
        filteredItems = filteredItems.sort((a, b) => a.final_price - b.final_price);
      } else if (order === 'desc') {
        filteredItems = filteredItems.sort((a, b) => b.final_price - a.final_price);
      }
    }

    return filteredItems;
  }

  return (
    <div className="container item-list">
      <h1>{category}</h1>
      <nav className="filter">
        <Nav variant="tabs" className="border-0" onSelect={selectedKey => setBrandFilter(selectedKey)}>
          <div className="filter-title">
            Brand:
          </div>
          <Nav.Item>
            <Nav.Link eventKey="all" className="border-0" active={brandFilter === 'all'} >All</Nav.Link>
          </Nav.Item>
          {brands.map(brand => (
            <Nav.Item key={brand}>
              <Nav.Link eventKey={brand} className="border-0" active={brandFilter === brand} >{brand}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <Nav variant="tabs" className="border-0" onSelect={selectedKey => setOrder(selectedKey)}>
          <div className="filter-title">
            Order:
          </div>
          <Nav.Item>
            <Nav.Link eventKey="default" className="border-0" active={order === 'default'} >Default</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="asc" className="border-0" active={order === 'asc'} >Price: Low to High</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="desc" className="border-0" active={order === 'desc'} >Price: High to Low</Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="d-flex">
          <div className="filter-title">
            Price:
          </div>
          <div className="filter-content d-flex">
            From
            <input type="number" className="filter-price mx-2" value={fromPrice} onChange={e => setFromPrice(e.target.value)} />
            to
            <input type="number" className="filter-price mx-2" value={toPrice} onChange={e => setToPrice(e.target.value)} />
          </div>
        </div>
        <div className="d-flex">
          <div className="filter-title">
            Filter:
          </div>
          <div className="filter-content d-flex">
            <input type="text" value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
          </div>
        </div>
      </nav>

      {filtered.map(item => (
        <ItemBlock key={item.id} item={item} />
      ))}
    </div>
  );
}

export default ItemList;
