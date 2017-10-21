import React from 'react';
import BookCarousel from './BookCarousel';
import BookNavbar from './BookNavbar';

var HomePage = React.createClass({


  render: function(){
      return(
        <div>
          <BookNavbar/>
          <BookCarousel/>
        </div>
      );
  }
});
  
  export default HomePage; 