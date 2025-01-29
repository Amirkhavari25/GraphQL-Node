const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect('mongodb://127.0.0.1:27017/GraphQl_DB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection failed', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
