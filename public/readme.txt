0. ========== Set up MongoDB ======
1. download mongodb
2. install -> set the system variable (path) -> run ">> mongod"
3. Make sure: C:/data/db folder is created (By default, mongodb store data in that folder)

I. === Authentication and Authorization ========
1. Create User model
2. Create User api
  a. Create new User
    + Validate req.body
    + Check existence of User
    + Create new User and save
    + return new User(name, email)
  b. Use "Lodash" lib to work with Object
  c. Encrtype password when save User to db
    + use "bcrypt" lib for hashing
  d. Send token (jwt) when user login successfully
    + use "jsonwebtoken" lib for generate token: jwt.sign(payload, secretkey);
  e. Use "config" lib for working with environment variables (Store some secret keys)
  f. Also send token (in header of response) when user just sign in successfully
3. Encapsulating logics in mongoose model
  a. Want the model (mongoose) has method? ==> add method to it's schema
4. Authentication
  a. Create middleware function (like Filter, Interceptor in Java)
    + Verify req.header('x-auth-token') ==> use "jwt"
    + If wrong => 400 bad request
5. Create api endpoint that return current user info
  + uri of api: /api/users/me
  + validate token from req.header
  + get userId from payload of jwt token
  + access db to get user's data
6. How about logout?
  + In this context of project, we don't store any session or token in the server
  + Just need to delete token store in client
  + @Extra: if we really need to store token in database --> hash it like password
7. Implement: Role base authorization
  a. Add isAdmin property to UserSchema
  b. Create middleware function admin (validate property isAdmin from payload of req.header("x-auth-token"))
  c. Test: apply array of middlewares in "delete genre" api
  d. For other applications: we can store roles : [string], operattions: [string] for authorization
