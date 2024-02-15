# Dots-Boxes-Multiplayer-Game

I have uploaded a Demo for this project, for the purpose of recording I have changed the grid size to 2 but you can change the GRID_SIZE to 4
To run back_end these are the commands:
npm install
npm start
To run the backend project, an instance of MongoDB must run on localhost:27017
To run the frontend project, you can use this command :
npm install -g http-server
http-server




I’ve used MongoDB and Mongoose library to persist users and games data in database.
Game entity includes players, turn, board of the game (squares), scores of each player, and user entity contains the selected name of each user.
The User and Game models are defined in the ‘models' directory in the backend project. For each request from the client, I retrieve the needed game or user entity from database using FindOne({“id”: id}) method, make requested changes on the given entity and save it again in the database. 

Please feel free to email me if you face any errors while running the projects.

https://github.com/farajiansamin/Dots-Boxes-Multiplayer-Game/assets/69571890/6f94adab-7f47-4c0e-83a9-3fadfddac863

