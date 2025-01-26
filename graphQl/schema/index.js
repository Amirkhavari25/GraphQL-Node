const { buildSchema } = require('graphql');


module.exports = buildSchema(`
type Event{
    _id :ID!
    title:String!
    description:String!
    date:String!
    price : Float!
    creator : User!
}

type Booking{
    _id:ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type User{
    _id :ID!
    email:String!
    password:String
    createdEvent : [Event!]
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
    bookings : [Booking!]!
}

type MutationRoot{
    createEvent(eventInput : EventInput!) : Event
    registerUser(userInput:UserInput!) : User
    bookEvent(eventId:ID!):Booking!
    cancelBooking(bookingId:ID!):Event!
}

schema {
    query:QueryRoot
    mutation:MutationRoot
}
`);