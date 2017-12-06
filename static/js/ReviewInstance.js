import React from 'react';
import BookNavbar from './BookNavbar';
require('../css/ReviewInstance.css');

const url ='http://localhost:5000';
var axios = require('axios');


/* ONE INSTANCE OF A REVIEW */


var ReviewInstance = React.createClass({
  //initialize global variables
  getInitialState:function(){
    return {
      review: "",
      reviewId: "",
      book: "",
      bookId: "",
      author: "",
      authorId: ""
    }
  },

  componentDidMount(){
 
    //retrieve review
    axios.get(url+"/api/reviews")
      .then(datas => {
        var route = this.props.location.pathname;
        var reviewId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
        var length = Object.keys(datas.data).length;
        let review = 0;
        
        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === reviewId) {
            review = i;
          }
        }
        this.setState({
          review:datas.data[review],
          bookId:datas.data[review]['book_id'],
          reviewId:datas.data[review]['id']
        });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
    }); 

    //retrieve book for a review
    axios.get(url+"/api/books")
      .then(datas => {
        var bookId = this.state.bookId;
        var length = Object.keys(datas.data).length;
        var book = 0;
        
        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === bookId) {
            book = i;
          }
        }
        this.setState({
          book:datas.data[book],
          authorId:datas.data[book]['author_id']
        });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
    }); 

    //retrieve author for a review
    axios.get(url+"/api/authors")
      .then(datas => {
        var authorId = this.state.authorId;
        var length = Object.keys(datas.data).length;
        var author = 0;
        
        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === authorId) {
            author = i;
          }
        }
        this.setState({
          author:datas.data[author]
        });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
    }); 
  },

  //render page for a review
  render: function(){
    var reviewObj = this.state.review;
    var bookObj = this.state.book;
    var authorObj = this.state.author;
    var location = "../static/review_stars/"
    var imgType = "star.png"
    var review = Math.floor(reviewObj["rating"]);
    var result = location.concat(review,imgType);

    var description;
    if (reviewObj['review'] != null) {
      //description for a review if available
      description = reviewObj['review'];
    } else {
      description = "No written review.";
    }

    console.log(reviewObj);
    //layout of the review instance
    return(
      <div>
        <BookNavbar/>
        <div className="user">
          <center><h1><b>Review by {reviewObj['user']}</b></h1></center>
          <hr/>
        </div>
        <section className ="left">
          <div className="cover">
            <img src={bookObj['large_img']} alt="Book Cover Art" width="310" />
            <h2><b>Book: </b><a href= {"/book/"+ this.state.bookId }>{bookObj['title'] }</a></h2>
            <h2>Date added: {reviewObj['date_added']}</h2>
            <h2><b>Author: </b><a href= {"/author/"+ this.state.authorId }>{authorObj['author'] }</a></h2>
          </div>
        </section>
        <section className ="right">
          <div className="info">
            <h2><b>Rating: </b>{reviewObj['rating']}  <img id="stars" src={result} alt="rating" height="28"/></h2>
            <h2 className = "review"><b>Review: </b>{ description }</h2>
          </div>
        </section>
      </div>
    );
  }
});
  
export default ReviewInstance; 