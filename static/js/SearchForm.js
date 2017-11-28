import React from 'react';
import Pagination from 'react-js-pagination';
import BookNavbar from './BookNavbar';
import { Image, Panel, Row, Col, Button, ButtonGroup, } from 'react-bootstrap';
require('../css/styles.css');
require('../css/search.css');

var Highlight = require('react-highlighter');
var axios = require('axios');

const url ='http://localhost:5000';


/* SEARCH BAR */


var SearchForm = React.createClass({
  //initialize global variables
  getInitialState:function(){
    return {
      datas: [],
      currentData: [],
      activePage:1,
      offset:0,
      value:"",
      search:false
    }
  },

  //pagination page change
  handlePageChange(pageNumber) {
    var itemPerPage = 10;
    var offset = (pageNumber-1) * itemPerPage;
    var pageItems = offset + itemPerPage;

    if (pageItems> this.state.datas.length){
        pageItems = this.state.datas.length
    }
    var updatedData = [];
    for (var i=offset; i<pageItems; i++){
      updatedData.push(this.state.datas[i])
    }

    this.setState({
      activePage: pageNumber,
      offset: offset,
      currentData:updatedData
    });

  },

  //page change
  handleChange(event) {
    this.setState({value: event.target.value});
  },

  //search submitted
  handleSubmit(event){
    event.preventDefault();
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data;
        var modelNameArray = ["books", "author", "review", "series_i"];
        var dataArray =[];
        var initialData=[];
        var itemPerPage = 10;

        //search all models for query
        //push only instances that match the query
        for (var j = 0; j < 4; j ++){
          var models = model[modelNameArray[j]]
          for (var i = 0; i < Object.keys(models).length; i ++){
            if (modelNameArray[j] === "review"){
              if (models[i].review === null){
                continue;
              }
            }
            for (var property in models[i]) {
              if (models[i][property] !== null ){
                var str = (models[i][property]).toString().toLowerCase();
                if (str.includes(this.state.value.toLowerCase())){
                  models[i]["type"]= modelNameArray[j];
                  dataArray.push(models[i]);
                  break;
                }
              }
            }
          }
        }

        //for pagination
        for (i = 0; i < (itemPerPage > dataArray.length ? dataArray.length : itemPerPage); i++){
          initialData.push(dataArray[i]);
        }

        this.setState({
          currentData: initialData,
          datas: dataArray,
          search: true,
          activePage: 1
        });
      }).catch(error => {
        console.log(error); return Promise.reject(error);
    });
  },


  render() {
    let datas = this.state.currentData;
    var search = this.state.search;
    console.log(datas.length)
    if (datas.length > 0)
    {

    datas = datas.map(function(item,index){
      var route = this.props.instance;
      var name = "";
      var attr1 = "";
      var attr2 = "";
      var attr3 = "";
      var result = result = item["large_img"];

      //set attributes for review card
      if (item['type'] === "review"){
        route = "review";
        name = "Reviewer: " + item['user']
        var location = "../static/review_stars/"
        var imgType = "star.png"
        var review = Math.floor(item["rating"]);
        var result = location.concat(review,imgType);
        var attr1 = item["rating"] + " stars";
        if(item["review"] != null){
          attr3 = item["review"].substring(0, 500) + "...";
        }
        else {
          attr3 = "No review";
        }
        attr2 = item["date_added"];
      }
      //set attributes for series cards
      else if (item['type'] === "series_i"){
        route = "series";
        name = "Series: " + item['series_name'];
        attr1 = item['primary_count'] + " books";
        result = "../static/series_art/series.jpg";
        if(item["description"] != null){
          attr3 = item["description"].substring(0, 500) + "...";
        }
        else {
          attr3 = "No description";
        }
        if(item["numbered"] == 1) {
          attr2 = "Books ordered";
        } else {
          attr2 = "Read in any order";
        }
      }
      //set attributes for book cards
      else if (item['type'] === "books"){
        route = "book"
        name = "Book: " + item['title'];
        attr1 = "Rating: " + item['rating'];
        if(item["description"] != null){
          attr3 = item["description"].substring(0, 500) + "...";
        }
        else {
          attr3 = "No description";
        }
        attr2 = "Published: " + item["published_month"] + "/" + item["published_day"] + "/" + item["published_year"];
      }
      //set attributes for author card
      else if (item['type'] === "author"){
        route="author"
        name = "Author: " + item['author'];
        attr1 = "Born in: " + item['hometown'];
        if(item["description"] != null){
          attr3 = item["description"].substring(0, 500) + "...";
        }
        else {
          attr3 = "No description";
        }
        attr2 = item["gender"];
      } 

      //if the search is not null render any matching with highlight
      if (datas.length !== 0)
        return (
          <div className= "resultItem" key={index}>
            <div className= "grow imagePortion">
              <a href={"/"+route + "/" + item['id']}  ><img className= "resultImage" src={result}/> 
              <p>{<Highlight matchClass="highlight" search={this.state.value}>{name}</Highlight>}</p> </a>
            </div>
            <div className= "wordPortion">
              <p>{<Highlight matchClass="highlight" search={this.state.value}>{attr1}</Highlight>}</p>
              <p>{<Highlight matchClass="highlight" search={this.state.value}>{attr2}</Highlight>}</p>
              <p>{<Highlight matchClass="highlight" search={this.state.value}>{attr3}</Highlight>}</p>
            </div>
          </div>
        )}.bind(this));
  }
      //render if no matching search results
      else if (datas.length === 0 && search){
        datas = (
          <div>
          <div className="noResults" >There's nothing here, please search again!</div>
          <img className="noResultsImg" src="../static/misc/baby.png" />
          </div>
        );
  }
   
  //render search form layout 
  return (
      <div>
        {search ? null :
        (
          <div className="searchSearchwrapper" style =
          {{   
          background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../static/misc/search.jpg')", 
          backgroundSize: 'cover'
          }}>
            <BookNavbar></BookNavbar>
            <div>
              <h1 className="slogan">Search for your favorite book, </h1>
              <h1 className="slogan">author, series, or review!</h1>
              <form onSubmit={this.handleSubmit}>
                <label>
                  <input className="searchSearchbar" type="text" value={this.state.value} onChange={this.handleChange} placeholder = "Try J.K. Rowling!" 
                  />
                </label>
                <Button className="buttonColor searchSearchbutton" type="submit">Search</Button>
              </form>
            </div>
          </div>) 
        }
        {search ? (
          <div>
            <BookNavbar></BookNavbar>
            <form className = "resultsSearchbar" onSubmit={this.handleSubmit}>
              <label>
                <input className="searchbar " type="text" value={this.state.value} onChange={this.handleChange} placeholder = "Try J.K. Rowling!" 
                />
              </label>
              <Button className="buttonColor " type="submit">Search</Button>
            </form> 
            <div className = "fadeIn" style = {{paddingTop: "10%"}}>
              {datas}
            </div>
            <Pagination
            className="pagination"
            activePage={this.state.activePage}
            itemsCountPerPage={10}
            totalItemsCount={this.state.datas.length}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange}
            />
          </div>
        ) : null}
      </div>
    )
  }
});
  
export default SearchForm; 
