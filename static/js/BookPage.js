import React from 'react';
import BookNavbar from './BookNavbar';
import Grid from './Grid'
import Pagination from 'react-js-pagination';
require('../css/styles.css');

var axios = require('axios');

var BookPage = React.createClass({
  render: function(){
      return(
        <div className="bookPageWrapper">
          <BookNavbar/>
          <Grid model="book" itemPerPage={4} title="title"></Grid>
        </div>
      );
  }
});
  
  export default BookPage; 