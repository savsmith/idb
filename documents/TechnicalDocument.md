
- [Introduction](#introduction)
- [Use Cases](#use-cases)
- [Running and Developing](#running-and-developing)
- [API](#api)
  * [Goodreads API](#goodreads-api)
  * [The New York Times API](#the-new-york-times-api)
- [Database](#database-and-models)
- [Models](#database-and-models)
  * [Books](#books)
  * [Authors](#authors)
  * [Series](#series)
  * [Reviews](#reviews)
- [Filtering and Sorting](#filtering-and-sorting)
- [Pagination](#pagination)
- [Search](#search)
- [Tools](#tools)
  * [Flask](#flask)
  * [React](#react)
  * [Planit Poker](#planit-poker)
  * [Trello](#trello)
  * [Github](#github)
  * [Slack](#slack)
  * [Apiary](#apiary)
  * [Webpack](#webpack)
  * [Node Package Manager](#node-package-manager)
  * [Babel](#babel)
  * [Virtualenv](#virtualenv)
  * [Bootstrap](#bootstrap)
  * [Namecheap](#namecheap)
  * [Python](#python)
  * [JSON](#json)
  * [Frontend](#frontend)
    - HTML5
    - CSS3
    - Javascript
  * [Google Cloud Platform](#google-cloud-platform)
  * [Box](#box)
  * [Jinja2](#jinja2)
  * [AutoPEP8](#autopep8)
  * [Sublime Text 2](#sublime-text-2)
  * [Vim](#vim)
  * [Pylint](#pylint)
  * [Pydoc](#pydoc)
  * [Unittest](#unittest)
  * [Python PIP](#python-pip)
  * [Sourcetree](#sourcetree)
  * [SQLAlchemy](#sqlalchemy)
  * [Sqlite3](#sqlite3)
- [Hosting](#hosting)

# Introduction
While deciding on different topics for our project, we had settled on a book database named “betterreads”. Since most of us like to read books from time to time, settling on a familiar field will give us an easier time with the project. 

One of the most popular websites designed for book lovers, Goodreads, provides a platform where all users can browse books, add reviews, and other user’s booklists. Inspired by “Goodreads” we provide useful information about books and authors, and their series and reviews. 

Betterreads would work to make info about books more accessible by creating a connection between different novels and between their attributes. It helps the users to get suggestions about the next book they are going to read and learn about new books. By looking at the reviews gathered about each book users can better understand what the book is about and make better decisions about whether they want to invest the time and money into buying and reading that book.



# Use Cases

Our aim with Betterreads is to provide a database for searching mainly books. We want to provide an online platform and database which will allow readers to find what kind of book they would like to read next based on a number of factors. Those who fancy books as a hobby can navigate through our website to see what kind of book they would want to read next. Users who navigate our website can search for books by the name of the book. 

Searching through the database for a book will provide data on the author and publisher of the book, the reviews on the book, and whether or not the book is a part of a series. Searching through the author model allows users to find books written by a specific author. This allows readers who are familiar with authors to filter through similar authors that may mesh with the reader’s taste. The review model also lets readers decide on whether or not they would like to spend the effort and time to start a book based on the reviews and ratings from different kinds of users.  The series model allows a reader to search for all the books that are in a series that the reader may be interested in or currently reading.  

Each of these models will connect with at least two other models in order to make create a useful interface that allow access of an instance page from several different locations.

# Running and Developing

This section details the structure of our project and our workflow. We utilize many different tools through distinct phases to run and test the project. During phase one of the project, there were not too many files we had to track and take care of. Becuase the project required for us to use Flask for the project, minimally, we created static HTML "templates" to render the webpage "view". To build and run the server all we had to do was to run the command:

```
$ python BetterReads.py
```
Python will compile, build, and run the server through the BetterReads.py file that hosted that source code for running the Flask server. For a minimum set up: Flask searches for two folders: "static" and "templates". The "static" folder holds all of our static assets and static components of the website. The latter "templates" holds all our static html files to render our view. 

We brought a dramatic change for phase 2 of the project with the introduction of React to the project. This brought on new files we had to set up such as webpack.config.js, index.html, package.json, npm, and App.js. First and foremost, our group had decided to use npm - which was a package manager that installs all the necessary packages that we need. Becuase npm works alongside the package.json files, we were required to define all the packages that we need into the project. This allows us to work on different computers that have npm installed. By running the command:
```
$ npm install
```
We can install all the necessary packages we need to compile and run the project. To allow React to work, we also had to set up our webpack.config.js file, which is just a bundler that takes modules with dependencies and generates static assets for them, and in turn reduces overhead. Scripts can also be defined in the package.json file which we used to help with our workflow. We introduced the script that combines the following commands to run the project.
```
$ webpack
$ python BetterReads.py
```
into
```
$ npm start
```
# API

We will scrape from the APIs of Goodreads and The New York Times.  The APIs will provide json files that we will use to populate our pages through python.

For this phase of the project we currently used manually filled json files to simulate the data scraped from the APIs. Flask will read in the data from the json files and redirect the data to our web application through a Python script.

For the second phase of the project we scraped from two APIs: GoodreadsAPI and the Times Developer Network.  We used the information from these APIs in order to create our own database using SQLAlchemy. The majority of the information for each model's attributes is obtained from Goodreads. However, we first use the New York Times API as a starting point to determine what books to look for in the Goodreads database leading to our database containing better reads. We then implemented our own API with which others can use to scrape from themselves.  

### Goodreads API

The Goodreads API allows developers to access data from the goodreads database. From the API we are pulling information we need such as an author of a book, the book itself, series of books. In addition to book attributes we include goodread account users and their reviews on books. This feature on Goodreads is important to us because it is one of the factors that book readers factor in before buying or investing their money and time into a book. In order to pull and scrape from the Goodreads API, they require a developer key. An issue with the Goodreads API is the inability to navigate from a book to its list of reviews, so we can look up a review and find the book associated with it but we are unable to navigate backwards if we had retrieved the book from a different location. 

### The New York Times API

The New York Times API allows us to access book metadata to pull data about only bestselling books and their information such as the author of the book, the title and other important attributes that we want to include in our models.  The New York Times API also allows us to access lists of books such that we can organize and filter books by important attributes or genres.  Like the Goodreads API, the New York Times API requires a developer API key in order to make requests.  The New York Times API is where will are pulling our main source of books which we are then accessing in the Goodreads API in order to add additional information that is relevant ot a series, author, book, or reivew.


# Database and Models

We have implemented a database that holds the information for our models and their relevant attributes for our Betterreads site. By utilizing the public API's from Goodreads and New York Times, we were able to merge them and use them for our API.  

### Books

Books are works written by writers to portray some sort of story or information. Each instance of a book includes the attributes of title, list, description, small icon, large icon, published date, rating, series, reviews, and authors.  The image of the book cover is the multimedia that we have used for the book image page so that a book can be easily identified and to add interest to the page as a whole.  The books model is connected to all of the other three models: authors, series, and reviews. The relationship between the books and authors is a many to many relationship so it is stored in the association table books_author_assoc.  The main source for our book data is from the New York Times API.

### Authors

The Authors model will feature writers of original works - each instance of an author includes the attributes of name, description, hometown, small icon, large icon, books, series. The author model is connected to the books and the series models so that the user can find other books they may be interested in based on the writing style and subject of the author. We have included an image of the author as our multimedia for the author instance page in order to make the page more readable by adding a break for the user's eye. The relationship between the books and authors is a many to many relationship so it is stored in the association table books_author_assoc. The relationship between books and series is also a many to many relationship and is stored in the association table series_author_assoc.

### Series

The Series model will include books in a sequence that contain similar characteristics and can be formally identified as a group. We have included this model so that the user can easily find the next books in a subject and author they are interested in. Each instance of a series includes the attributes of books, author, name, and the number of books in the series. We include the images of the books from our book attibute in order to make the page more appealing with multimedia and easier to navigate with the larger icons than a simple text link.  The series model is connected to the author and book models. The relationship between books and series is a many to many relationship and is stored in the association table series_author_assoc.

### Reviews
Reviews are opinions left behind users to either praise or criticise a book.  This model is useful to the user in that they can decide whether a novel is worth their time and money based on the opinions that others have on a book.  Each instance of a review includes the attributes of user, review, rating, spoiler_flag, date_added, book, and author.  The book for a review can be identified by an image as the multimedia for our review page.  The large image of the book title makes the context of the page easier to read as a whole.  The reviews model is connected to the author and the book models.

# Filtering and Sorting

In order to add sorting functionality to our model pages, we defined and implemented JavaScript sort functions unique to each one of our models.  For books, authors, and series, we implemented sort functions that would sort (ascending/descending) all of the instances displayed for each model based on their names in the alphabetical order. For the reviews, we implemented sort functions based on the rating in each review since that would be more practical than sorting the reviews based on the users' names.

for implementing the filtering functionality we had to add the filter buttons provided to the users dynamically since the filter functions had to be unique to each model. As a result, we implemented the filter methods unique to each model and the filter functionality. For instance, for books, we added filter functions that would show only top rated books or only books that are part of a series, and for authors, we provided a filter function that would go through all of the author's book and find the averge rating of that author's books to display only top rated authors. For series, we have filter methods that display series with a low or high number of volumes, and for reviews, we have filters that would display low or high rated reviews only.

# Pagination
To provide a unique grid-experience for the users' we implemented pagination to minimize scrolling. This provides a nice viewing experience for users as an alternative to scrolling down one page. We utilized a React library called "react-pagination" to help us set up pagination. This library is useful since it can be utilized with some properties right out of the box. The only thing left we had to do was connect our models with the pagination. We set up a function to handle the page changes and set up two arrays; one to represent all of our instances for one model, and one array to keep track of the number of items that should be on a page. Whenever the page would change we would change the offset to the current page multipled by the number of items that should be on that page. This also updates the view layer everytime we call the function so we can view the change without refreshing the page.

# Search 
To provide user's a way to search for instances on a model page, we implemented search with a html form element. In the html form, we keep track of the search "value" inside the box as a state. Once the user hits search, it calls a function and passes in the search value. We utilized regex and match the value with any part of any attribute for an instance. If we find a hit, we push it into our data array (where we keep all the instances) and update the view layer. We also utilized the "react-highlighter" package to highlight the search value on the model page. User's can also research if the results don't satsify their tastes.

# Tools

### Flask
Flask is a micro framework written in Python which makes use of the Jinja2 template engine. Jinja2 allows for python code to exist simultaneously inside a html file and perform functions. Flask is considered a micro framework since it does not require extra tools or libraries. It’s lightweight feature is perfect for our website since it will hold just a database and some extra data. Flask will be used for most of the back-end to configure the routing and manipulating the database for the first phase of the project.
### React
React is a Javascript library currently being maintained by Facebook, and its purpose is to create user interfaces. The main features behind React are UI components which are reusable. A component in React is highly customizable, (creating your own HTML element) and can be reused through javascript files. React is useful in our project since we can reuse components throughout the frontend to create simple design and cleaner efficient code. We use React in conjunction with webpack and babel to build the code.
### PlanIT Poker
Planit poker, or scrum poker is a “fun” way for teams to estimate time periods for “user stories” or development goals for a project. Members on a team will create stories and members will vote on how long they think the story will take to finish. We used planIT poker to effectively manage our time and worked out what we thought would be the most important features to implement.
### Trello
Trello is a collaboration tool that organizes projects into boards. Boards consist of cards and lists which allows users to type out and plan projects in a lot of different ways. Cards allow users to be assigned which allows the team to oversee who is working on what for a efficient and smooth workflow. In Trello, we have lists which indicate progress on a goal we have in a project which allows us to see what needs to be completed. We also have an issues list to indicate any issues that needs to be work on that might affect the project as a whole.
### Github
GitHub is a version control system which allows for individuals or groups to make and view revisions to source code. We utilize GitHub to push code and pull the latest code from the project. 
### Slack
Slack (Searchable Log of All Conversation and Knowledge)  is a cloud-based collaboration tool. Slack offers app integration, direct and private messaging, chat rooms, third-party services and searchability. On the team, we use slack primarily as a communication tool. This helps our team set up meetings and to communicate outside of meetings. Since slack is compatible on desktop clients and mobile clients, its versatility helps us communicate our messages. File transfer is also used in moderation to transfer snippets of code, media, or other applicable files. Trello and Git are integrated into the project to help monitor progress and workflow. 
### Apiary
Apiary is a API design platform. Apiary allows us to design a prototype of an API frame before implementing the API. It also serves to generate documentation for the API.
### Webpack
Webpack is a bundler that puts all assets, such as Javascript, images, CSS, fonts, and other static assets into a dependency graph. Webpack also allows for require() in local files and customization in the single Javascript file that Webpack bundles. We utilize webpack to build our front-end code and bundle our static assets.
### Node Package Manager
Node Package Manager or NPM for short allows for developers to reuse code and set up environments easily. The Node Package Manager utilizes what are called node modules (which are just a package of files or reusable code). These modules are listed in a file named package.json file that other people can install by using the “npm install” command to install all necessary packages. NPM is useful since it allows us to download the packages we need on any machine. In this project we utilize react, babel, webpack, and  loader packages in our package.json file.
### Babel
a transpiler that transform modern Javascript code (ES6) into javascript code that a browser can interpret and run. We use this in conjunction with webpack and React to transpile our React components and javascript code for browser readability and compatibility. 
### Virtualenv
Virtualenv is a tool that allows for isolated Python environments. It addresses the issues with dependencies and versions of different applications, libraries, and packages. This allows for working with different projects that depend on different versions of an application. Virtualenv was primarily used to download and install flask, since it was unnecessary to download and install Flask onto the computer for one project.
### Bootstrap
Bootstrap is a open source web framework created by Twitter. Inside Bootstrap contains an HTML, CSS, and JS framework to develop a responsive website. The components we took from bootstrap heavily influenced our front-end and design.
### Namecheap
Namecheap is a tool for registering a domain name, which is provided to students for free. In order to get the domain name to work for your platform you need to add a custom domain name to your hosting service. In the case of hosting your web application on Google Cloud Platform you can navigate to App Engine, Setting, Custom Domains, and Add a Custom Domain. Google Cloud Platform then will provide you with the additional steps that you need to take in order to get your domain name to work. You also need to go to your account’s dashboard on Namecheap and manage your domain name so that it can connect to Google Cloud Platform. You need to go to the Advanced DNS setting for your domain and add the required A, AAAA, CNAME, and TXT records in order to make your domain name fully functional and in sync with your App Engine application.
### Python
Python is a high-level programming language we used for the backend portion of our project that works well with Flask in order to scrape data from the APIs and make use of the information in our site.
### JSON
We chose to use flask’s json class to import our information in a json file into a dictionary. 
### Frontend
* HTML5 - standard markup language we used so that our application could be rendered into intractable/viewable multimedia web pages.

* CSS3 - style sheet language used to unify the interface of our application in addition to making the look of our interface easy to manage and update.

* Javascript - programming language used to make our web application interactive.
### Google Cloud Platform
Through Google’s App engine we can host our application through the Google Cloud Platform.
### Box
A file hosting service used to host our technical report pdf so that we can collaboratively edit the report and link to it on our web application for anyone who is interested on how we have built our website to view it and have a frame of reference.
### Jinja2
A template engine working with python used for being able to automatically generate web pages based on the scraped data collected from the APIs.
### AutoPEP8
a formatting tool used for Python scripts to unify the format of the code to make it readable and understandable to everyone in the team.
### Sublime Text 2
Sublime Text is a proprietary cross-platform source code editor with a Python application programming interface (API). It natively supports many programming languages and markup languages, and functions can be added by users with plugins, typically community-built and maintained under free-software licenses.
### Vim
Vim is a highly configurable text editor built to enable efficient text editing. It is an improved version of the vi editor distributed with most UNIX systems. Vim is a very lightweight editor that does not take up too much space.
### Pylint
Pylint is a source code, bug and quality checker for the Python programming language. It follows the style recommended by PEP 8, the Python style guide. Since Pylint follows the PEP8 style, it makes it less of a hassle organizing our code to maintain a modern coding style. 

### Pydoc
The pydoc module automatically generates documentation from Python modules. The documentation can be presented as pages of text on the console, served to a Web browser, or saved to HTML files.

### Unittest
Python unit testing framework we used in order to verify that our script functions correctly and as expected.
### Python PIP
Python Package Manager used to manage Python packages.
### SourceTree
Github GUI by Atlassian used to track commits, file status, changes, etc.

### SQLAlchemy
SQLAlchemy is a python sql toolkit and object relational mapper. It was used in this project to create, insert, and query the database. 
### Sqlite3
Sqlite3 is a sql database engine. We used this in order to host our database and then managed it with sqlalchemy.  

# Hosting

Google App Engine is a web framework and cloud computing platform for developing and hosting web applications through Google-managed data centers. In order for our team to host a website on the Google App Engine, we had to create developer accounts through our gmail accounts. 

Setting up on Google App Engine requires the application files, an app.yaml file, and the google software development kit (sdk). The google sdk gives us access to tools that allows us to manage our resources and applications hosted on the Google App Platform. Gcloud, gsutil, and bq, are 3 of the many commands that come with the google sdk for the purpose of hosting our application. 

The Google App Engine also requires an app.yaml file that lives in the root directory of the project folder. This configuration file tells the App Engine how to map URLs to our files. App.yaml requires handlers to load static files.

When ready to deploy we can run the following command “gcloud app deploy” from the root directory of our project and deploy it into the Google App Engine. Optionally, we can add a --project or a -v flag to specify a specific version of the project or choose an alternate project to deploy. 

As a test we can view the app through http://[YOUR_PROJECT_ID].appspot.com by running the following command “gcloud app browse” to test its functionality.

With the project up and running, we can set our custom domain betterreads.me through the app engine that we used from Namecheap. Namecheap is the tool we are using to host the url of our site. 