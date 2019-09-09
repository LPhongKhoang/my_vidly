
const mongoose = require("mongoose");
const { User } = require("../../../models/user"); 
const auth = require("../../../middlerware/auth");


describe("Auth Middleware", () => {
  it("Should have payload in request", () => {
    const user = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: false};
    const validToken = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(validToken)
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
})