import React from 'react';
import BookNavbar from './BookNavbar';
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

  componentDidMount() {
    // for api when it works.

    axios.get(url+ "/all")
    .then(datas => {
      var model = datas.data;
      var modelNameArray = ["books", "author", "review", "series_i"];
      var dataArray =[];
      var initialData=[];
      var sum = 0;
      var itemPerPage = 12;

      for (var j = 0; j < 4; j ++){
       for (var i = 0; i < Object.keys(model[modelNameArray[j]]).length; i ++){
         if (modelNameArray[j] === 'review') {
           if (model[modelNameArray[j]][i].review !== null)
             dataArray.push(model[modelNameArray[j]][i]);
           }
           else {
             dataArray.push(model[modelNameArray[j]][i]);
           }
        }
      }

      length = dataArray.length;

      for (i = 0; i < (this.props.itemPerPage > length ? length : itemPerPage) ; i++){
        initialData.push(dataArray[i]);
      }

      this.setState({
      datas: dataArray,
      currentData: initialData,
      search:false
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
        </div>
      )
    }
  });
  
  export default SearchForm; 
