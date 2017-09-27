import BookCarousel from './BookCarousel';
import BookNavbar from './BookNavbar';
import React from 'react';
import ReactDOM from 'react-dom';

var App = React.createClass({
  render: function(){
      return(
        <div>
        <BookNavbar/>
        <BookCarousel/>
        </div>
      );
  }
});


ReactDOM.render(<App />, document.getElementById('reactEntry'));