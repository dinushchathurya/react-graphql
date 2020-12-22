import React, { Component } from 'react';

import './Auth.css';

class Auth extends Component {
    render() {
        return (
            <form className="auth-form">
                <div className="form-control">
                    <label for= "email">Email</label>
                    <input type="email" id="email" />
                </div>
                <div className="form-control">
                    <label for="password">Password</label>
                    <input type="password" id="password" />
                </div>
                <div className="form-actions">
                    <button type="button">Switch to Signup</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )
    }
}

export default Auth;