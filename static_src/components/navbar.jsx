
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';
import AppStore from '../stores/app_store.js';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import { router } from '../main.js';

function stateSetter() {
  const currentAppGuid = AppStore.currentAppGuid;
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;

  return {
    currentApp: AppStore.get(currentAppGuid),
    currentOrg: OrgStore.get(currentOrgGuid),
    currentSpace: SpaceStore.get(currentSpaceGuid),
    orgs: OrgStore.getAll()
  };
}

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _handleSelect(type, e) {
    switch (type) {
      case 'org': {
        this._handleOrgSelect(e);
        break;
      }
      case 'space': {
        this._handleSpaceSelect(e);
        break;
      }
      case 'app': {
        this._handleAppSelect(e);
        break;
      }
      default:
        break;
    }
  }

  _handleOrgSelect(e) {
    const orgGuid = e.target.value;
    router.setRoute(`/org/${orgGuid}`);
  }

  _handleSpaceSelect(e) {
    const orgGuid = this.state.currentOrg.guid;
    const spaceGuid = e.target.value;
    router.setRoute(`/org/${orgGuid}/spaces/${spaceGuid}`);
  }

  _handleAppSelect(e) {
    const orgGuid = this.state.currentOrg.guid;
    const spaceGuid = this.state.currentSpace.guid;
    const appGuid = e.target.value;
    router.setRoute(`/org/${orgGuid}/spaces/${spaceGuid}/apps/${appGuid}`);
  }

  _templateSelect(type, value, options) {
    const handler = this._handleSelect.bind(this, type);
    return (
      <div className={ this.styler('nav_breadcrumb-select_wrapper') }>
        <div className={ this.styler('nav_breadcrumb-select', `nav_breadcrumb-select-${type}`) }>
          <select
            onChange={ handler }
            value={ value }
          >
            { options.map(item =>
                (
                  <option
                    value={ item.guid }
                    key={ item.guid }
                  >
                    { item.name }
                  </option>
                )
              )
            }
          </select>
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.currentOrg) {
      return null;
    }

    const sortedOrgs = this.state.orgs.sort((a, b) => a.name.localeCompare(b.name));
    let orgSelect = this._templateSelect('org', this.state.currentOrg.guid, sortedOrgs);

    let spaceSelect = null;
    if (!!this.state.currentSpace) {
      const sortedSpaces =
        this.state.currentOrg.spaces.sort((a, b) => a.name.localeCompare(b.name));
      spaceSelect = this._templateSelect('space', this.state.currentSpace.guid, sortedSpaces);
    }

    let appSelect = null;
    if (!!this.state.currentApp) {
      const sortedApps = (this.state.currentSpace.apps || [this.state.currentApp])
        .sort((a, b) => a.name.localeCompare(b.name));
      appSelect = this._templateSelect('app', this.state.currentApp.guid, sortedApps);
    }

    return (
      <div className={ this.styler('nav_breadcrumb') }>
        { orgSelect }
        { spaceSelect && <span className={ this.styler('nav_breadcrumb-divider') }>/</span> }
        { spaceSelect }
        { appSelect && <span className={ this.styler('nav_breadcrumb-divider') }>/</span> }
        { appSelect }
      </div>
    );
  }
}
