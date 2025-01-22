const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();


const events = [];
app.use(bodyParser.json());



app.use('/graphAPI', graphqlHTTP({
    schema: buildSchema(`
        type Event{
            _id :ID!
            title:String!
            description:String!
            date:String!
            price : Float!
        }

        input EventInput{
            title:String!
            description:String!
            price : Float!
        }

        type QueryRoot{
            events : [Event!]!
        }

        type MutationRoot{
            createEvent(eventInput : EventInput!) : Event
        }

        schema {
            query:QueryRoot
            mutation:MutationRoot
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },

        createEvent: (args) => {
            const event = {
                _id: events.length + 1,
                title: args.eventInput.title,
                description: args.eventInput.description,
                date: new Date().toISOString(),
                price: +args.eventInput.price
            }
            events.push(event);
            console.log(events);
            return event;
        }
    },
    graphiql: true,
}))
console.log(events);

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection failed', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});