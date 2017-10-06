import React from 'react';
import { Carousel, Image, Row, Col } from 'react-bootstrap'

require('../css/styles.css');

var BookCarousel = React.createClass({

  render() {
    return (
      <div>
      <h1 id = "awin">Award Winners</h1>
        <div className = "cons">
          <Col md={12}>
            <Carousel>
               <Carousel.Item>
                <Row>
                  <Col xs={3} md={3}><Image src="../static/car_img/book1.png" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book2.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book3.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book4.jpg" responsive /></Col>
                </Row>
              </Carousel.Item>              
              <Carousel.Item>
                <Row>
                  <Col xs={3} md={3}><Image src="../static/car_img/book5.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book6.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book7.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book8.jpg" responsive /></Col>
                </Row>
              </Carousel.Item>             
              <Carousel.Item>
                <Row>
                  <Col xs={3} md={3}><Image src="../static/car_img/book9.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book2.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book3.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/car_img/book4.jpg" responsive /></Col>
                </Row>
              </Carousel.Item>
            </Carousel>
          </Col>
        </div>
      </div>
    )
  }
});

export default BookCarousel;