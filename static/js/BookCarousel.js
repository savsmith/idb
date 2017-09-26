import React from 'react';
import { Carousel } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import { Col } from 'react-bootstrap'

require('../css/styles.css');

var BookCarousel = React.createClass({

  render() {
    return (
      <div>
      <h1 id = "awin">Award Winners</h1>
        <div className = "cons">
          <Col md={12}>
            <Carousel indicators = "false">
               <Carousel.Item>
                <Row>
                  <Col xs={3} md={3}><Image src="../static/img/book1.png" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book2.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book3.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book4.jpg" responsive /></Col>
                </Row>
              </Carousel.Item>              
              <Carousel.Item>
                <Row>
                  <Col xs={3} md={3}><Image src="../static/img/book1.png" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book2.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book3.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book4.jpg" responsive /></Col>
                </Row>
              </Carousel.Item>             
              <Carousel.Item>
                <Row>
                  <Col xs={3} md={3}><Image src="../static/img/book1.png" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book2.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book3.jpg" responsive /></Col>
                  <Col xs={3} md={3}><Image src="../static/img/book4.jpg" responsive /></Col>
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