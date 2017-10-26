import React from 'react';
import BookNavbar from './BookNavbar';

require('../css/styles.css');

var AuthorsPage = React.createClass({
  render: function(){
    return(
      <div>
        <BookNavbar></BookNavbar>
        <h1>Authors Page w/ React!</h1>
      </div>
    );
  }
});

export default AuthorsPage;
