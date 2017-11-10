import React from 'react';
import BookNavbar from './BookNavbar';
require('../css/BookInstance.css');

const url = 'http://localhost:5000'
var axios = require('axios');

var BookInstance = React.createClass({
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

      //getting reviews for a book /api/reviews/book/<int:book_id>
      var route = this.props.location.pathname;
      var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));

      axios.get(url+"/api/reviews/book/" + bookId)
           

          .then(datas => {
              var reviews = [];
             var length = Object.keys(datas.data).length;

            //get list of books for a series
             for (var i = 0; i < length; i ++){
                reviews.push(datas.data[i]);
              }

                this.setState({
                    reviewsArray: reviews,
              });
          }).catch(error => {
              console.log(error); return Promise.reject(error);
          }); 


      //getting a book
      axios.get(url+"/api/books")
      .then(datas => {
        var route = this.props.location.pathname;

        var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
        console.log(bookId);
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

      //getting a series for a book 
      axios.get(url+"/api/series")
      .then(datas => {
        var seriesId = this.state.seriesId;
        var length = Object.keys(datas.data).length;
        var series = 0;
        
        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === seriesId) {
            series = i;
          }
        }
          this.setState({
              series:datas.data[series]
          });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

      //getting author for a book
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

      //getting review ids for a book?
      
    },


  render: function(){
      var bookObj = this.state.book;
      var seriesObj = this.state.series;
      var authorObj = this.state.author;

      const reviews = (this.state.reviewsArray).map((review) => (
            <li key={review['id']}>
              <h2><a href= {"/review/" + review['id']}> { review['user'] }'s review</a></h2>
            </li>
          ));

      console.log(bookObj);
      console.log(seriesObj);
      return(
        <div>
          <BookNavbar/>
          <div className="title">
          <center><h1><b>{bookObj['title']}</b></h1></center>
          <hr />
          </div>

    <section className ="left">
      <div className="cover">
          <img src={bookObj["large_img"]} alt="Book Cover Art" width="300px"/> 
          <h2><b>Rating: </b> {bookObj["rating"]}</h2>
          <h2><b>Series: </b><a href= {"/series/"+ this.state.seriesId }>{seriesObj['series_name'] }</a></h2>
          <h2><b>Author: </b><a href= {"/author/"+ this.state.authorId }>{authorObj['author'] }</a></h2>
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