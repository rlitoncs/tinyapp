//==============================================================================
// Dependencies
//==============================================================================
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

//==============================================================================
// Test Cases
//==============================================================================

describe("Login and Access Control Test", () => {

  //1.  GET /, a user should be redirected to /login if they are not logged in
  it('should return 302 status code when user tries to access "http://localhost:8000/" and they are not logged in, redirect user to the login page', () => {
    const agent = chai.request.agent("http://localhost:8000");

    return agent
      .get("/")
      .redirects(0)
      .then((res) => {
        expect(res).to.have.status(302);
      });

    //without the .redirects(0), res will show the final response which is status 200. With .redirects(0), it instructs Chai HTTP not to automatically follow any redirects. Tells Chai HTTP to stop the request and respond with the redirect response instead of automatically following the redirect.
  });

  //2.  GET /urls/new, a user should be redirected to /login if they are not logged in
  it('should return 302 status code when user tries to access "http://localhost:8000/urls/new" and they are not logged in, redirects user to the login page', () => {
    const agent = chai.request.agent("http://localhost:8000");

    return agent
      .get("/urls/new")
      .redirects(0)
      .then((res) => {
        expect(res).to.have.status(302);
      });
  });

  //3.  GET /urls/:id, a user should see an error message if they are not logged in
  it('should return 404 status code when user tries to access "http://localhost:8000/urls/NOTEXISTS" and they are not logged in ', () => {
    const agent = chai.request.agent("http://localhost:8000");

    return agent
      .get("/urls/NOTEXISTS")
      .then((res) => {
        expect(res).to.have.status(404);
      });
  });

  //4.  GET /urls/:id, a user should see an error message if the URL doesn't exist
  it('should return 403 status code when user tries to access "http://localhost:8000/urls/abc" and they are logged in ', () => {
    const agent = chai.request.agent("http://localhost:8000");

    return agent
      .post("/login")
      .send({ email: "a@example.com", password: "123" })
      .then((loginRes) => {
        return agent.get("/urls/abc").then((accessRes) => {
          expect(accessRes).to.have.status(403);
        });
      });
  });

  // 5. GET /urls/:id, a user should see an error message if they do not own the URL
  it('should return 403 status code for unauthorized access to "http://localhost:8000/urls/b2xVn2"', () => {
    const agent = chai.request.agent("http://localhost:8000");

    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          expect(accessRes).to.have.status(403);
        });
      });
  });

  // POST /urls/:id, a logged in user should see an error message if they do not own the URL
  it('should return 404 status code when user is logged in and tries to edit a URL it does not own, "http://localhost:8000/urls/abc"', () => {
    const agent = chai.request.agent("http://localhost:8000");

    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        return agent.post("/urls/abc").then((accessRes) => {
          expect(accessRes).to.have.status(404);
        });
      });
  });
});