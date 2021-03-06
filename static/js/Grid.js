import React from 'react';
import Pagination from 'react-js-pagination';
import { Image, Panel, Row, Col, Button, ButtonGroup, } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {Card, CardTitle, CardText, CardMedia} from 'material-ui/Card';

var Highlight = require('react-highlighter');
const url ='http://localhost:5000';

var axios = require('axios');
require('../css/Grid.css');


/* GRID PAGE */


var Grid = React.createClass({
  //initialize global variables
  getInitialState:function(){
    return {
      datas: [],
      currentData: [],
      activePage:1,
      offset:0,
      value:"",
      search:false,
      isLoading: true
    }
  },

  componentDidMount() {
    //retrieves all instances of all models
    axios.get(url+ "/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        
        //retrieves all attributes
        //retrieves only review instances with written reviews
        if (this.props.model === "review"){
          for (var i = 0; i < length; i ++){
            if (model[i].review !== null)
              dataArray.push(model[i]);
          }
        } else {
          for (var i = 0; i < length; i ++){
            dataArray.push(model[i]);
          }
        }

        length = dataArray.length;
        //retireve data for the first page in pagination
        for (i = 0; i < (this.props.itemPerPage > length ? length : this.props.itemPerPage) ; i++){
          initialData.push(dataArray[i]);
        }


        this.setState({
          datas: dataArray,
          currentData: initialData,
          search:false,
          isLoading:false
        });

      }).catch(error => {
        console.log(error); return Promise.reject(error);
    });

    var btn = document.createElement("button");
    btn.setAttribute("id", "all");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "btn buttonColor");
    btn.appendChild(document.createTextNode("Show All"));

    document.getElementById("filterGroup").appendChild(btn);
    document.getElementById("all").onclick = this.showAll;

    //filter buttons for books
    if (this.props.model === "books") {
      var topBooks = document.createElement("button");
      topBooks.setAttribute("id", "topbooks");
      topBooks.setAttribute("type", "button");
      topBooks.setAttribute("class", "btn buttonColor");
      topBooks.appendChild(document.createTextNode("Top Rated Books"));

      var serieBooks = document.createElement("button");
      serieBooks.setAttribute("id", "seriebooks");
      serieBooks.setAttribute("type", "button");
      serieBooks.setAttribute("class", "btn buttonColor");
      serieBooks.appendChild(document.createTextNode("Series"));

      var mostRecent = document.createElement("button");
      mostRecent.setAttribute("id", "mostrecent");
      mostRecent.setAttribute("type", "button");
      mostRecent.setAttribute("class", "btn buttonColor");
      mostRecent.appendChild(document.createTextNode("Most Recent"));

      document.getElementById("filterGroup").appendChild(topBooks);
      document.getElementById("filterGroup").appendChild(serieBooks);
      document.getElementById("filterGroup").appendChild(mostRecent);
      document.getElementById("topbooks").onclick = this.showTopBooks;
      document.getElementById("seriebooks").onclick = this.showSerieBooks;
      document.getElementById("mostrecent").onclick = this.showMostRecent;
    //filter buttons for author
    } else if (this.props.model === "author") {
      var topAuthors = document.createElement("button");
      topAuthors.setAttribute("id", "topauthors");
      topAuthors.setAttribute("type", "button");
      topAuthors.setAttribute("class", "btn buttonColor");
      topAuthors.appendChild(document.createTextNode("Top Rated Authors"));

      document.getElementById("filterGroup").appendChild(topAuthors);
      document.getElementById("topauthors").onclick = this.showTopAuthors;
    //filter buttons for series
    } else if (this.props.model === "series_i") {
      var lowCnt = document.createElement("button");
      lowCnt.setAttribute("id", "lowcnt");
      lowCnt.setAttribute("type", "button");
      lowCnt.setAttribute("class", "btn buttonColor");
      lowCnt.appendChild(document.createTextNode("Low Vol. Series"));

      var highCnt = document.createElement("button");
      highCnt.setAttribute("id", "highcnt");
      highCnt.setAttribute("type", "button");
      highCnt.setAttribute("class", "btn buttonColor");
      highCnt.appendChild(document.createTextNode("High Vol. Series"));

      document.getElementById("filterGroup").appendChild(lowCnt);
      document.getElementById("filterGroup").appendChild(highCnt);
      document.getElementById("lowcnt").onclick = this.showLowCnt;
      document.getElementById("highcnt").onclick = this.showHighCnt;
    //filter buttons for reviews
    } else {
      var lowRatings = document.createElement("button");
      lowRatings.setAttribute("id", "lowratings");
      lowRatings.setAttribute("type", "button");
      lowRatings.setAttribute("class", "btn buttonColor");
      lowRatings.appendChild(document.createTextNode("Low Ratings"));

      var highRatings = document.createElement("button");
      highRatings.setAttribute("id", "highratings");
      highRatings.setAttribute("type", "button");
      highRatings.setAttribute("class", "btn buttonColor");
      highRatings.appendChild(document.createTextNode("High Ratings"));

      document.getElementById("filterGroup").appendChild(highRatings);
      document.getElementById("filterGroup").appendChild(lowRatings);
      document.getElementById("highratings").onclick = this.showHighRatings;
      document.getElementById("lowratings").onclick = this.showLowRatings;

    }
  },

  //page change for pagination in grid page
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

  //handle page change when clicking on instance
  handleChange(event) {
    this.setState({value: event.target.value});
  },

  //handle page change for search of grid
  handleSubmit(event){
    event.preventDefault();
    //get all instances from all models
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];

        for (var i = 0; i < length; i ++){
          for (var property in model[i]) {
            if (model[i][property] !== null){
              //convert all searchable attributes to lowercase
              var str = (model[i][property]).toString().toLowerCase();
              if (str.includes(this.state.value.toLowerCase())){
                dataArray.push(model[i]);
                break;
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

  //sort grid alphabetically A-Z
  sortAscend() {
    //sort for each model
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

  //sort grid reverse alphabetically Z-A
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

  //show all instances for a grid
  showAll() {
    //get all instances of all models
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];

        //only retrieve reviews that have a written review
        if (this.props.model === "review")
          for (var i = 0; i < length; i ++){
            if (model[i].review !== null)
              dataArray.push(model[i]);
          }
        else
          for (var i = 0; i < length; i ++){
            dataArray.push(model[i]);
          }
        for (i = 0; i < (this.props.itemPerPage > length ? length : this.props.itemPerPage) ; i++){
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

  //filter authors to show only authors whose overall book ratings are above 4
  showTopAuthors() {
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var books = datas.data["books"];
        var length = Object.keys(model).length;
        var blength = Object.keys(books).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        //for all authors
        for (var i = 0; i < length; i ++){
          var cnt = 0;
          var rating = 0.0;
          //retrieve author's books and their ratings
          for (var j = 0; j < blength; j++) {
            if (model[i].id === books[j].author_id) {
              cnt++;
              rating += books[j].rating;
            }
          }
           //show authors whose book rating average is above 4.0
          if ((rating / cnt) >= 4.0) {
            truelen++;
            dataArray.push(model[i]);
          }
        }

        //pagination
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

  //filter book page by books with an average rating higher or equal to 4.0
  showTopBooks() {
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;
        
        //only push books whose rating is higher or equal to 4.0
        for (var i = 0; i < length; i ++){
          if (model[i].rating >= 4.0) {
            truelen++;
            dataArray.push(model[i]);
          }
        }
  
        //for pagination
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

  //filter books to only show books in a series
  showSerieBooks() {
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        //only push books in a series
        for (var i = 0; i < length; i ++){
          if (model[i].series_id !== null) {
            truelen++;
            dataArray.push(model[i]);
          }
        }

        //for pagination
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

  //filter books to only show books published within the last 10 years
  showMostRecent() {
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        //only push books published within last 10 years
        for (var i = 0; i < length; i ++){
          if (model[i].published_year !== null && model[i].published_year <= (new Date()).getFullYear() && model[i].published_year > ((new Date()).getFullYear() - 10)) {
            truelen++;
            dataArray.push(model[i]);
          }
        }

        //sort filtered books by published year 
        dataArray.sort(function(a, b) {
          if(a.published_year > b.published_year) return -1;
          if(a.published_year < b.published_year) return 1;
          return 0;
        })

        //for pagination
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

  //filter series to show only series with less than 6 books
  showLowCnt() {
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        //push only series with less than 6 books
        for (var i = 0; i < length; i ++){
          if (model[i].count < 6) {
            truelen++;
            dataArray.push(model[i]);
          }
        }

        //for pagination
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

  //filter series to show only series with more than 5 books
  showHighCnt() {
      axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        //push only series with more than 5 books
        for (var i = 0; i < length; i ++){
          if (model[i].count >= 6) {
            truelen++;
            dataArray.push(model[i]);
          }
        }

        //for pagination
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

  //filter reviews to show only reviews with ratings below or equal to 2.5
  showLowRatings() {
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;

        //for reviews that have written reviews, only push reviews with rating below equal to 2.5
        for (var i = 0; i < length; i ++){
          if (model[i].review !== null)
            if (model[i].rating <= 2.5) {
              truelen++;
              dataArray.push(model[i]);
            }
        }

        //for pagination
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
  
  //filter reviews to show only reviews with ratings above 2.5
  showHighRatings() {
    axios.get(url+"/all")
      .then(datas => {
        var model = datas.data[this.props.model];
        var length = Object.keys(model).length;
        var dataArray = [];
        var initialData=[];
        var truelen = 0;
 
        //for reviews that have written reviews, only push reviews with rating above to 2.5
        for (var i = 0; i < length; i ++){
          if (model[i].review !== null)
            if (model[i].rating > 2.5) {
              truelen++;
              dataArray.push(model[i]);
            }
        }

        //for pagination
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

  //render a grid page
  render: function(){
    var load = this.state.isLoading;
    let datas = this.state.currentData;
    datas = datas.map(function(item,index){
    var result = result = item["large_img"];
    var route = this.props.instance;
    var name = this.props.name;
    var imgSize = 250;
    var search = this.state.search;
    var attr1 = "";
    var attr2 = "";
    var attr3 = "";

    //set attributes to show on review cards
    if (this.props.model === "review"){
      var location = "../static/review_stars/"
      var imgType = "star.png"
      var review = Math.floor(item["rating"]);
      var result = location.concat(review,imgType);
      imgSize = imgSize / 4;
      var attr1 = item["rating"] + " stars";
      if(item["review"] != null){
        attr3 = item["review"].substring(0, 20) + "...";
      }
      else {
        attr3 = "No review";
      }
      attr2 = item["date_added"];
    }
    //set attributes to show on series cards
    else if (this.props.model === "series_i"){
      attr1 = item['primary_count'] + " books";
      result = "../static/series_art/series.jpg";
      if(item["description"] != null){
        attr3 = item["description"].substring(0, 50) + "...";
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
    //set attributes to show on boks cards
    else if (this.props.model === "books"){
      attr1 = "Rating: " + item['rating'];
      if(item["description"] != null){
        attr3 = item["description"].substring(0, 30) + "...";
      }
      else {
        attr3 = "No description";
      }
      attr2 = "Published: " + item["published_month"] + "/" + item["published_day"] + "/" + item["published_year"];
    }
    //set attributes to show on author cards
    else if (this.props.model === "author"){
      attr1 = "Born in: " + item['hometown'];
      if(item["description"] != null){
        attr3 = item["description"].substring(0, 20) + "...";
      }
      else {
        attr3 = "No description";
      }
      attr2 = item["gender"];
    }
  
    //layout for the grid including after searched
    return(
      <div key={index}>
        <LinkContainer to={"/"+route + "/" + item['id']} >
          <Col xs={5} sm={3} className="centerCol grow slideAndFade">
            {search ? (
              <div>
                <Card style={{maxWidth:230, maxHeight: 420}}>
                  <CardMedia 
                  overlay={<CardTitle title={<p><Highlight matchClass="highlight" search={this.state.value}>{item[name]}</Highlight></p>} titleStyle={{fontSize:'15px'}}/> }
                  >
                    <img  src={result} />
                  </CardMedia>
                  <CardText>
                    <var>{<Highlight matchClass="highlight" search={this.state.value}>{attr1}</Highlight>}</var>
                    <br/>
                    <var>{<Highlight matchClass="highlight" search={this.state.value}>{attr2}</Highlight>}</var>
                    <br/>
                    <var>{<Highlight matchClass="highlight" search={this.state.value}>{attr3}</Highlight>}</var>
                  </CardText>
                </Card>
              </div>
            ) :
            (
              <div>
                <Card className="grow" style={{maxWidth:230, maxHeight: 420}}>
                  <CardMedia
                  overlay={<CardTitle title={item[name]}  titleStyle={{fontSize:'15px'}}/> }
                  >
                    <img src={result} />
                  </CardMedia>
                  <CardText>
                    <var>{attr1}</var>
                    <br/>
                    <var>{attr2}</var>
                    <br/>
                    <var>{attr3}</var>
                  </CardText>
                </Card>
              </div>
            )}
          </Col>
        </LinkContainer>
      </div>
    );}.bind(this));

    //include layout for sort, filter, and pagination buttons on grid page
    return(
      <div className="gridwrapper">
        <div className="searchWrapper">
          <form onSubmit={this.handleSubmit}>
            <label>
              <input className="searchbar" type="text" value={this.state.value} onChange={this.handleChange} placeholder = "Search" />
            </label>
            <Button className="buttonColor"type="submit">Search</Button>
          </form>
        </div>
        <div className = "filterWrapper">
          <span className="text">Filter By: </span>
          <div id='filterGroup' className="btn-group">
          </div>
          <p>&nbsp;</p>
          <span className="text">Sort By: </span>
          <div className="btn-group sort1px">
              <button id='ascend' type="button" className="btn buttonColor" onClick={this.sortAscend}>Ascending</button>
              <button id='descend' type="button" className="btn buttonColor" onClick={this.sortDescend}>Descending</button>
          </div>
        </div>
        {load ? (
          <Col md={12}>
            <h1 className="loadingText">loading...</h1>
            <div>
              <div id="loader">
                <div id="shadow"></div>
                <div id="box"></div>
              </div>
            </div>
          </Col>
        ) :
        (
          <div>
            <Col md={12}>
              <div>
                {datas}
              </div>
            </Col>
            <Pagination 
            className="pagination"
            activePage={this.state.activePage}
            itemsCountPerPage={this.props.itemPerPage}
            totalItemsCount={this.state.datas.length}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange}
            />
          </div> 
        )}
      </div>
    );
  }
});

export default Grid;
