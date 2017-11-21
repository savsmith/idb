import React from 'react';
import Pagination from 'react-js-pagination';
import BookNavbar from './BookNavbar';
import { Image, Panel, Row, Col, Button, ButtonGroup, } from 'react-bootstrap';
require('../css/styles.css');

var Highlight = require('react-highlighter');
var axios = require('axios');

const url = 'http://localhost:5000';

var SearchForm = React.createClass({
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

handlePageChange(pageNumber) {
  var itemPerPage = 12;
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

handleChange(event) {
  this.setState({value: event.target.value});
},

handleSubmit(event){
  event.preventDefault();
  axios.get(url+"/all")
  .then(datas => {
    var model = datas.data;
    var modelNameArray = ["books", "author", "review", "series_i"];
    var dataArray =[];
    var initialData=[];
    var itemPerPage = 12;

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
            dataArray.push(models[i]);
            break;
        }
       }
      }
     }
    }

    for (i = 0; i < (this.props.itemPerPage > dataArray.length ? dataArray.length : this.props.itemPerPage) ; i++){
        initialData.push(dataArray[i]);
    }

      this.setState({
      currentData: initialData,
      datas: dataArray,
      search: true
    });
  }).catch(error => {
      console.log(error); return Promise.reject(error);
  });

},


    render() {
      return (
        <div>
        <BookNavbar></BookNavbar>
          <h1>search</h1>
          <form onSubmit={this.handleSubmit}>
          <label>
            <input className="searchbar" type="text" value={this.state.value} onChange={this.handleChange} placeholder = "Search" />
          </label>
          <Button className="buttonColor"type="submit">Search</Button>
          </form>

          <Pagination
          className="pagination"
          activePage={this.state.activePage}
          itemsCountPerPage={12}
          totalItemsCount={this.state.datas.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
          />
        </div>
      )
    }
  });
  
  export default SearchForm; 
