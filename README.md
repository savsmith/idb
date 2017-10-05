# idb
SWE IDB Project. A website that displays a book database
Slack integrated
Trello integrated

### Phase 2 New Files and Packages
* npm 
* babel
* webpack
* bundle.js
* index.html
* package.json
* loaders
* react
* react-bootstrap
* react-router-dom
* app.js

###### npm
NPM is a package manager useful for downloading javascript packages and libraries.

###### babel
babel is a transpiler that turns (ES6) or a modern version of javascript into javascript code that is readable by web browsers. In this project it will be used as a webpack plugin

###### webpack
webpack is a bundler that takes modules with dependencies and generates static assets for them. It will be output into bundle.js where it can read that code. This is nice since it reduces overhead

###### bundle.js
as mentioned bundle.js is a file that webpack bundles into javascript. This includes the react code.

###### index.html
the html file that flask will render the template for. index.html will get javascript(React) files from the static/js folder. Webpack and babel are used to create the bundled React code.

###### package.json
Basically a NPM configuration make file. Listing all your packages here will help install necessary packages for testing or loadign the project on different machines.

###### loaders
in npm and the webpack config files, they are what transform the modules.

###### react, react-bootstrap, react-router-dom
react packages listed in npm.

###### App.js
our base Reactfile. We can create components and render them here, routing can be set up there as well

### Installing the packages

First and foremost download npm if you havent already at [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)

Next navigate to the project directory with the package.json file and type the following command:
```
$ npm install
```

npm install allows you to install all the packages necessary so far to run the project. This is extremely helpful if projects are worked on different machines.

If you want to install new packages specific to this file you can run
``` 
$ npm install <package-name> --save
```
This installs the package and saves it into the package.json file so others can install it through npm install.

### Testing the project locally

Whenever you want to test the project code Run the following two commands:
```
$ webpack
```
```
$ python betterreads.py
```

webpack bundles the react and other code (think compiling and building the code) while the latter command runs the server locally.

I'm not sure if theres an easier way around this to where we can run the react code separately or not... (I will look into it) but you will have to run these two commands each and every time you make a change... :(
