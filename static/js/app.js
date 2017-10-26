import HomePage from './HomePage';
import About from './About';
import BookPage from './BookPage';
import BookInstance from './BookInstance';
import AuthorPage from './AuthorPage'
import AuthorInstance from './AuthorInstance';
import ReviewPage from './ReviewPage'
import ReviewInstance from './ReviewInstance';
import SeriesPage from './SeriesPage'
import SeriesInstance from './SeriesInstance'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

var App = React.createClass({

  render: function(){
      return(
        <Router>
        <Switch>
          <div>
            <Route exact path = "/" component = {HomePage}></Route>
            <Route path = "/about" component = {About} ></Route> 
            <Route exact path = "/books" component = {BookPage}></Route>
            <Route exact path = "/book/:book_id" component={BookInstance} ></Route>
            <Route exact path = "/author" component = {AuthorPage}></Route>
            <Route path = "/author/:author_id" component = {AuthorInstance}></Route>
            <Route exact path = "/reviews" component = {ReviewPage}></Route>
            <Route path = "/review/:review_id" component = {ReviewInstance}></Route>
            <Route exact path = "/series" component = {SeriesPage}></Route>
            <Route path = "/series/:series_id" component = {SeriesInstance}></Route>
          </div>
        </Switch>
        </Router>
      );
  }
});


ReactDOM.render(<App />, document.getElementById('reactEntry'));