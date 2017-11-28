import React from 'react';
import ModelCarousel from './ModelCarousel';
import BookCarousel from './BookCarousel';
import BookNavbar from './BookNavbar';

require('../css/styles.css');


/* HOME PAGE */


var HomePage = React.createClass({
  //render layout for home page
  render: function(){
    return(
      <div>
        <BookNavbar/>
        <br/>
        <ModelCarousel/>
        <div className="homePageQuote">
          <center>
            <br/>
            <h1>
              If you only read the books that everyone else is reading,
              <br/>
              you can only think what everyone else is thinking.
            </h1>
            <p>
              - Haruki Murakami
            </p>
            <br/>
            <br/>
          </center>
        </div>
        <BookCarousel/>
      </div>
    );
  }
});

export default HomePage;
