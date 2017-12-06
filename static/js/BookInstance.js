import React from 'react';
import BookNavbar from './BookNavbar';
require('../css/BookInstance.css');

const url ='http://localhost:5000';
var axios = require('axios');


/* ONE INSTANCE OF A BOOK */


var BookInstance = React.createClass({
  //initialize global variables
  getInitialState:function(){
    return {
      book: "",
      series: "",
      seriesId: "",
      author: "",
      authorId: "",  
      reviewsArray: [],
    }
  },
  componentDidMount(){

    //retrieve a book
    axios.get(url+"/api/books")
      .then(datas => {
        var route = this.props.location.pathname;
        var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
        var length = Object.keys(datas.data).length;
        var book = 0;

        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === bookId) {
            book = i;
          }
        }

        this.setState({
            book:datas.data[book],
            seriesId:datas.data[book]['series_id'],
            authorId:datas.data[book]["author_id"]
        });
      }).catch(error => {
        console.log(error); return Promise.reject(error);
    });

    var route = this.props.location.pathname;
    var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));

    //retrieve any reviews for a book
    axios.get(url+"/api/reviews/book/" + bookId)
     .then(datas => {
        var reviews = [];
        var length = Object.keys(datas.data).length;

        for (var i = 0; i < length; i ++){
          reviews.push(datas.data[i]);
        }

        this.setState({
          reviewsArray: reviews,
        });
      }).catch(error => {
        console.log(error); return Promise.reject(error);
    });

    //retrieve series for a book
    axios.get(url+"/api/series")
      .then(datas => {
        var seriesId = this.state.seriesId;
        var length = Object.keys(datas.data).length;
        var seriesX = null;

        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === seriesId) {
            seriesX = datas.data[i];
            break;
          }
        }

        this.setState({
            series:seriesX
        });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
    });

    //retrieve author for a book
    axios.get(url+"/api/authors")
      .then(datas => {
        var authorId = this.state.authorId;
        var length = Object.keys(datas.data).length;
        var authorX = null;

        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === authorId) {
            authorX = datas.data[i];
            break;
          }
        }
        this.setState({
            author:authorX
        });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
    });


  },

  //renders page for a book
  render: function(){
    var bookObj = this.state.book;
    var seriesObj = this.state.series;
    var authorObj = this.state.author;
    
    var reviews;
    if (this.state.reviewsArray.length > 0) {
      //html for array of reviews if not null
      reviews = (this.state.reviewsArray).map((review) => (
        <li key={review['id']}>
          <h2><p><b><a href= {"/review/" + review['id']}> { review['user'] }'s review</a></b></p></h2>
          <h2><p className = "reviewDescription"> { review['review'] } </p></h2>
        </li>
      ));
    } else {
      reviews = <li><h2>No reviews.</h2></li>;
    }

    var author;
    if (authorObj != null ) {
      //html for author if available
      author = <a href= {"/author/"+ this.state.authorId }>{authorObj['author'] }</a>;
    } else {
      author = "No author available.";
    }

    var series;
    if (seriesObj != null) {
      //html for series if present
      series = <a href= {"/series/"+ this.state.seriesId }>{seriesObj['series_name'] }</a>;
    } else {
      series = "No series.";
    }
    console.log(bookObj);

    //layout of the book instance page
    return(
      <div>
        <BookNavbar/>
        <div className="title">
          <center><h1><b>{bookObj['title']}</b></h1></center>
          <hr />
        </div>
        <section className ="left">
          <div className="cover">
            <img src={bookObj["large_img"]} alt="Book Cover Art" width="200px"/> 
            <h2><b>Rating: </b> {bookObj["rating"]}</h2>
            <h2><b>Series: </b> { series } </h2>
            <h2><b>Author: </b> { author }</h2>
            <h2><b>Published: </b>{bookObj["published_month"]}/{bookObj["published_day"]}/{bookObj["published_year"]}</h2>
            <h2><p><b>Reviews: </b></p></h2>
            <ul>
              { reviews }
            </ul>
          </div>
        </section>
        <section className = "right">
          <div className="info">
            <h2  className="summary"><p><b>Summary: </b></p>{ bookObj["description"] }</h2>
          </div>
        </section>
      </div>
    );
  }
});

export default BookInstance;
