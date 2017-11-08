import React from 'react';
import Pagination from 'react-js-pagination';
import { Image, Panel, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
var axios = require('axios');
require('../css/Grid.css');

var Grid = React.createClass({
  getInitialState:function(){
    return {
      datas: [],
      currentData: [],
      activePage:1,
      offset:0,
      value:""
    }
  },

  componentDidMount() {
      // for api when it works.

      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];

        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];

        for (var i = 0; i < length; i ++){
          dataArray.push(model[i]);
        }
  
        for (i = 0; i < (this.props.itemPerPage > length ? length : this.props.itemPerPage) ; i++){
          initialData.push(model[i]);
        }

  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

  },

  handlePageChange(pageNumber) {
    var itemPerPage = this.props.itemPerPage;
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
    axios.get("http://localhost:5000/all")
    .then(datas => {
      var model = datas.data[this.props.model];
      var length = Object.keys(model).length;
      var dataArray = [];
      var initialData=[];

      for (var i = 0; i < length; i ++){
        var str = (model[i][this.props.name]).toLowerCase();
        if (str.includes(this.state.value)){
          dataArray.push(model[i]);
        }
      }

      for (i = 0; i < (this.props.itemPerPage > length ? length : this.props.itemPerPage) ; i++){
        var str = (model[i][this.props.name]).toLowerCase();
        if (str.includes(this.state.value)){
          initialData.push(model[i]);
        }
      }
      console.log(dataArray);
      console.log(initialData);

        this.setState({
        datas: dataArray,
        currentData: initialData
      }); 
    }).catch(error => {
        console.log(error); return Promise.reject(error);
    }); 

  },
  

  render: function(){
    
      let datas = this.state.currentData;
      datas = datas.map(function(item,index){
      var result = result = item["large_img"];;
      var route = this.props.instance;
      var name = this.props.name;
      var imgSize = 250;
      if (this.props.model === "review")
      {
        var location = "../static/review_stars/"
        var imgType = "star.png"
        var review = Math.floor(item["rating"]);
        var result = location.concat(review,imgType);
        imgSize = imgSize / 4;
      }
      else if (this.props.model === "series_i")
      {
        result = "../static/series_art/series.jpg";
      }

        return(
          <div key={index}>
          <LinkContainer to={"/"+route + "/" + item['id']} >
          <Col xs={6} sm={3} className="text-center centerCol">
              <Image className="slideAndFade grow" src={result} height={imgSize + "px"} width="175px"/> 
              <p>{item[name]}</p>
          </Col> 
          </LinkContainer>

          </div>
        );
      }.bind(this));

      return(
        <div className="gridwrapper">
         <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder = "Search" />
          </label>
          <Button type="submit">Search</Button>
        </form>
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