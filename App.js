const express =  require('express');
const bodyParser = require ('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const  Event = require("./models/event");

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

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            return events;
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: Date.now(args.eventInput.date)
            })
            return event.save()
            .then(result => {
                console.log(result);
                return {...result._doc};
            })
            .catch(err => {
                console.log(err);
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
