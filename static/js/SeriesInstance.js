import React from 'react';
import BookNavbar from './BookNavbar';

require('../css/SeriesInstance.css');
var axios = require('axios');

var SeriesInstance = React.createClass({
  getInitialState:function(){
    return {
      series: "",
      seriesId: "",
      authorId: "",
      author: "",
      seriesString: "",
      bookList: [],
    }
  },

  componentDidMount(){

    // let data = require('../../realDB.json');
    //    let datas = data["series_i"];
    //     var route = this.props.location.pathname;
    //     var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
    //     var length = Object.keys(datas).length;
    //     var book = 0;
    //     for (var i = 0; i < length; i ++){
    
    //         console.log(datas[i]["id"]);
    //         console.log(bookId);
    //       if (datas[i]["id"] === bookId) {
    
    //         book = i;
    //       }
    //     }
     
    //     this.setState({
    //       series:datas[book]
    //     });
    var route = this.props.location.pathname;
    var seriesId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));

    //get author from series for author list
    axios.get("http://localhost:5000/api/series/" + seriesId + "/books")
           

          .then(datas => {
              var books = [];
           var length = Object.keys(datas.data).length;

          //get list of books for a series
           for (var i = 0; i < length; i ++){
              books.push(datas.data[i]);
            }

              this.setState({
                  authorId:datas.data[0]['author_id'],
                  bookList:books,
              });
          }).catch(error => {
              console.log(error); return Promise.reject(error);
          }); 


    axios.get("http://localhost:5000/api/series")
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
    

      // get author for series
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

    },

  render: function(){
    var seriesObj = this.state.series;
    var authorObj = this.state.author;
    const books = (this.state.bookList).map((book) => (
            <li key={book['id']}>
              <h2><img src={book["large_img"]} alt="Book Cover Art" width="100px"/><a href= {"/book/" + this.state.authorId }>   { book['title'] }</a></h2>
            </li>
          ));
    console.log(this.state.bookList);
    console.log(typeof this.state.bookList);
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
        <h3> Count: {seriesObj['count']}</h3>
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