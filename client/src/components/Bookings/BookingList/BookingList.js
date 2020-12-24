import React from 'react';

import './BookingList.css';

const BookingList = props => (
    <ul className="booking__list">
        {props.bookings.map(booking => {
            return (
                <li key={booking._id} className="booking__item">
                    <div className="booking__item-data">
                        {booking.event.title} -{' '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div className="booking__item-actions">
                        <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>
            );
        })}
    </ul>
);


export default BookingList;