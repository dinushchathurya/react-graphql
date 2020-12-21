const Event = require('../../models/event');
const { transformEvent } = require('../resolvers/merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event);
            })
        } catch (err) {
            throw err;
        }
    },

    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: Date.now(args.eventInput.date),
            creator: '5fdee45b4f8d04608cc780fe'
        })
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = transformEvent(result);
            const creator = await User.findById('5fdee45b4f8d04608cc780fe');
            if (!creator) {
                throw new Error('User not found')
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}