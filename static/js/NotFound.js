import React from 'react';
require('../css/styles.css');

var NotFound= React.createClass({
  render: function(){
      return(
        <div className="notfoundwrapper">
          <h1 className="notfoundh1">Page Not Found:</h1>
          <p className="notfoundp">We're sorry! The page you were looking for is not here.</p>
        </div>
      );
  }
});
  
  export default NotFound; 