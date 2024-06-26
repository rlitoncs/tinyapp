# TinyApp

TinyApp is a full stack web application built with Node and Express. It gives users the ability to shorten long link URLs much like [bit.ly](https://bitly.com/) 

## Final Product
!["Create Tiny URL"](https://github.com/rlitoncs/tinyapp/blob/main/docs/create-tinyURL-page.png?raw=true)
!["TinyApp My URLs Page"](https://github.com/rlitoncs/tinyapp/blob/main/docs/urls-page.png?raw=true)
!["Register Account"](https://github.com/rlitoncs/tinyapp/blob/main/docs/register-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Set-Up
- First `git clone` the repository to your local machine
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` or `node express_server.js` command.

## Instructions
### Create New Short URL
- Login or Register into TinyApp
- Press on the `Create New URL` tab located on the header
- Enter and Submit the desired long URL
- The shorterned URL will now appear. Users will now have a clickable short URL that will also be saved in their `My URLs` tab

### Update/Edit a Short URL
- Go to `My URLs` tab located on the header
- Press on `Edit`
- Enter and Submit the new long URL
- The short URL will now display the new long URL that was provided

### Delete a Short URL
- Go to `My URLs` tab located on the header
- Press on `Delete`
- The short URL is now deleted from the user's profile 
