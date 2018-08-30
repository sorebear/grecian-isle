import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { auth } from '../firebase';

import '../scss/main.scss';

class Layout extends React.Component {

  async componentDidMount() {
    await auth.annonymousSignIn();
    auth.getUseInfo((user) => {
      console.log('HERE IS THE USER', user);
    });
  }

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
}

Layout.propTypes = {
  children: PropTypes.func,
  data: PropTypes.shape({
    site:PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string
      })
    })
  })
};

export default Layout;

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
