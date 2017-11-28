import React from 'react';
import BookNavbar from './BookNavbar';

require('../css/styles.css');


*/ AUTHOR GRID PAGE */


var AuthorsPage = React.createClass({
  render: function(){
  	//renders layout for grid page
    return(
      <div>
        <BookNavbar></BookNavbar>
        <h1>Authors Page w/ React!</h1>
      </div>
    );
  }
});

export default AuthorsPage;
