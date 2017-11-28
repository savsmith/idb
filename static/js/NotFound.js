import React from 'react';
require('../css/styles.css');

var NotFound= React.createClass({
  render: function(){
      return(
        <div>
          <h1>Page Not Found</h1>
          <p>Sorry, but the page you were trying to view does not exist.</p>
        </div>
      );
  }
});
  
  export default NotFound; 