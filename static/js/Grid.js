import React from 'react';
import Pagination from 'react-js-pagination';
import { Image, Panel, Row, Col, Button, ButtonGroup, } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
var Highlight = require('react-highlighter');


var axios = require('axios');
require('../css/Grid.css');

var Grid = React.createClass({
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
          currentData: initialData,
          search:false
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     var btn = document.createElement("button");
     btn.setAttribute("id", "all");
     btn.setAttribute("type", "button");
     btn.setAttribute("class", "btn btn-primary");
     btn.appendChild(document.createTextNode("Show All"));

     document.getElementById("filterGroup").appendChild(btn);
     document.getElementById("all").onclick = this.showAll;

     if (this.props.model === "books") {
        var topBooks = document.createElement("button");
        topBooks.setAttribute("id", "topbooks");
        topBooks.setAttribute("type", "button");
        topBooks.setAttribute("class", "btn btn-primary");
        topBooks.appendChild(document.createTextNode("Top Rated Books"));

        var serieBooks = document.createElement("button");
        serieBooks.setAttribute("id", "seriebooks");
        serieBooks.setAttribute("type", "button");
        serieBooks.setAttribute("class", "btn btn-primary");
        serieBooks.appendChild(document.createTextNode("Series"));

        document.getElementById("filterGroup").appendChild(topBooks);
        document.getElementById("filterGroup").appendChild(serieBooks);
        document.getElementById("topbooks").onclick = this.showTopBooks;
        document.getElementById("seriebooks").onclick = this.showSerieBooks;
     } else if (this.props.model === "author") {
        var topAuthors = document.createElement("button");
        topAuthors.setAttribute("id", "topauthors");
        topAuthors.setAttribute("type", "button");
        topAuthors.setAttribute("class", "btn btn-primary");
        topAuthors.appendChild(document.createTextNode("Top Rated Authors"));

        document.getElementById("filterGroup").appendChild(topAuthors);
        document.getElementById("topauthors").onclick = this.showTopAuthors;
     } else if (this.props.model === "series_i") {
        var lowCnt = document.createElement("button");
        lowCnt.setAttribute("id", "lowcnt");
        lowCnt.setAttribute("type", "button");
        lowCnt.setAttribute("class", "btn btn-primary");
        lowCnt.appendChild(document.createTextNode("Low Vol. Series"));

        var highCnt = document.createElement("button");
        highCnt.setAttribute("id", "highcnt");
        highCnt.setAttribute("type", "button");
        highCnt.setAttribute("class", "btn btn-primary");
        highCnt.appendChild(document.createTextNode("High Vol. Series"));

        document.getElementById("filterGroup").appendChild(lowCnt);
        document.getElementById("filterGroup").appendChild(highCnt);
        document.getElementById("lowcnt").onclick = this.showLowCnt;
        document.getElementById("highcnt").onclick = this.showHighCnt;
     } else {
        var lowRatings = document.createElement("button");
        lowRatings.setAttribute("id", "lowratings");
        lowRatings.setAttribute("type", "button");
        lowRatings.setAttribute("class", "btn btn-primary");
        lowRatings.appendChild(document.createTextNode("Low Ratings"));

        var highRatings = document.createElement("button");
        highRatings.setAttribute("id", "highratings");
        highRatings.setAttribute("type", "button");
        highRatings.setAttribute("class", "btn btn-primary");
        highRatings.appendChild(document.createTextNode("High Ratings"));

        document.getElementById("filterGroup").appendChild(highRatings);
        document.getElementById("filterGroup").appendChild(lowRatings);
        document.getElementById("highratings").onclick = this.showHighRatings;
        document.getElementById("lowratings").onclick = this.showLowRatings;
     }
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
        for (var property in model[i]) {
          if (model[i][property] !== null){
          var str = (model[i][property]).toString().toLowerCase();
          if (str.includes(this.state.value)){
            dataArray.push(model[i]);
            break;
          }
        }
       }
      }

      for (i = 0; i < (this.props.itemPerPage > length ? length : this.props.itemPerPage) ; i++){
        for (var property in model[i]) {
          if (model[i][property] !== null){
          var str = (model[i][property]).toString().toLowerCase();
          if (str.includes(this.state.value)){
            initialData.push(model[i]);
            break;
          }
        }
        }
      }
        this.setState({
        datas: dataArray,
        currentData: initialData,
        search: true
      }); 
    }).catch(error => {
        console.log(error); return Promise.reject(error);
    }); 

  },
  
  sortAscend() {
     let items = this.state.datas;
     if (this.props.model === "books") {
        items.sort(function(a, b) {
           if(a.title < b.title) return -1;
           if(a.title > b.title) return 1;
           return 0;
        })
     } else if (this.props.model === "author") {
        items.sort(function(a, b) {
           if(a.author < b.author) return -1;
           if(a.author > b.author) return 1;
           return 0;
        })
     } else if (this.props.model === "series_i") {
        items.sort(function(a, b) {
           if(a.series_name < b.series_name) return -1;
           if(a.series_name > b.series_name) return 1;
           return 0;
        })
     } else {
        items.sort(function(a, b) {
           if(a.rating < b.rating) return -1;
           if(a.rating > b.rating) return 1;
           return 0;
        })
     }

     this.setState({
        datas:items
     });
     this.handlePageChange(1);
  },

   sortDescend() {
     let items = this.state.datas;
     if (this.props.model === "books") {
        items.sort(function(a, b) {
           if(a.title > b.title) return -1;
           if(a.title < b.title) return 1;
           return 0;
        })
     } else if (this.props.model === "author") {
        items.sort(function(a, b) {
           if(a.author > b.author) return -1;
           if(a.author < b.author) return 1;
           return 0;
        })
     } else if (this.props.model === "series_i") {
        items.sort(function(a, b) {
           if(a.series_name > b.series_name) return -1;
           if(a.series_name < b.series_name) return 1;
           return 0;
        })
     } else {
        items.sort(function(a, b) {
           if(a.rating > b.rating) return -1;
           if(a.rating < b.rating) return 1;
           return 0;
        })
     }

     this.setState({
        datas:items
     });
     this.handlePageChange(1);
  },

  showAll() {
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

     this.handlePageChange(1);
  },

  showTopAuthors() {
      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var books = datas.data["books"];

        var length = Object.keys(model).length;
        var blength = Object.keys(books).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        for (var i = 0; i < length; i ++){
           var cnt = 0;
           var rating = 0.0;
           for (var j = 0; j < blength; j++) {
              if (model[i].id === books[j].author_id) {
                 cnt++;
                 rating += books[j].rating;
              }
           }
           if ((rating / cnt) >= 4.0) {
              truelen++;
             dataArray.push(model[i]);
           }
        }
  
        for (i = 0; i < (this.props.itemPerPage > truelen ? truelen : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }
  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     this.handlePageChange(1);
  },

  showTopBooks() {
      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];

        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        for (var i = 0; i < length; i ++){
           if (model[i].rating >= 4.0) {
              truelen++;
             dataArray.push(model[i]);
           }
        }
  
        for (i = 0; i < (this.props.itemPerPage > truelen ? truelen : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }
  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     this.handlePageChange(1);
  },

  showSerieBooks() {
      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];

        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        for (var i = 0; i < length; i ++){
           if (model[i].series_id !== null) {
              truelen++;
             dataArray.push(model[i]);
           }
        }
  
        for (i = 0; i < (this.props.itemPerPage > truelen ? truelen : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }
  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     this.handlePageChange(1);
  },

  showLowCnt() {
      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];

        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        for (var i = 0; i < length; i ++){
           if (model[i].count < 6) {
              truelen++;
             dataArray.push(model[i]);
           }
        }
  
        for (i = 0; i < (this.props.itemPerPage > truelen ? truelen : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }
  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     this.handlePageChange(1);
  },

  showHighCnt() {
      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];

        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        for (var i = 0; i < length; i ++){
           if (model[i].count >= 6) {
              truelen++;
             dataArray.push(model[i]);
           }
        }
  
        for (i = 0; i < (this.props.itemPerPage > truelen ? truelen : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }
  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     this.handlePageChange(1);
  },

  showLowRatings() {
      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];

        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        for (var i = 0; i < length; i ++){
           if (model[i].rating <= 2.5) {
              truelen++;
             dataArray.push(model[i]);
           }
        }
  
        for (i = 0; i < (this.props.itemPerPage > truelen ? truelen : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }
  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     this.handlePageChange(1);
  },

  showHighRatings() {
      axios.get("http://localhost:5000/all")
      .then(datas => {
        var model = datas.data[this.props.model];

        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        for (var i = 0; i < length; i ++){
           if (model[i].rating > 2.5) {
              truelen++;
             dataArray.push(model[i]);
           }
        }
  
        for (i = 0; i < (this.props.itemPerPage > truelen ? truelen : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }
  
          this.setState({
          datas: dataArray,
          currentData: initialData
        }); 

      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 

     this.handlePageChange(1);
  },

  render: function(){
    
      let datas = this.state.currentData;
      datas = datas.map(function(item,index){
      var result = result = item["large_img"];;
      var route = this.props.instance;
      var name = this.props.name;
      var imgSize = 250;
      var search = this.state.search;
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
               {search ? <Highlight search={this.state.value}>{item[name]}</Highlight> : (<p>{item[name]}</p>)} 
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
          <div id='filterGroup' className="btn-group">
            <p>Filter By: &nbsp;</p>
          </div>
          <div className="btn-group">
            <p>Sort By: &nbsp;</p>
            <button id='ascend' type="button" className="btn btn-primary" onClick={this.sortAscend}>Ascending</button>
            <button id='descend' type="button" className="btn btn-primary" onClick={this.sortDescend}>Descending</button>
          </div>
          <Col md={12}>
            {datas}
          </Col>
          { /*left pagination has to change based on range we decide. */ }

          <Pagination 
          className="pagination"
          activePage={this.state.activePage}
          itemsCountPerPage={12}
          totalItemsCount={this.state.datas.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
          />
        </div>
      );
  }
});
  
  export default Grid; 
