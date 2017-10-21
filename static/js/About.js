    import React from 'react';
    import BookNavbar from './BookNavbar';
    import { Carousel, Image, Row, Col, Badge, ListGroup, ListGroupItem } from 'react-bootstrap';

    var axios = require('axios');
    require('../css/styles.css');

    var About = React.createClass({
       getInitialState: function(){
            return {
                commits: '',
                totalCommits: ''
            }
        },

        componentDidMount(){
            // fetchs from the github API. 
            axios.get("https://api.github.com/repos/savsmith/idb/contributors")
            .then(response => {
                let commitObj = {}
                let totalCommits = 0;
                for (var i = 0; i < 6; i++){
                    commitObj[response.data[i]["login"]] = response.data[i]["contributions"];
                    totalCommits += response.data[i]["contributions"];

                }
                commitObj["savesmith"] += commitObj["savsmith"] 
                delete commitObj["savsmith"];
                this.setState({
                    commits: commitObj,
                    totalCommits: totalCommits
                });
            }).catch(error => {
                console.log(error); return Promise.reject(error);
            }); 
        },

        render: function(){
        return(
            <div>
            <BookNavbar></BookNavbar>
            <div className="parallax text-center">
                <div id= "parallax-header">
                <h1>ABOUT US</h1>
                <p>Betterreads is a better site to help readers find their next favorite
                book.</p>
                <p>Not only is it good, but it's even better!</p>
            </div>
            </div>
            <div className="text-center">
            <h1> OUR TEAM </h1>
                <Col md={12}>
                    <Row>
                    <Members name = "Savannah Smith" commits={this.state.commits["savesmith"]}></Members>
                    <Members name = "Kevin Vu" commits={this.state.commits["kkv263"]}></Members>
                    <Members name = "Manasa Tipparam" commits= {this.state.commits["manasa884"]}></Members>
                    </Row>
                </Col>
                <Col md={12}>
                    <Row>
                    <Members name = "Sabrina Reenan" commits={this.state.commits["slr3256"]}></Members>
                    <Members name = "Farnoud Faghihi" commits={this.state.commits["farnoudf"]}></Members>
                    </Row>
                </Col>
                <h1>Stats</h1>
                <ListGroup>
                    <ListGroupItem>Commits: {this.state.totalCommits}</ListGroupItem>
                    <ListGroupItem>Issues: </ListGroupItem>
                    <ListGroupItem>Unit Tests: </ListGroupItem>
                    <ListGroupItem href="http://docs.savsmith.apiary.io/#">Apiary API </ListGroupItem>
                    <ListGroupItem href="https://github.com/savsmith/idb">Github Repository </ListGroupItem>
                    <ListGroupItem href="https://trello.com/b/8ccrHvSD">Trello </ListGroupItem>
                    <ListGroupItem href="https://utexas.box.com/s/rz0mceaa57mip4gvs7kte9rmk8ryo2en">Technical Document hosted on UTBox </ListGroupItem>
                </ListGroup>
                <h1>Data</h1>
                <ListGroup>
                    <ListGroupItem href="https://www.goodreads.com/api">Goodreads API </ListGroupItem>
                    <ListGroupItem href="https://developers.google.com/books/">Google Books API </ListGroupItem>
                </ListGroup>           
                <h1>Tools</h1>
                <ListGroup>
                    <ListGroupItem>Bootstrap </ListGroupItem>
                    <ListGroupItem>Flask </ListGroupItem>
                    <ListGroupItem>Trello </ListGroupItem>
                    <ListGroupItem>Github </ListGroupItem>
                    <ListGroupItem>Slack </ListGroupItem>
                </ListGroup>
                </div>
        </div>
        );
    }
    });

    var Members = React.createClass({


        render: function(){
            var firstNameKey = ((this.props.name).substr(0,(this.props.name).indexOf(' '))).toLowerCase();
            var memberArray = this.membersInfo();
            return(
                    <Col md={4} className="text-center">
                        <Image src={this.imgSource(firstNameKey)} className="center-block" responsive circle height= "200px" width="200px" />
                        <h1> {this.props.name} </h1>
                        <p>Responsibilities: {memberArray[firstNameKey][0]}</p>
                        <p>{memberArray[firstNameKey][1]}</p>
                        <p>Commits: <Badge className="badgeColor">{this.props.commits}</Badge></p>
                        <p>Issues: <Badge className="badgeColor">4</Badge></p>
                        <p>Unit Tests: <Badge className="badgeColor">3</Badge> </p>
                    </Col> 
            );
        },

        imgSource: function(name){
            var location = "../static/members/"
            var imgType = ".jpg"
            var result = location.concat(name,imgType)
            return result; 
        },

        membersInfo: function(){
            // Add responsibilities and background here 
            var members = {
            savannah: [
                "Backend and some Frontend",
                "Savannah is a fifth-year CS student who likes playing tennis, reading sci-fi and fantasy novels, and woodworking."
            ],
            kevin: [
                "Frontend",
                "Kevin is a fourth-year UTCS student who enjoys, reading mystery novels, weightlifting, and practicing martial arts."
            ],
            manasa: [
                "Design and Frontend",
                "Manasa is a fourth-year CS student who enjoys photography, music, the outdoors, and reading sci-fi and mystery novels."
            ],
            sabrina: [
                "Frontend",
                "Sabrina is a fourth year UT student who enjoys reading fantasy novels, illustrating, and dogs."
            ],
            farnoud: [
                "Database & Frontend",
                "Farnoud is a fifth-year UT student who likes to read books about philosophy, economics, history, and psychology."
            ]

            }

            return members;
        }
    });

    export default About; 