import React from 'react';

import './EventItem.css';

const EventItem = props => (
    <li key={props.eventId} className="events__list-item">
        <div>
            <h2>{props.title}</h2>
            <h3>${props.price} - {new Date(props.date).toLocaleDateString()}</h3>
        </div>
        <div>
            {props.userId === props.creatorId ? (
                <p>You are the owner of this event </p>
                ) : (
                    <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Event</button>
            )}
        </div>
    </li>
)

export default EventItem;