import React from 'react';
import BookNavbar from './BookNavbar';

require('../css/AuthorInstance.css');
var axios = require('axios');

var AuthorInstance = React.createClass({
  getInitialState:function(){
    return {
      author: ""
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
      </div>
      );
  }
});
  
  export default AuthorInstance; 