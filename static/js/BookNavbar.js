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
                  <LinkContainer to="/series">
                    <MenuItem>series</MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/author">
                    <MenuItem>authors</MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/reviews">
                    <MenuItem>reviews</MenuItem>
                  </LinkContainer>

                  <LinkContainer to="/about">
                    <MenuItem>about</MenuItem>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
        </div>
      )
    }
  });

  export default BookNavbar;
