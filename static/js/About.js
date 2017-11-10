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
                    <ListGroupItem href="https://utexas.box.com/s/8j8md4w42dgvzja6zk1qmut3dpz1y8tp">Technical Document hosted on UTBox </ListGroupItem>
                    <ListGroupItem href="https://utexas.box.com/s/whm38m1c2xf01pnkwj2qigqjjslteaul">UML Diagram hosted on UTBox </ListGroupItem>
                </ListGroup>
                <h1>Data</h1>
                <ListGroup>
                    <ListGroupItem href="https://www.goodreads.com/api">Goodreads scraped by using NYtimes data and querying for data-</ListGroupItem>
                    <ListGroupItem href="https://developer.nytimes.com/">New York Times scraped by visiting endpoints</ListGroupItem>
                    <ListGroupItem>
                    In order to gather the data for our betterreads database I did not know if we were supposed to use a tool to scrape the database. 
                    I simply wrote the program createdb.py which filled the database. It has methods that get reviews, books, 
                    series, and authors. Those get methods build upon themselves, so when a book looks up what series it is in it will 
                    call the get series method which will in turn get all the books of the series. To populate our database I call the get book 
                    method on a few ids and by the end of iterating through it's author's books and it's series's books I have a pretty large database. 
                    After that I have to iterate through the reviews to match them with their book id because goodreads does not supply a way to get the 
                    reviews of a book through their id.
                    </ListGroupItem>
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