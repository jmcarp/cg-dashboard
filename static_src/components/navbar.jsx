
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
    this._handleOrgSelect = this._handleOrgSelect.bind(this);
    this._handleSpaceSelect = this._handleSpaceSelect.bind(this);
    this._handleAppSelect = this._handleAppSelect.bind(this);
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

  render() {
    if (!this.state.currentOrg) {
      return null;
    }

    const sortedOrgs = this.state.orgs.sort((a, b) => a.name.localeCompare(b.name));

    function templateOptions(items, selected) {
      return items.map(item => {
        const isSelected = item.guid === selected;
        return <option value={ item.guid } selected={ isSelected }>{ item.name }</option>;
      });
    }

    let orgSelect = (
      <select
        className={ this.styler('nav-breadcrumb-select', 'nav-breadcrumb-select-org') }
        onChange={ this._handleOrgSelect }
      >
        { templateOptions(sortedOrgs, this.state.currentOrg.guid) }
      </select>
    );

    let spaceSelect = null;
    if (!!this.state.currentSpace) {
      const sortedSpaces =
        this.state.currentOrg.spaces.sort((a, b) => a.name.localeCompare(b.name));
      spaceSelect = (
        <select
          className={ this.styler('nav-breadcrumb-select', 'nav-breadcrumb-select-space') }
          onChange={ this._handleSpaceSelect }
        >
          { templateOptions(sortedSpaces, this.state.currentSpace.guid) }
         </select>
      );
    }

    let appSelect = null;
    if (!!this.state.currentApp) {
      const sortedApps = this.state.currentSpace.apps.sort((a, b) => a.name.localeCompare(b.name));
      appSelect = (
        <select
          className={ this.styler('nav-breadcrumb-select', 'nav-breadcrumb-select-app') }
          onChange={ this._handleAppSelect }
        >
          { templateOptions(sortedApps, this.state.currentApp.guid) }
         </select>
      );
    }

    return (
      <div className={ this.styler('nav-breadcrumb') }>
        { orgSelect }
        { spaceSelect }
        { appSelect }
      </div>
    );
  }
}
