<<<<<<< HEAD
let members = []
let votes = []
let committees = []
let bills = []

/* Fetch data from API */

function fetchMembers () {
  return fetch('http://104.154.65.204:5000/api/member_list').then(response => response.json()).then(filterMembers)
}
function fetchVotes () {
  return fetch('http://104.154.65.204:5000/api/vote_list').then(response => response.json()).then(filterVotes)
}
function fetchCommittees () {
  return fetch('http://104.154.65.204:5000/api/committee_list').then(response => response.json()).then(filterCommittees)
}
function fetchBills () {
  return fetch('http://104.154.65.204:5000/api/bill_list').then(response => response.json()).then(filterBills)
}

/* Filter data */

function filterMembers (data) {
  members = data
  states = set()
  for mem in data['result']:
    states.add(mem['roles'][0]['state'])
  console.log(json.dumps(list(states)))
  members.map(function (d) {
    d['type' = 1]
    return d
  })
}

function filterVotes () {
  votes = data
  votes.map(function (d) {
    d['type' = 2]
    return d
  })

}
function filterCommittees () {
  committees = data
  committees.map(function (d) {
    d['type' = 3]
    return d
  })

}
function filterBills () {
  bills = data
  bills.map(function (d) {
    d['type' = 4]
    return d
  })

}
=======
import React from 'react';
require('../css/styles.css');


/* test page */


var Visual = React.createClass({
  render: function(){
      return(
        <div>
          <h1>test</h1>
        </div>
      );
  }
});
  
  export default Visual; 
>>>>>>> 8a247eb15ee36d59c7bee6a85b4883d0856d6bde
