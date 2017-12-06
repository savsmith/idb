import React from 'react';
import BookNavbar from './BookNavbar';

require('../css/SeriesInstance.css');
var axios = require('axios');
const url ='http://localhost:5000';


/* ONE INSTANCE OF A SERIES */


var SeriesInstance = React.createClass({
  //initialize global variables
  getInitialState:function(){
    return {
      series: "",
      seriesId: "",
      authorId: "",
      author: "",
      seriesString: "",
      booksArray: [],
    }
  },

  componentDidMount(){

    var route = this.props.location.pathname;
    var seriesId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));

    //retrieve authorId and books for a series
    axios.get(url+"/api/series/" + seriesId + "/books")
      .then(datas => {
        var books = [];
        var length = Object.keys(datas.data).length;

        for (var i = 0; i < length; i ++){
          books.push(datas.data[i]);
        }

        this.setState({
          authorId:datas.data[0]['author_id'],
          booksArray:books,
        });
      }).catch(error => {
        console.log(error); return Promise.reject(error);
    }); 

    //retrieve series
    axios.get(url+"/api/series")
      .then(datas => {
        var route = this.props.location.pathname;
        var seriesId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
        var seriesString1 = route.substring(route.lastIndexOf("/") + 1, route.length);
        var length = Object.keys(datas.data).length;
        var series = 0;
      
        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === seriesId) {
            series = i;
          }
        }  

        this.setState({
          series:datas.data[series],
          seriesId:datas.data[series]['id'],
          seriesString: seriesString1,
        });
      }).catch(error => {
        console.log(error); return Promise.reject(error);
    }); 
    
    //retieve author for series
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

  //render page for a series
  render: function(){
    var seriesObj = this.state.series;
    var authorObj = this.state.author;

    //html for books in a series
    const books = (this.state.booksArray).map((book) => (
      <li key={book['id']}>
        <h2><img src={book["large_img"]} alt="Book Cover Art" width="100px"/><a href= {"/book/" + book['id']}>   { book['title'] }</a></h2>
      </li>
    ));
    
    //numbered attribute for a series
    var ordered = "";
    if (seriesObj["numbered"] == 1) {
      ordered = "Should be read in order";
    }
    else {
      ordered = "Can be read out of order";
    }

    console.log(seriesObj)
    //layout of the series instance
    return(
      <div>
        <BookNavbar></BookNavbar>
        <div className="title" >
          <center><h1><b>{seriesObj['series_name']}</b></h1></center>
           { /*<h2 style = "float: right; padding-right: 15%;"><b>Published: </b>{{ start }} - {{ end }}</h2>*/ }
        </div>
        <section className = "right">
          <div className="info">
            <h2  className="summary"><p><b>Description: </b></p>{ seriesObj["description"] }</h2>
            <h3> Count: {seriesObj['primary_count']}</h3>
            <h3> { ordered }</h3>
            <h2><b>Author: </b><a href= {"/author/"+ this.state.authorId }>{authorObj['author'] }</a></h2>
          </div>
        </section>
        <ul>
          { books }
        </ul>
      </div>
    );
  }
});
  
export default SeriesInstance; 