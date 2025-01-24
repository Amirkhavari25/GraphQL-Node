const bcrypt = require('bcrypt');
const Event = require('../../models/event');
const User = require('../../models/user');


const getEvents = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        if (!events) {
            return null;
        }
        return events.map(event => {
            return { ...event._doc, _id: event.id, creator: findUserById.bind(this, event._doc.creator) };
        });
    } catch (err) {
        throw err;
    }
}

const findUserById = async (userId) => {
    try {
        const result = await User.findById(userId);
        if (!result) {
            throw new Error('User not found');
        }
        return { ...result._doc, _id: result.id, password: null, createdEvent: getEvents.bind(this, result._doc.createdEvent) };
    } catch (err) {
        throw err;
    }
}


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => ({
                ...event._doc,
                _id: event.id,
                date: event._doc.date.toISOString(),
                creator: findUserById.bind(this, event.creator),
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
                date: result._doc.date.toISOString(),
                creator: findUserById.bind(this, result._doc.creator)
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

};