import React from 'react';
import { Card, CardTitle, CardText, CardMedia, CardHeader } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


var newGrid = React.createClass ({
  render() {
    return(
      <div align="center">
      <h1> Card Page </h1>
      <MuiThemeProvider>
        <Card style={{maxWidth:200}}>
          <CardHeader title="Card Title"/>
          <CardMedia overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}>
          <img src="http://www.liveanimalslist.com/reptiles/images/lizard-eye-view.jpg" alt=""/>
          </CardMedia>
          <CardText>
            This is some sample text. It could be a description
            or attributes or whatever you want to put in here.
          </CardText>
        </Card>
        </MuiThemeProvider>
      </div>

    )
  }
});

export default newGrid;
