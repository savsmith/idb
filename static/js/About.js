    import React from 'react';
    import BookNavbar from './BookNavbar';
    import { Carousel, Image, Row, Col, Badge, ListGroup, ListGroupItem } from 'react-bootstrap';

    var axios = require('axios');
    require('../css/styles.css');
    require('../css/about.css');

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
            
            <div className="teamWrapper">
                <Col md={12}>
                    <Row>
                    <img id="booklogo" height="350px" src="../static/misc/book.png" />
                    <Members name = "Savannah Smith" commits={this.state.commits["savesmith"]}></Members>
                    <Members name = "Kevin Vu" commits={this.state.commits["kkv263"]}></Members>
                    </Row>
                </Col>
                <Col md={12}>
                    <Row>
                    <Members name = "Manasa Tipparam" commits= {this.state.commits["manasa884"]}></Members>
                    <Members name = "Sabrina Reenan" commits={this.state.commits["slr3256"]}></Members>
                    <Members name = "Farnoud Faghihi" commits={this.state.commits["farnoudf"]}></Members>
                    </Row>
                </Col>
                <p>&nbsp; </p>
                <div className="statsWrapper">
                <div className="statsLeftWrapper">
                    <img className="paperImg" src={require("../misc/paper.png")} />
                    <p id="apiText">links & statistics</p>
                </div>
                <div className="statsRightWrapper">
                     <img className="statLinks" src="../static/misc/bar.svg" />
                     <span className="sInfo"> Commits : {this.state.totalCommits} </span>
                     <img className="statLinks" src="../static/misc/warning.svg" />
                     <span className="sInfo"> Issues : 20</span>
                     <img className="statLinks" src="../static/misc/check.svg" />
                     <span className="sInfo"> Unit Tests : 15</span>
                     <p>&nbsp;</p>
                     <img className="statLinks" src="../static/misc/trello.png" />
                     <a href="https://trello.com/b/8ccrHvSD" className="sInfo">Trello Board</a>
                     <img className="statLinks" src="../static/misc/apiary.png" />
                     <a href="http://docs.savsmith.apiary.io/#" className="sInfo">Apiary Docs</a>
                     <img className="statLinks" src="../static/misc/git.svg" />
                     <a href="https://github.com/savsmith/idb" className="sInfo">Github Repository</a>

                     <p>&nbsp;</p>
                     <img className="statLinks" src="../static/misc/tree.svg" />
                     <a href="https://utexas.box.com/s/whm38m1c2xf01pnkwj2qigqjjslteaul" className="sInfo">UML Diagram hosted on UTBox</a>
                     <p>&nbsp;</p>
                     <img className="statLinks" src="../static/misc/file.svg" />
                     <a href="https://utexas.box.com/s/8j8md4w42dgvzja6zk1qmut3dpz1y8tp" className="sInfo">Techncial Document hosted on UTBox</a>
                </div>
                </div>
            </div>
                <div className="dataWrapper">
                <div className="dataBox">
                    <img className="scrapeicon" src={require("../misc/scrape.svg")} />
                </div>
                <div className="dataLeftWrapper">
                    <p id="apiText">API</p>
                    <a href = "https://www.goodreads.com/api">
                     <img className="api" width="200px" src="../static/misc/goodreads.png" />
                    </a>
                    <a href="https://developer.nytimes.com/">
                     <img className="api" width="200px" src="../static/misc/nytlogo.png" />
                    </a>
                </div>
                    <div className="dataRightWrapper">
                    <h1>how did we scrape?</h1>
                    In order to gather the data for our betterreads database 
                    we simply wrote the program createdb.py which filled the database. It has methods that get reviews, books, 
                    series, and authors. Those get methods build upon themselves, so when a book looks up what series it is in it will 
                    call the get series method which will in turn get all the books of the series. To populate our database, a call to the get book 
                    method on a few ids iterating through it's author's books and it's series's books we are able to populate a pretty large database. 
                    After that, we have to iterate through the reviews to match them with their book id because goodreads does not supply a way to get the 
                    reviews of a book through their id.
                    </div>
                </div>

                <div className="toolWrapper">
                    <div className="toolBox">
                        <span className="toolText">our toolbox</span>
                        <img className="toolImg" src={require("../misc/cog.svg")} />
                    </div>
                    <div className="toolRightWrapper">
                        <img className="tool" src={require("../misc/trello.png")} />
                        <img className="tool" src={require("../misc/git.svg")} />
                        <img className="tool" id="flask" src={require("../misc/logo_flask.svg")} />
                        <img className="tool" src={require("../misc/slack.svg")} />
                        <img className="tool" src={require("../misc/black.png")} />
                        <img className="tool" src={require("../misc/react.svg")} />
                    </div>
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
                    <Col md={4} className="members">
                        <div className="profile">
                            <Image id="memCol" src={this.imgSource(firstNameKey)} responsive circle height= "150px" width="150px" />
                            <p id="name">{this.props.name}</p>
                        </div>
                        <div className="flipContainer">
                            <div className="hoverInfo">
                                <div className="frontcard">
                                    <p className="pInfo">Responsibilities: {memberArray[firstNameKey][0]}</p>
                                    <p className="pInfo">{memberArray[firstNameKey][1]}</p>
                                </div>

                                <div className="backcard">
                                    <img className="infoIcon" src={require("../misc/git.svg")} />
                                    <span className="pInfo"> Commits : {this.props.commits}</span>
                                    <p></p>
                                    <img className="infoIcon" src={require("../misc/warning.svg")} />
                                    <span className="pInfo"> Issues : 4</span>
                                    <p></p>
                                    <img className="infoIcon" src={require("../misc/check.svg")} />
                                    <span className="pInfo"> Unit Tests: 3</span> 
                                </div>
                            </div>
                        </div>
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