import React from 'react';
import BookNavbar from './BookNavbar';
require('../css/styles.css');

var axios = require('axios');

var BookInstance = React.createClass({
  render: function(){
      return(
        <div>
          <BookNavbar/>
          <h1>hello</h1>
          <h1>hello</h1>
          <h1>hello</h1>
          <h1>hello</h1>
        </div>
      );
  }
});
  
  export default BookInstance; 