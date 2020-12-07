import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function Loading() {
  const show = useSelector(state => state.loading)

  return (
    <div hidden={!show} id="loading">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loading;