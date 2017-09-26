import React from 'react';
import { Navbar } from 'react-bootstrap'
import { NavItem } from 'react-bootstrap'
import { Nav } from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import {FormGroup} from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import {Glyphicon} from 'react-bootstrap'
require('../css/styles.css');

var BookNavbar = React.createClass({
  
    render() {
      return (
        <div>
            <Navbar fluid collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">betterreads</a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav pullRight>
                  <NavItem eventKey={1} href="#">books</NavItem>
                  <NavItem eventKey={2} href="#">series</NavItem>
                  <NavItem eventKey={3} href="#">authors</NavItem>
                  <NavItem eventKey={4} href="#">reviews</NavItem>
                  <NavItem eventKey={5} href="#">about</NavItem>
                </Nav>
                <Navbar.Form >
                  <FormGroup bsStyle="sm" validationState="none">
                  <FormControl type="text" placeholder= "Search"/>
                  <FormControl.Feedback>
                    <Glyphicon glyph="search" />
                  </FormControl.Feedback>
                  </FormGroup>
                </Navbar.Form>                
              </Navbar.Collapse>
            </Navbar>
        </div>
      )
    }
  });
  
  export default BookNavbar; 