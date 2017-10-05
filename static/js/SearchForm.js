
import React from 'react';
import { Navbar } from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import {FormGroup} from 'react-bootstrap'
import {Glyphicon} from 'react-bootstrap'
require('../css/styles.css');

var SearchForm = React.createClass({
  
    render() {
      return (
        <div>
          <Navbar.Form >
            <FormGroup bsStyle="sm" validationState="none">
            <FormControl type="text" placeholder= "Search"/>
            <FormControl.Feedback>
              <Glyphicon glyph="search" />
            </FormControl.Feedback>
            </FormGroup>
          </Navbar.Form>                
        </div>
      )
    }
  });
  
  export default SearchForm; 
