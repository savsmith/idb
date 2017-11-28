import React from 'react';
import BookNavbar from './BookNavbar';
import Grid from './Grid'
import Pagination from 'react-js-pagination';
require('../css/styles.css');


/* REVIEW GRID PAGE */


var ReviewPage = React.createClass({
  //renders the layout for the review grid page
  render: function(){
    return(
      <div className="bookPageWrapper">
        <BookNavbar/>
        <Grid model="review" itemPerPage={12} name="user" instance="review"></Grid>
      </div>
    );
  }
});
  
export default ReviewPage; 