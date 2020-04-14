import * as React from 'react';
import { Route } from 'react-router-dom';

import './style.css';
import { loginService } from '../../network/login.service';

export class Login extends React.Component<{}, {error?: string}> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {};
    }

    login(history: any, ev: React.FormEvent) {
        ev.preventDefault();
        ev.stopPropagation();

        const email = (ev.target as any)[1].value;
        const pw = (ev.target as any)[2].value;

        loginService.login(email, pw).then(token => {
            if (token !== undefined) {
                history.push(`/`);
            } else {
                this.setState({
                    error: 'Could not log in'
                });
            }
        });
    }

    render() {
        return <Route render={({ history }) => (
            <div className="login">
                <form className="pure-form"
                        onSubmit={ev => this.login(history, ev)}>
                    <fieldset>
                        <legend>Login</legend>

                        <input type="username" placeholder="Username"/>
                        <input type="password" placeholder="Password"/>

                        <button type="submit" className="pure-button pure-button-primary">
                            Sign in
                        </button>

                        {this.state.error ? this.state.error : ''}
                    </fieldset>
                </form>
            </div>
        )} />;
    }
}