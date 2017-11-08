import React from 'react';
import { Carousel, Image, Row, Col } from 'react-bootstrap'

require('../css/styles.css');

var BookCarousel = React.createClass({

  render() {
    return (
      <div>
        <div className = "cons">
          <Col md={12}>
            <Carousel>
               <Carousel.Item>
              </Carousel.Item>
              <Carousel.Item>
              </Carousel.Item>
              <Carousel.Item>
              </Carousel.Item>
            </Carousel>
          </Col>
        </div>
      </div>
    )
  }
});

export default BookCarousel;
