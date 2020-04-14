import * as React from 'react';
import { Route } from 'react-router-dom';

import './style.css';
import { loginService } from '../../network/login.service';

interface LoginState {
    error?: string;
    register: boolean;
}

export class Login extends React.Component<{}, LoginState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            register: false
        };
    }

    login(history: any, ev: React.FormEvent) {
        ev.preventDefault();
        ev.stopPropagation();

        const email = (ev.target as any)[1].value;
        const pw = (ev.target as any)[2].value;

        if (this.state.register) {
            const pwr = (ev.target as any)[3].value;

            if (pw === pwr) {
                loginService.register(email, pw).then(token => {
                    if (token !== undefined) {
                        history.push(`/`);
                    } else {
                        this.setState({
                            error: 'Could not log in'
                        });
                    }
                });
            } else {
                this.setState({
                    error: 'Passwords do not match'
                });
            }
        } else {
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
    }

    toggleRegister() {
        this.setState({
            register: !this.state.register
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
                        {this.state.register ?
                            <input type="password" placeholder="Repeat Password"/> :
                            <span></span>
                        }

                        <button type="submit" className="pure-button pure-button-primary">
                            {this.state.register ? 'Register' : 'Sign in'}
                        </button>

                        {/*<a onClick={() => this.toggleRegister()}
                            className="ml-1">
                            {this.state.register ? 'Sign in' : 'Register'}
                        </a>*/}

                        {this.state.error ? this.state.error : ''}
                    </fieldset>
                </form>
            </div>
        )} />;
    }
}