import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';

// https://github.com/danilowoz/react-content-loader

class Loading extends Component {

  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {
    text: 'Loading'
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidMount() <<<<<<<<<<<<<<');
    NProgress.start();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidUpdate() <<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentWillUnmount() <<<<<<<<<<<<<<');
    NProgress.done();
  }

  render() {

    const { text } = this.props;
    const styles = require('./scss/Loading.scss');
    // <div className={`alert alert-warning text-center mb-0 ${styles.loading}`} role="alert">{ text }</div>

    return (

      <div className="alert alert-warning text-center mb-0" role="alert">{ text }<span className={styles.one}>.</span><span className={styles.two}>.</span><span className={styles.three}>.</span></div>

    );
  }
}

export default Loading;
