const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); // اصلاح این خط
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphAPI', graphqlHTTP({
    schema: buildSchema(`
        type QueryRoot{
            users : [String!]!
        }

        type MutationRoot{
            createUser(name:String) : String
        }

        schema {
            query:QueryRoot
            mutation:MutationRoot
        }
    `),
    rootValue: {
        users: () => {
            return ['user1', 'user2'];
        },
        createUser: (args) => {
            return args.name;
        }
    },
    graphiql: true,
}))


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});