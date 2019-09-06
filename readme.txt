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