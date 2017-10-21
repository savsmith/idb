import React from 'react';
import BookNavbar from './BookNavbar';
import Grid from './Grid'
import Pagination from 'react-js-pagination';


var axios = require('axios');

var BookPage = React.createClass({
  render: function(){
      return(
        <div>
          <BookNavbar/>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tortor diam, 
          vestibulum eget eleifend id, vehicula et quam. Donec cursus metus pharetra mi ullamcorper, 
          nec ultrices sapien sodales. Sed venenatis nibh in dolor tempor, at semper nulla ultricies. 
          In nec molestie nisl. Duis congue elit non orci ultrices sodales. Phasellus lorem tortor, 
          aliquam vitae mattis mollis, gravida eget sapien. Fusce porttitor aliquam enim, quis lacinia 
          arcu tempor a. Vestibulum vel nisi nisl. Nullam nisl ipsum, venenatis ac mi non, semper luctus enim. 
          Nam orci leo, tincidunt eu purus in, ullamcorper dapibus elit. Praesent ipsum sapien, euismod iaculis tellus nec, 
          pharetra lobortis felis. Vestibulum pretium maximus felis pellentesque suscipit. Vestibulum sapien mauris, 
          scelerisque eget aliquet sed, aliquet a metus. Donec vel imperdiet libero, eu tincidunt augue.</p>

          <Grid model="book" itemPerPage={2} title="title"></Grid>
        </div>
      );
  }
});
  
  export default BookPage; 