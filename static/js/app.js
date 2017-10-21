import HomePage from './HomePage';
import BookPage from './BookPage';
import About from './About';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

var App = React.createClass({
  render: function(){
      return(
        <Router>
          <div>
            <Route exact path = "/" component = {HomePage}></Route>
            <Route path = "/about" component = {About} ></Route> 
            <Route path = "/books" component = {BookPage}></Route>
          </div>

        </Router>
      );
  }
});


ReactDOM.render(<App />, document.getElementById('reactEntry'));