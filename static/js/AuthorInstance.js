import React from 'react';
import BookNavbar from './BookNavbar';

require('../css/AuthorInstance.css');
var axios = require('axios');

var AuthorInstance = React.createClass({
  getInitialState:function(){
    return {
      author: "",    
      seriesIdArray: [],
      booksArray: [],
      seriesArray: [],
    }
  },

  componentDidMount(){
    // let data = require('../../realDB.json');
    // let datas = data["author"];
    //  var route = this.props.location.pathname;
    //  var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
    //  var length = Object.keys(datas).length;
    //  var book = 0;
    //  for (var i = 0; i < length; i ++){
 
    //      console.log(datas[i]["id"]);
    //      console.log(bookId);
    //    if (datas[i]["id"] === bookId) {
 
    //      book = i;
    //    }
    //  }
  
    //  this.setState({
    //    author:datas[book]
    //  });

      //get all series fora n author'/api/authors/<int:author_id>/series'
      var route = this.props.location.pathname;
      var authorId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));

      // axios.get("http://localhost:5000/api/authors/" + authorId + "/series")
           

      //     .then(datas => {
      //      var series = [];
      //      var length = Object.keys(datas.data).length;

      //     //get list of books for a series
      //      for (var i = 0; i < length; i ++){
      //         series.push(datas.data[i]);
      //       }

      //         this.setState({
      //             seriesArray:series
      //         });
      //     }).catch(error => {
      //         console.log(error); return Promise.reject(error);
      //     }); 

      //get all books and seriesIds for an author
      axios.get("http://localhost:5000/api/books")
        .then(datas => {
          var route = this.props.location.pathname;
          var authorId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
          var length = Object.keys(datas.data).length;
          var books = [];
          var seriesIds = [];
          
          for (var i = 0; i < length; i ++){
            if (datas.data[i]["author_id"] === authorId) {
              books.push(datas.data[i]);        
              seriesIds.push(datas.data[i]['series_id']); 
            }
          }
          console.log(seriesIds);
            this.setState({
              booksArray: books,
              seriesIdArray: seriesIds,
            });
        }).catch(error => {
            console.log(error); return Promise.reject(error);
      }); 

      //get all series for an author
      axios.get("http://localhost:5000/api/series")
        .then(datas => {
          var route = this.props.location.pathname;
          var authorId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
          var length = Object.keys(datas.data).length;
          var series = [];
          var seriesIds = this.state.seriesIdArray;
          
          for (var i = 0; i < length; i ++){
            if (seriesIds.includes(datas.data[i]["id"]) ) {
              series.push(datas.data[i]);        
            }
          }

          console.log(series);
            this.setState({
              seriesArray: series
            });
        }).catch(error => {
            console.log(error); return Promise.reject(error);
      }); 


      //get author
      axios.get("http://localhost:5000/api/authors")
      .then(datas => {
        var route = this.props.location.pathname;
        var authorId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
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

  render: function(){
    var authorObj = this.state.author;
    //list of series
    const series = (this.state.seriesArray).map((series) => (
            <li key={series['id']}>
              <h2> <a href= {"/series/"+ series['id']}>{series['series_name'] }</a></h2>
            </li>
          ));
          
    //list of books
    const books = (this.state.booksArray).map((book) => (
            <li key={book['id']}>
              <h2><img src={book["large_img"]} alt="Book Cover Art" width="100px"/><a href= {"/book/" + book['id']}>   { book['title'] }</a></h2>
            </li>
          ));


    console.log(authorObj);
      return(
        <div>
        <BookNavbar></BookNavbar>
        <section className = "upper">
          <img className = "author_img" src={authorObj['large_img']} alt="Author Image" width="300" />
          <center><h1><b>{authorObj['author']}</b></h1></center>
        </section>
        <hr/>
        
      <section className="left">
      <div className="left-div">
        <h2><b>Hometown: </b>{authorObj['hometown']}</h2>
        <div className = "desc">
          <h2><p><b>Description: </b></p>{authorObj['description']}</h2>
        </div>
			</div>
      </section>
      <h2><p><b>Series: </b></p></h2>
      <ul>
          { series }
      </ul>
      <h2><p><b>Books: </b></p></h2>
      <ul>
          { books }
      </ul>
      </div>
      );
  }
});
  
  export default AuthorInstance; 