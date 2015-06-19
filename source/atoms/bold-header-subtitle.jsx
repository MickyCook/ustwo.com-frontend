'use strict';

import React from 'react';

const BoldHeaderSubtitle = React.createClass({
  displayName: 'BoldHeaderSubtitle',
  render() {
    return (
      <section>
        <hr/>
        <h4 className="u-text-nonBlack">{this.props.children}</h4>
      </section>
    );
  }
});

export default BoldHeaderSubtitle;
