
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import OrgStore from '../stores/org_store';

import createStyler from '../util/create_styler';

function stateSetter() {
  return {
    rows: OrgStore.getAll()
  };
}

export default class OrgList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
    this.orgLink = this.orgLink.bind(this);
    this.styler = createStyler(style);
    this.setState(stateSetter());
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  orgLink(orgGuid) {
    return `/#/org/${orgGuid}`;
  }

  render() {
    let content = <h4 className="test-none_message">No orgs found</h4>;

    if (this.state.rows.length) {
      content = (
        <table sortable>
          <thead>
            <tr>
              <th column="Org Name" className="name">Org Name</th>
            </tr>
          </thead>
          <tbody>
          { this.state.rows.map((row) =>
              <tr key={ row.guid }>
                <td label="Name">
                  <a href={ this.orgLink(row.guid) }>{ row.name }</a>
                </td>
              </tr>
          )}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <div>
          <h2>All your organizations</h2>
          <p><em>
          Each organization is a <a href="https://docs.cloud.gov/intro/terminology/pricing-terminology/">system</a> (<a href="https://docs.cloud.gov/getting-started/concepts/">shared perimeter</a>) that contains <a href="https://docs.cloud.gov/intro/pricing/system-stuffing/">related spaces holding related applications</a>.
          </em></p>
        </div>
        <div className={ this.styler('tableWrapper') }>
          { content }
        </div>
      </div>
    );
  }
}

OrgList.propTypes = {};
