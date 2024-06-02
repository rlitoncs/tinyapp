const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Login and Access Control Test", () => {

  //1.  GET /, a user should be redirected to /login if they are not logged in
  it('should return 302 status code when user tries to access "http://localhost:8000/" and they are not logged in, redirect user to the login page', () => {
    const agent = chai.request.agent("http://localhost:8000");

    return agent
      .get("/")
      .redirects(0) 
      .then((res) => {
        expect(res).to.have.status(302);
      })

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

  it('should return 403 status code for unauthorized access to "http://localhost:8000/urls/b2xVn2"', () => {
    const agent = chai.request.agent("http://localhost:8000");

    // 5. GET /urls/:id, a user should see an error message if they do not own the URL
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });

  it('should return 404 status code when user is logged in and tries to edit a URL it does not own, "http://localhost:8000/urls/abc"', () => {
    const agent = chai.request.agent("http://localhost:8000");

    // POST /urls/:id, a logged in user should see an error message if they do not own the URL
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a POST request to a protected resource
        return agent.post("/urls/abc").then((accessRes) => {
          // Step 3: Expect the status code to be 404
          expect(accessRes).to.have.status(404);
        });
      });
  });



});
