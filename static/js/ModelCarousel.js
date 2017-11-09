import React from 'react';
import { Carousel } from 'react-responsive-carousel'
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

require('../css/styles.css');

var BookCarousel = React.createClass({

  render() {
    return (
          <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true}>
            <div>
              <img width="100%" src="../static/car_img/carousel1.png" />
            </div>
            <div>
              <img width="100%" src="../static/car_img/carousel2.png" />
            </div>
            <div>
              <img width="100%" src="../static/car_img/carousel3.png" />
            </div>
            <div>
              <img width="100%" src="../static/car_img/carousel4.png" />
            </div>
          </Carousel>
    )
  }
});

export default BookCarousel;
