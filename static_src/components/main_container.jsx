
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import overrideStyle from '../css/overrides.css';

import createStyler from '../util/create_styler';

import Disclaimer from './disclaimer.jsx';
import Header from './header.jsx';
import Login from './login.jsx';
import LoginStore from '../stores/login_store.js';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import { Nav } from './navbar.jsx';

function stateSetter() {
  return {
    currentOrgGuid: OrgStore.currentOrgGuid,
    currentSpaceGuid: SpaceStore.currentSpaceGuid,
    isLoggedIn: LoginStore.isLoggedIn()
  };
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style, overrideStyle);
    this.state = stateSetter();;
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    LoginStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    let content;
    let breadcrumbNav;

    if (this.state.isLoggedIn) {
      content = this.props.children;
      breadcrumbNav = <Nav />;
    } else {
      content = <Login />;
    }


    return (
      <div>
        <Disclaimer />
        <Header />
        <div className={ this.styler('sidenav-parent', 'main_content', 'content-dashboard') }>
          <main className={ this.styler('sidenav-main', 'usa-content') }>
            <nav className={ this.styler('breadcrumb-nav') }>
              { breadcrumbNav }
            </nav>
            <div className={ this.styler('content') }>
              { content }
            </div>
          </main>
        </div>
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.any
};

App.defaultProps = {
  children: []
};
