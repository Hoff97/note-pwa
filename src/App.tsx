import React from 'react';
import { NoteComponent } from './components/note/Note';

import 'purecss/build/base-min.css';
import 'purecss/build/buttons-min.css';
import 'purecss/build/grids-responsive-min.css';

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Home } from './components/home/Home';
import { Login } from './components/login/Login';

function App() {

  return (
    <div className="container">
      <div className="pure-g center">
        <div className="pure-u-1 pure-u-md-1-5">
        </div>
        <div className="pure-u-1 pure-u-md-3-5">
          <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route path="/note/:noteId" component={NoteComponent}>
              </Route>
              <Route path="/login/">
                <Login />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
