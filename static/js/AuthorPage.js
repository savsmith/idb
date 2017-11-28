import React from 'react';
import BookNavbar from './BookNavbar';
import Grid from './Grid'
import Pagination from 'react-js-pagination';
require('../css/styles.css');


/* AUTHOR GRID PAGE */


var AuthorPage = React.createClass({
  render: function(){
  	  //renders the layout for the grid page
      return(
        <div className="bookPageWrapper">
          <BookNavbar/>
          <Grid model="author" itemPerPage={12} name="author" instance="author"></Grid>
        </div>
      );
  }
});
  
export default AuthorPage; 