import HomePage from './HomePage';
import About from './About';
import SearchForm from './SearchForm';
import BookPage from './BookPage';
import BookInstance from './BookInstance';
import AuthorPage from './AuthorPage'
import AuthorInstance from './AuthorInstance';
import ReviewPage from './ReviewPage'
import ReviewInstance from './ReviewInstance';
import SeriesPage from './SeriesPage'
import SeriesInstance from './SeriesInstance'
import NotFound from './NotFound'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


/* ROUTER FOR PAGES */


var App = React.createClass({

  render: function(){
      return(
        <MuiThemeProvider>
        <Router>
        <Switch>
            <Route exact path = "/" component = {HomePage}></Route>
            <Route exact path = "/about" component = {About} ></Route>
            <Route exact path = "/search" component = {SearchForm} ></Route>
            <Route exact path = "/books" component = {BookPage}></Route>
            <Route exact path = "/book/:book_id" component={BookInstance} ></Route>
            <Route exact path = "/author" component = {AuthorPage}></Route>
            <Route exact path = "/author/:author_id" component = {AuthorInstance}></Route>
            <Route exact path = "/reviews" component = {ReviewPage}></Route>
            <Route exact path = "/review/:review_id" component = {ReviewInstance}></Route>
            <Route exact path = "/series" component = {SeriesPage}></Route>
            <Route exact path = "/series/:series_id" component = {SeriesInstance}></Route>
            <Route component={NotFound} status={404}/>
        </Switch>
        </Router>
        </MuiThemeProvider>
      );
  }
});


ReactDOM.render(<App />, document.getElementById('reactEntry'));
