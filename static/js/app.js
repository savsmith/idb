import HomePage from './HomePage';
import About from './About';
import BookPage from './BookPage';
import BookInstance from './BookInstance';
import AuthorPage from './AuthorPage'
import AuthorInstance from './AuthorInstance';
import ReviewPage from './ReviewPage'
import SeriesPage from './SeriesPage'
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
            <Route exact path = "/books" component = {BookPage}></Route>
            <Route path = "/book/:book_id" component={BookInstance} ></Route>
            <Route exact path = "/author" component = {AuthorPage}></Route>
            <Route path = "/author/:author_id" component = {AuthorInstance}></Route>
            <Route exact path = "/reviews" component = {ReviewPage}></Route>
            <Route exact path = "/series" component = {SeriesPage}></Route>
          </div>

        </Router>
      );
  }
});


ReactDOM.render(<App />, document.getElementById('reactEntry'));