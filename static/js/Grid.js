import React from 'react';
import Pagination from 'react-js-pagination';
import { Image } from 'react-bootstrap';
var axios = require('axios');

var Grid = React.createClass({
  getInitialState:function(){
    return {
      datas: [],
      currentData: [],
      activePage:1,
      offset:0
    }
  },

  componentDidMount() {
    let data = require('../db/bookDB.json');
    let datas = data[this.props.model];
    var length = Object.keys(datas).length;
    var dataArray = [];
    var initialData=[];
      for (var i = 0; i < length; i ++){
        dataArray.push(datas[i]);
      }

      for (i = 0; i < this.props.itemPerPage; i++){
        initialData.push(datas[i]);
      }

        this.setState({
        datas: dataArray,
        currentData: initialData
      });
  },

  handlePageChange(pageNumber) {
    var itemPerPage = this.props.itemPerPage;
    var offset = (pageNumber-1) * itemPerPage;
    var pageItems = offset + itemPerPage;
    if (pageItems> this.state.datas.length){
        pageItems = pageItems - (this.state.datas.length % itemPerPage);
    }
    var updatedData = [];
    for (var i=offset; i<pageItems; i++){
      console.log(updatedData);
      updatedData.push(this.state.datas[i])
    }

    this.setState({
      activePage: pageNumber,
      offset: offset,
      currentData:updatedData 
    });

  },

  render: function(){
    
      let datas = this.state.currentData;
      datas = datas.map(function(item,index){
        var location = "../static/book_images/"
        var imgType = "" 
        var result = location.concat(item['cover_art'],imgType)
        return(
          <div key={index}>{item['title']}
            <Image src={result} width="180px"/> 
          </div>
        );
      }.bind(this));

      return(
        <div>
          <ul>
            {datas}
          </ul>
          <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={this.props.itemPerPage}
          totalItemsCount={this.state.datas.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
        </div>
      );
  }
});
  
  export default Grid; 