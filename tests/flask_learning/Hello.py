from flask import Flask, redirect, url_for, request, render_template, make_response
app = Flask(__name__)

@app.route('/')
def index():
   return render_template("index.html")
   
#This URL is localhost:5000/goodbye
@app.route('/goodbye')
def goodbye():
   return 'Goodbye!'

#< variable > is how you create dynamic urls

#Works for paths
@app.route('/hello/<name>')
def hello_name(name):
   return 'Hello %s!' % name

#Works for ints
@app.route('/blog/<int:postID>')
def show_blog(postID):
   return 'Blog Number %d' % postID

#Works for floats
@app.route('/rev/<float:revNo>')
def revision(revNo):
   return 'Revision Number %f' % revNo

#url_for() function. Accepts name of function, 0..* args that correspond to variable part of URL
@app.route('/admin')
def hello_admin():
   return 'Hello Admin'

@app.route('/guest/<guest>')
def hello_guest(guest):
   return 'Hello %s as Guest' % guest

@app.route('/user/<name>')
def hello_user(name):
   if name == 'admin':
      return redirect(url_for('hello_admin'))
 
# HTML methods
# GET = send data
# HEAD = same as GET without response body
# POST = send html data
# PUT = replaces resource
# DELETE = deletes resource

@app.route('/success/<name>')
def success(name):
   return 'Welcome %s' % name

#This function will do the same thing whether the login.html is a post or get. 
@app.route('/login', methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
      user = request.form['nm']
      return redirect(url_for('success', name = user))
   else:
      user = request.args.get('nm')
      return redirect(url_for('success', name = user))

#We can return in the form of HTML 
#But it is annoying
@app.route('/fancy_hello/')
def fancy_hello():
    return '<html><body><h1>Hello World!</h1></body></html>'

#Use Jinja2 templates
@app.route('/fancy_hello/<user>')
def fancier_hello(user):
    return render_template('hello.html', name = user)

@app.route('/hello/<int:score>')
def hello_score(score):
    return render_template('hello.html', marks = score)

# @app.route('/result')
# def result():
   # dict = {'phy':50,'che':60,'maths':70}
   # return render_template('result.html', result = dict)

#Request Object
#Data from client's web page is sent to server as global request object
#Form = Dict of parameters and values
#args = parsed contents of query string. Part of URL after question mark
#cookies = dict holding cookie name and values
#method = current request method

@app.route('/home')
def student():
    return render_template('student.html')
    
@app.route('/result', methods = ['POST', 'GET'])
def result():
    if request.method == 'POST':
        result = request.form
        return render_template("result.html", result = result)

#Cookies!
#Request object contains cookie's attribute. Dict of cookie keys and vals

#Reading cookie
@app.route('/cookie_reader')
def cookie_reader():
    return render_template('cookie_reader.html')

@app.route('/setcookie', methods = ['POST', 'GET'])
def setcookie():
    if request.method == 'POST':
        user = request.form['nm']
        resp = make_response(render_template('readcookie.html'))
        resp.set_cookie('userID', user)
        
        return resp

@app.route('/getcookie')
def getcookie():
    name = request.cookies.get('userID')
    return '<h1>welcome '+name+'</h1>'

#session data is stored on server
#session is a time interval, the data is stored in a dict
#each session has an id. Data is stored on top of cookies.
#Need a secret key to access


if __name__ == '__main__':
   app.run(debug = True)
