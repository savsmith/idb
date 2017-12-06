import React from 'react';
import BookNavbar from './BookNavbar';

const url ='http://localhost:5000';
require('../css/AuthorInstance.css');
var axios = require('axios');


/* ONE INSTANCE OF AN AUTHOR */


//initialize global variables
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

    var route = this.props.location.pathname;
    var authorId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));

    //retrieve all instances of books and seriesIds for an author
    axios.get(url+"/api/books")
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
          
        this.setState({
          booksArray: books,
          seriesIdArray: seriesIds,
        });
    }).catch(error => {
        console.log(error); return Promise.reject(error);
    }); 

    //retireve all series for an author
    axios.get(url+"/api/series")
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

        this.setState({
          seriesArray: series
        });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
    }); 


    //retireve the author
    axios.get(url+"/api/authors")
    .then(datas => {
      var route = this.props.location.pathname;
      var authorId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
      var length = Object.keys(datas.data).length;
      var author = -1;

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

  //render instance of an author
  render: function(){
    var authorObj = this.state.author;

    var series;
    if (this.state.seriesArray.length > 0 ) {
      //html for array of series if not null
      series = (this.state.seriesArray).map((series) => (
        <li key={series['id']}>
          <h2> <a href= {"/series/"+ series['id']}>{series['series_name'] }</a></h2>
        </li>
      ));
    } else {
      series = <li><h2>No series available.</h2></li>;
    }
          
    var books;
    if (this.state.booksArray.length > 0 ) {
      //html for array of books if not null
      books = (this.state.booksArray).map((book) => (
        <li key={book['id']}>
          <h2><img src={book["large_img"]} alt="Book Cover Art" width="100px"/><a href= {"/book/" + book['id']}>   { book['title'] }</a></h2>
        </li>
      ));
    } else {
       books = <li><h2>No books available.</h2></li>;
    }

    //layout of the author instance page
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
            <h2><b>Gender: </b>{authorObj['gender']}</h2>
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