# idb
SWE IDB Project. A website that displays a book database
Slack integrated
Trello integrated

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

Next if you haven't already you can set up Flask through a virtual environment. What this means is that we can install python packages that we will need for this project only. In other words it won't be installed through your desktop. To start you can install the virtual environment by doing and start it by running

```
$ virtualenv venv
$ source venv/bin/activate
```
Next you will want to install the necessary files (Flask and etc.)
```
$ pip install -r requirements.txt
```
The project is now ready to test locally! Anytime you want to quit the virtual environment you can do
```
$ deactivate
```

### Running the project locally

Whenever you want to run the project code Run the following command:
```
$ npm start
```

you can view the npm script in the package.json file. npm start runs both webpack and python BetterReads.py.

webpack bundles the react and other code (think compiling and building the code) while the latter command runs the server locally.

By utlizing the package "concurrently" we can run webpack --watch to watch for changed assets (react files) while running our Flask Betterreads.py file (server, also checks for changes in the python file). 

You can still use npm start to start the script and that's it! No more stopping the server and running the command over and over again. Also do note you have to **ignore cache refresh** on your browser. Below you can see the commands for future reference. 

* Mac: Hold both the ⌘ Cmd and ⇧ Shift keys and press the R key 
* Windows: Hold the Ctrl key and press the F5 key.
* Safari : Opt+Cmd+E , Cmd + R or Safari > Empty cache and then refresh

An example for an efficient workflow goes like this : 

```
$ npm start
- open incognito tab (haven't tested in regular browser):
- make a change
- hard refresh using one of the commands above
- see the change
- kill process if terminal needs to be used.
```

### Testing the project

Whenever you want to test the project with the tests in the project folder run:
```
$ npm test
```

This script runs Test_Api.py, Test_Betterreads.py, and Test_GUI.py. Look inside those files to see what sort of tests are running for the file.


### Hosting the project on GAE
Visit the link [https://cloud.google.com/appengine/docs/standard/python/getting-started/python-standard-env](https://cloud.google.com/appengine/docs/standard/python/getting-started/python-standard-env)

and follow the instructions that follow. Make sure before deploying run:
```
$ npm start
$ npm install
$ pip install -t lib -r requirements.txt
```
to have all assets built and all necessary packages installed before deploying. Requirements.txt should always be updated whenever there is a new python package introduced.