II. Handling and Logging Error
1. Handling Error
  a. Can use try_catch block
  b. Use error middleware at the end of handlers list (app.use(...))
    + special middleware function in express
    + format: function(err, req, res, next);
    ==> help us to move all catch blocks to one place
    ==> still need to repeat pattern try_catch ==> improvement next...
  c. Remove try_catch block ==> use wrapper function
    ==> still have to remember to call wrapper function in each route
    ==> improvement
  d. Use "express-async-errors" lib
    + load module in index.js (don't have to store result. Just load it)
    + It works like the naive implementation above. We still need part-b (error-middleware)
2. Loggin to file
  a. Use "winston" lib for logging to file
3. Logging to MongoDb
  a. Use "winston-mongodb@3.0.0" lib
  b. Just load it in index.js (It works with "winston" lib)
4. Uncaught Exceptions: (Catch exception in whole app. Not just in Express)
  a. Use "process" global object to subscribe (_.on method) to "uncaughtException" event

III. Refactoring index.js 
  + Extracting Routes, MongoDB, Logging, Config, Validation

IV. Automated Test
  *** Automated Test: (Unit test, Intergation test, End to end test) ***
  1. Unit test is test the unit of an application without its external dependencies
   ==> cheap to write, run very fast
  2. Intergation test is test the application with its external dependencies
    /!\ note: test multiples classes in internal themselves is unit test, not intergation test
  3. End to end: drives an application through their UI 
    + Use tools: Selenium
  4. Test Pyramid
                -End to End-
        ---- Intergation test ----
    ------------- Unit test --------------
    ==> Testing frameworks: "Jamine, Mocha, Jest" ==> we choose "Jest" lib

V. Unit Test: Go into "testing-demo" folder for details
VI. Intergation Test (IT)
  1. Add --verbose flag to > package.json > "scripts" > "test"
  2. Comment out "winston-mongodb" (it has some bugs when we use this lib while testing with "jest")
  3. Setting the TestDB
    + We run IT on the real DB --> but don't want to access to dev or prod DB
    + Config DB connection string for dev mode and test mode
      (note: command for running IT: >> NODE_ENV=test node index.js)
    + app.listen() return Server --> we need to export this server in order to using in test file
    + Use "supertest" lib for sending http request(as Postman)
    + As testing theory, before each test suit, we need to load the state and after that is clear the state
      --> use function in "jest": "beforeEach(cb)" and "afterEach(cb)"
    + Populating the TestDB: Use mongoose modle to insert documents to collection in DB Test
    + Testing routes with params (see in code "tests/intergations/genres.test.js")
  4. Testing Authorization
    + test route "/api/genres/" post method
    + test1: test invalid token
    + test2: test invalid input
    + test3: test happy path
  5. Writting clean test
    + From "Mosh": Define a happy path, then for each test we change params that clearly align to that test
  6. Testing the Auth middleware & Unit test Auth middleware
  7. Code coverage: we can see the code coverage by "jest"
    + package.json > "scripts" > "test" = "jest --watchAll --verbose --coverage"
    + It shows us statics about line of codes --> we know which code need to focus more
  
VII. Test-driven Development (TDD)
  0. Write your test before writing production code ==> "Test first" (Another opposite approach is "Code Frist")
  1. Steps
    + Write a failing test
    + Write the simplest code to make the test pass
    + Refactor if necessary

    Repeat these step over and over again util we pass all requirements
    ===> 
  2. Benefits
    + Testable source code
    + Full coverage by tests
    + Simpler implementations
VII. Pratice TDD
  1. Implementing the returns movie features
    + handle that in new route ("/api/returns" { customerId, movieId }) instead of PUT("/api/rentals")
    + Test cases
      - Tc1: return 401 if token is invalid
      - Tc2: return 400 if customerId is not provided
      - Tc3: return 400 if movieId is not provided
      - Tc4: return 404 if rental not found with customer-movie provided
      - Tc5: return 400 if rental is already processed
      - Tc6: return 200 if rental is found
      - Tc7: set dateReturned 
      - Tc8: Calculate the rentalFee
      - Tc9: Increase movie's number in stock
      - Tc10: Return the rental 
    + Write initial state of Database in returns.test.js (or populate DB)
    + Use "moment" lib to work with date time
IX. Deployment
  1. Two options for deployment:
    + Deploy use PaaS (Platform as a service provider): 
      - Heroku, Google Cloud Platform, AWS, Azure 
      ==> Great option if you don't want to be involved with infrastructure
        - Server, Load balancer, Reverse proxy or Restarting the app when crash
    + Docker: want to control your app deployment (deploy to your own server)
X. Deploy to Heroku
    1. Prepare code for production
      + Use "helmet" lib to ... middleware bla bla
      + Use "compression" lib to compress http req, res
    2. Getting started with Heroku: download, use ">> heroku login" to login in cli
    3. Preparing the app for deployment
      + package > "scripts" > "start"="node index.js"
      + define version of node:
        package > "engines" > "node"="x.y.z"
      + Must init git repo (just need a local) for this project
    4. Deploying to Heroku
      + in cmd of the project (local): ">> heroku create [unique_app_name]" for creating an app on Heroku and git remote   
      + push code to heroku remote repo: ">> git push heroku master"
    5. Fix common and usual problems
      + Use ">> heroku logs" to see stack trace of errors 
      + Or go to the dashboard on the web heroku to see errors
      + Or on the web heroku: run console to see file we have logged
        (More > Run Console > 'bash' > 'ls' > 'cat uncaughtException')
    6. Setting environment variables in Heroku Server
      + in cmd of the project (local): ">> heroku config:set my_vidly_jwtSecretKey=xyzblabla
      + set NODE_ENV for production: ">> heroku config:set NODE_ENV=production"
      + To see all environment variables: ">> heroku config"
      + ==> In Heroku Cloud Architecture
                Server (dyno1, dyno2, ...)
                These dynos share environment variables
    7. MongoDB in Cloud:
      + Web Heroku: "Resources tab -> Find more add-ons btn ->  Data Stores link -> mLab MongoDB" ...
      + Next is to create DB in Cloud (AWS, Azure, etc)
      + Need to create free account on "mlab.com" website
      + Go "mlab.com/home" --> 
      + "create new btn -> AWS -> Sandbox (free) ->  create DB -> Create user for db -> get conStr -> add to config"
        (use enviroment variable for db conStr)

    