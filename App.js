const express =  require('express');
const bodyParser = require ('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const  Event = require("./models/event");
const  User = require("./models/user");

const app = express();

app.use(bodyParser.json());

app.use('/api/v1', graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            return Event.find()
            .then( events =>{
                return events.map(event => {
                    return { ...event._doc, _id:event._doc._id.toString()};
                })
            })
            .catch( err=> {
                throw err;
            })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: Date.now(args.eventInput.date),
                creator: '5fde20131964b6469cb9c398'
            })
            let createdEvent;
            return event.save()
            .then(result => {
                createdEvent = { ...result._doc, _id: event._doc._id.toString() };
                return User.findById('5fde20131964b6469cb9c398')
            })
            .then(user =>{
                if (!user) {
                    throw new Error('User not found')
                }
                user.createdEvents.push(event);
                return user.save()
            })
            .then(result =>{
                return createdEvent;
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
        },
        createUser : args => {
            return User.findOne({email: args.userInput.email}).then(user=>{
                if(user){
                    throw new Error('User exists already')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword =>{
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return { ...result._doc, password: null, _id: result.id };
            })
            .catch(err => {
                throw err;
            })
        }
    },
    graphiql : true
}));

/* DataBase Config */
const db = require('./config/keys').mongoURI;

/* Connect to MongoDB */
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
