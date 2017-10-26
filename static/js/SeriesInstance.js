import React from 'react';
import BookNavbar from './BookNavbar';

require('../css/SeriesInstance.css');
var axios = require('axios');

var SeriesInstance = React.createClass({
  getInitialState:function(){
    return {
      series: ""
    }
  },

  componentDidMount(){
      axios.get("http://localhost:5000/api/series")
      .then(datas => {
        var route = this.props.location.pathname;
        var seriesId = parseInt(route.substring(route.lastIndexOf("/") + 1, route.length));
        var length = Object.keys(datas.data).length;
        var series = 0;
        
        for (var i = 0; i < length; i ++){
          if (datas.data[i]["id"] === seriesId) {
            series = i;
          }
        }
          this.setState({
              series:datas.data[series]
          });
      }).catch(error => {
          console.log(error); return Promise.reject(error);
      }); 
    },

  render: function(){
    var seriesObj = this.state.series;
    console.log(seriesObj);
      return(
      <div>
        <BookNavbar></BookNavbar>
        <div className="title" >
          <center><h1><b>{seriesObj['series_name']}</b></h1></center>
          {/* <h2 className = "author"><b>Author: </b></h2> */}
          {/* <h2 style = "float: right; padding-right: 15%;"><b>Published: </b>{{ start }} - {{ end }}</h2> */}
      </div>

      <section className = "right">
      <div className="info">
        <h2  className="summary"><p><b>Description: </b></p>{ seriesObj["description"] }</h2>
        <h3> Count: {seriesObj['count']}</h3>
      </div>
    </section>

      </div>
      );
  }
});
  
  export default SeriesInstance; 