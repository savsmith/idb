import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

require("../css/styles.css");


/* BOOK CAROUSEL FOR HOME PAGE */


var BookCarousel = React.createClass({
  render: function () {
    //render book carousel with settings
    var settings = {
      className: 'center',
      centerMode: true,
      infinite: true,
      autoplaySpeed: 350,
      slidesToShow: 5,
      autoPlay: true,
      focusOnSelect: true
    };

    //insert images into the carousel
    return (
      <Slider {...settings} className="bookCarousel">
        <div><div><img width="100%" height="100%" src="../static/car_img/book1.png"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book2.jpg"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book3.jpg"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book4.jpg"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book5.jpg"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book6.jpg"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book7.jpg"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book8.jpg"/></div></div>
        <div><div><img width="100%" height="100%" src="../static/car_img/book9.jpg"/></div></div>
      </Slider>
    );
  }
});

export default BookCarousel;
