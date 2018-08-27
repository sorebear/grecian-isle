import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import '../scss/main.scss';

class Layout extends React.Component {
  render() {
    return (
      <div>
        <Helmet
          title={this.props.data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Grecian Isle' },
            { name: 'keywords', content: 'grecian, isle, boardgame, santorini, game, real-time, react' },
          ]}
        >
        </Helmet>
        <div>
          {this.props.children()}
        </div>
      </div>
    );
  }
};

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout;

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`