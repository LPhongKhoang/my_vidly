const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");

describe('Generate Auth token', () => {
  it("should return payload like the one have pass to params", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: false 
    };
    const user = new User(payload);
    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, config.get("jwtSecretKey"));
    expect(decoded).toMatchObject(payload);
  })
});