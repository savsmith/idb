import React from 'react';
import BookNavbar from './BookNavbar';
require('../css/ReviewInstance.css');

var axios = require('axios');

var ReviewInstance = React.createClass({
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

  //   let data = require('../../realDB.json');
  //   let datas = data["review"];
  //    var route = this.props.location.pathname;
  //    var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
  //    var length = Object.keys(datas).length;
  //    var book = 0;
  //    for (var i = 0; i < length; i ++){
 
  //        console.log(datas[i]["id"]);
  //        console.log(bookId);
  //      if (datas[i]["id"] === bookId) {
 
  //        book = i;
  //      }
  //    }
  
  //    this.setState({
  //      review:datas[book],
  //      bookId:datas[book]['book_id']
  //    });

  //    datas = data["books"];
  //     route = this.props.location.pathname;
  //     bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
  //     length = Object.keys(datas).length;
  //     book = 0;
  //     for (var i = 0; i < length; i ++){
  
  //       if (datas[i]["id"] === bookId) {
  
  //         book = i;
  //       }
  //     }
   
  //     this.setState({
  //       book:datas[book]
  //     });

      axios.get("http://localhost:5000/api/reviews")
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
  // TO GET AUTHOR ID FROM ENDPOINT '/api/reviews/<int:review_id>/authors'
      axios.get('http://localhost:5000/api/reviews/' + this.state.reviewId + '/authors')
      .then(datas => {

          this.setState({
              authorId:datas.data[0]["author_id"]
          });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

  //TO GET AUTHOR OBJECT
      axios.get("http://localhost:5000/api/authors")
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

  //TO GET BOOK OBJECT
      axios.get("http://localhost:5000/api/books")
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
              book:datas.data[book]
          });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

    },


  render: function(){
      var reviewObj = this.state.review;
      var bookObj = this.state.book;
      var authorObj = this.state.author;
      var location = "../static/review_stars/"
      var imgType = "star.png"
      var review = Math.floor(reviewObj["rating"]);
      var result = location.concat(review,imgType);
      console.log(reviewObj);
      console.log(authorObj);
      console.log(bookObj);
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
          <h2 className = "review"><b>Review: </b>{reviewObj['review']}</h2>
        </div>
      </section>

      </div>
      );
  }
});
  
  export default ReviewInstance; 