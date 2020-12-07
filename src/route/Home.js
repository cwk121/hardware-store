import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

// import Swiper core and required components
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

// install Swiper components
SwiperCore.use([Navigation, Pagination, A11y]);

function Home() {
  const api = useSelector(state => state.api);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${api}/items?_sort=updated_at:desc&_limit=8`, { method: "GET" })
      .then(response => response.status === 200 ? response.json() : [])
      .then(data => {
        setItems(data);
      });
  }, []);

  return (
    <div className="container">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        <SwiperSlide>
          <img className="w-100" src={`${api}/uploads/0ba3d60362c7e6d256cfc1f37156bad9_9d56e391c4.jpg`} alt="banner" />
          <div id="banner-text">
            Hardware Store
          </div>
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
      <div className="my-4">
        <h2>Newest Products</h2>
        <Row>
          {items.map(item => (
            <Col lg="3" md="4" xs="6" key={item.id} className="mb-4">
              <Link to={`/item/${item.id}`} className="text-decoration-none">
                <Card>
                  <Card.Img height={160} variant="top" src={api + item.image[0].formats.thumbnail.url} />
                  <Card.Body>
                    <Card.Text className="item-card-title">{item.name}</Card.Text>
                    <Card.Text className="text-muted">{item.brand}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;