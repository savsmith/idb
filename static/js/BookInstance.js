import React from 'react';
import BookNavbar from './BookNavbar';
require('../css/BookInstance.css');

var axios = require('axios');

var BookInstance = React.createClass({
  getInitialState:function(){
    return {
      book: ""
    }
  },

  componentDidMount(){
    let data = require('../../realDB.json');
    let datas = data["books"];
    var route = this.props.location.pathname;
    var bookId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
    var length = Object.keys(datas).length;
    var book = 0;
    for (var i = 0; i < length; i ++){

        console.log(datas[i]["id"]);
        console.log(bookId);
      if (datas[i]["id"] === bookId) {

        book = i;
      }
    }

    this.setState({
      book:datas[book]
    });
  },

  render: function(){
      var bookObj = this.state.book;
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