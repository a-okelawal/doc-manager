# Document Manager
This is a document management system.

The system manages documents, users and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published.


Users are categorized by roles. Each user must have a role defined for them.

## Requirements
- Clone or Download and unzip into a folder.
- Open the command line and cd into the folder.
- Type in ```npm install```.
- You can install nodemon and run the ```nodemon``` command to run it or just type in ```node server.js```.
- You can also test it by typing ```npm test```.

## How To Use
- Login with the route '/api/users/login' using the 'admin' as username and password.
- You can use the following routes:
  - **'/api/users'**:
    - **GET** retrieves all the users.
    - **POST** creates a new user once all the required fields are given.
    - **DELETE** deletes a new user using the username.

  - **'/api/users/:username'**:
    - **GET** returns the user with that username.
    - **PUT** updates the user, that has the username, with any field given.
    - **DELETE** deletes the particular user with that username.

  - **'/api/users/login'**:
    - **POST** logs in a user.

  - **'/api/users/logout'**:
    - **POST** logs out a user

  - **'/api/documents'**:
    - **GET** retrieves all the documents in descending order of when they were created.
    - **POST** creates a new document once all the required fields are given.
    - **DELETE** deletes a new document using the title.

  - **'/api/documents/:title'**:
    - **GET** returns the document with that title.
    - **PUT** updates the document, that has the title, with any field given.
    - **DELETE** deletes the particular document with that title.

  - **'/api/users/:id/documents'**:
    - **GET** retrieves all the documents owner by this user or is public.

  - **'/api/roles'**:
    - **GET** retrieves all roles.
    - **POST** creates a new role once all the required fields are given.
    - **DELETE** deletes a the role using the title.
