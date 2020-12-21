const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('../resolvers/merge');

module.exports = {
    /* fetch booking */
    booking: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (err) {
            throw err;
        }
    },
    /* create booking */
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId })
        const booking = new Booking({
            user: '5fdee45b4f8d04608cc780fe',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    /* cancel booking */
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
}