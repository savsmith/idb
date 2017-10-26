import React from 'react';
import { Navbar, NavItem, Nav, MenuItem } from 'react-bootstrap';
import SearchForm from './SearchForm';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom'
require('../css/styles.css');

var BookNavbar = React.createClass({
  
    render() {
      return (
        <div>
            <Navbar className="navbar-fixed-top" fluid collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">betterreads</a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav pullRight>
                  <LinkContainer to="/books">
                    <MenuItem>books</MenuItem>
                  </LinkContainer>
                  <MenuItem href="/series">series</MenuItem>
                  <MenuItem href="/author">author</MenuItem>
                  <MenuItem href="/reviews">reviews</MenuItem>
                  
                  <LinkContainer to="/about">
                    <MenuItem>about</MenuItem>
                  </LinkContainer>
                </Nav>
                <SearchForm/> 
              </Navbar.Collapse>
            </Navbar>
        </div>
      )
    }
  });
  
  export default BookNavbar; 