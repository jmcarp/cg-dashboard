
import React from 'react';

import classNames from 'classnames';

export default class Tabnav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { current: this.props.initialItem };
  }

  render() {
    return (
    <ul className="nav nav-tabs nav-justified">
      { this.props.items.map((item) => {
        if (item.name === this.state.current) {
          return <li className="active">{ item.element }</li>;
        } else {
          return <li>{ item.element }</li>;
        }
      })}
    </ul>
    );
  }
};

Tabnav.propTypes = {
  initialItem: React.PropTypes.string.isRequired,
  items: React.PropTypes.any
};
