import React from 'react';
import Pagination from 'react-js-pagination';
import { Image, Panel, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
var axios = require('axios');
require('../css/Grid.css');

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
          <div key={index}>
          <LinkContainer to={"/book/" + item['book_id']} >
          <Col xs={6} sm={3} className="text-center centerCol">
              <Image className="slideAndFade grow" src={result} height="260px" width="180px"/> 
          </Col> 
          </LinkContainer>

          </div>
        );
      }.bind(this));

      return(
        <div className="gridwrapper">
          <Col md={12}>
            {datas}
          </Col>
          { /*left pagination has to change based on range we decide. */ }

          <Pagination 
          className="pagination"
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