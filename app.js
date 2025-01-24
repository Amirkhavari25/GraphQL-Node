const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphSchema = require('./graphQl/schema/index');
const graphResolver = require('./graphQl/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use('/graphAPI', graphqlHTTP({
    schema: graphSchema,
    rootValue: graphResolver,
    graphiql: true,
}))

mongoose.connect('mongodb://127.0.0.1:27017/GraphQl_DB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection failed', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});