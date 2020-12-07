import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import ItemBlock from '../component/ItemBlock';

function Search() {
  const [api, loading] = useSelector(state => [state.api, state.loading]);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    const queryPrarms = query.split(' ');
    let queryString = '';
    queryPrarms.forEach(q => {
      queryString += `name_contains=${q}&`
    })
    setItems([]);
    dispatch({ type: "set_loading", payload: true });
    fetch(`${api}/items?${queryString}`, { method: "GET" })
      .then(response => response.json())
      .then(data => {
        setItems(data);
        dispatch({ type: "set_loading", payload: false });
      });
  }, [query]);

  return (
    <div className="container">
      <h1>Search Result: {query}</h1>

      {!loading && items.length === 0 && <div>No results found</div>}
      
      {items.map(item => (
        <ItemBlock key={item.id} item={item} />
      ))}
    </div>
  );
}

export default Search;
