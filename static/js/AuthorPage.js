import React from 'react';
import BookNavbar from './BookNavbar';
import Grid from './Grid'
import Pagination from 'react-js-pagination';
require('../css/styles.css');

var BookPage = React.createClass({
  render: function(){
      return(
        <div className="bookPageWrapper">
          <BookNavbar/>
          <Grid model="author" itemPerPage={8} name="author" instance="author"></Grid>
        </div>
      );
  }
});
  
  export default BookPage; 