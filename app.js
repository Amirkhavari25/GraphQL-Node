const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Event = require('./models/event');
const User = require('./models/user');
const app = express();



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
        type User{
            _id :ID!
            email:String!
            password:String
        }

        input EventInput{
            title:String!
            description:String!
            price : Float!
        }

        input UserInput{
            email:String!
            password:String!
        }

        type QueryRoot{
            events : [Event!]!
        }

        type MutationRoot{
            createEvent(eventInput : EventInput!) : Event
            registerUser(userInput:UserInput!) : User
        }

        schema {
            query:QueryRoot
            mutation:MutationRoot
        }
    `),
    rootValue: {
        events: async () => {
            try {
                const events = await Event.find();
                return events.map(event => ({
                    ...event._doc,
                    _id: event.id,
                    date: event._doc.date.toISOString()
                }));
            } catch (err) {
                console.error("Error fetching events:", err);
                throw err;
            }
        },

        createEvent: async (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                date: new Date(),
                price: +args.eventInput.price,
                //later take creator from token payload
                creator: '6793812a5dbf49060ad4a2e4'
            });
            try {
                const user = await User.findById(event.creator);
                if (!user) {
                    throw new Error('User not found');
                }
                user.createdEvent.push(event);
                await user.save();
                const result = await event.save();
                return {
                    ...result._doc,
                    _id: result.id,
                    date: result._doc.date.toISOString()
                };
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
        registerUser: async (args) => {
            try {
                const existUser = await User.findOne({ email: args.userInput.email });
                if (existUser) {
                    throw new Error('User already exists');
                }
                const hashedPAssword = await bcrypt.hash(args.userInput.password, 12);
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPAssword
                })
                const result = await user.save();
                return { ...result._doc, _id: result.id, password: null };
            } catch (err) {
                throw err;
            }
        }

    },
    graphiql: true,
}))

mongoose.connect('mongodb://127.0.0.1:27017/GraphQl_DB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection failed', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});