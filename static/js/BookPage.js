import React from 'react';
import BookNavbar from './BookNavbar';
import Grid from './Grid'
import Pagination from 'react-js-pagination';
require('../css/styles.css');


/* BOOK GRID PAGE */


var BookPage = React.createClass({
  render: function(){
  	//renders the layout for the book grid page
	return(
	  <div className="bookPageWrapper">
	    <BookNavbar/>
	    <Grid model="books" itemPerPage={12} name="title" instance="book"></Grid>
	  </div>
	);
  }
});
  
export default BookPage;
