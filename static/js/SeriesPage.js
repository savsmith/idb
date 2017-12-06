import React from 'react';
import BookNavbar from './BookNavbar';
import Grid from './Grid'
import Pagination from 'react-js-pagination';
require('../css/styles.css');


/* SERIES GRID PAGE */


var SeriesPage = React.createClass({
  //renders the layout for the series grid page	
  render: function(){
    return(
      <div className="bookPageWrapper">
        <BookNavbar/>
        <Grid model="series_i" itemPerPage={12} name="series_name" instance="series"></Grid>
      </div>
    );
  }
});
  
export default SeriesPage; 