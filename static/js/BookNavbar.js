import React from 'react';
import { Navbar } from 'react-bootstrap'
import { NavItem } from 'react-bootstrap'
import { Nav } from 'react-bootstrap'
import SearchForm from './SearchForm';
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
                <SearchForm/> 
              </Navbar.Collapse>
            </Navbar>
        </div>
      )
    }
  });
  
  export default BookNavbar; 