import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import qs from 'qs';
import { Link } from 'react-router-dom';

import { isLoaded as isInfoLoaded, load as loadInfo } from '../../redux/modules/info';
import { InfoBar } from '../../components'; //Notifs
import config from '../../../config/config';

// --------------------------------------------------------------------------

@provideHooks({
  fetch: async ({ store: { dispatch, getState } }) => {
    if (!isInfoLoaded(getState())) {
      await dispatch(loadInfo()).catch(() => null);
      console.log('>>>>>>>>>>>>>>>>> APP > dispatch(loadInfo()) 1111>>>>>>>>>>>>>>>>>>>>>>>>v: ');
    } else {
      console.log('>>>>>>>>>>>>>>>>> APP > dispatch(loadInfo()) 2222>>>>>>>>>>>>>>>>>>>>>>>>i: ');
    }
  }
})

// --------------------------------------------------------------------------

@withRouter

// --------------------------------------------------------------------------

class App extends Component {

  static propTypes = {
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    // user: PropTypes.shape({ email: PropTypes.string }),
    // notifs: PropTypes.shape({global: PropTypes.array}).isRequired,
  };

  static defaultProps = {
    user: null
  };

  state = {
    user: this.props.user,
    prevProps: this.props
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> APP > componentDidMount() <<<<<<<<<<<<<<');
  }


  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>>>>>>>>>>>> APP > componentDidUpdate() <<<<<<<<<<<<<<');
    // const { location } = this.props;
    // if (location.pathname !== prevProps.location.pathname) {
    //   window.scrollTo(0, 0);
    // }
  }

  static getDerivedStateFromProps(props, state) {
    console.log('>>>>>>>>>>>>>>>> APP > getDerivedStateFromProps() <<<<<<<<<<<<<<');
    const { prevProps } = state;
    // Compare the incoming prop to previous prop
    const user = !_.isEqual(prevProps.user, props.user) ? props.user : state.user;

    if (!prevProps.user && props.user) {
      const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
      props.pushState(query.redirect || '/login-success');
    } else if (prevProps.user && !props.user) {
      props.pushState('/');
    }

    return {
      user,
      prevProps: props
    };
  }

  render() {

    const { notifs, route } = this.props;

    const styles = require('./styles/App.scss');

    return (

      <HelmetProvider>

        <div className={styles.app}>

          <Helmet {...config.app.head} />

          <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">

            <div className="container">

              <Link to='/' className="navbar-brand js-scroll-trigger">Election App</Link>

              <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarResponsive">

                <ul className="navbar-nav mr-auto">

                  <li className="nav-item">
                    <Link to='/about' className="nav-link js-scroll-trigger">About</Link>
                  </li>

                  <li className="nav-item">
                    <Link to='/stickyfooter' className="nav-link js-scroll-trigger">StickyFooter</Link>
                  </li>

                  <li className="nav-item">
                    <Link to='/login' className="nav-link js-scroll-trigger">
                      <span className={`fas fa-fw fa-sign-in-alt ${styles.sharedVarColorRutgersScarletXX}`}></span>Login</Link>
                  </li>

                  <li className="nav-item">
                    <Link to='/register' className="nav-link js-scroll-trigger">Register</Link>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link font-old-english" data-toggle="modal" href="#appModal1">Modal</a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link font-norwester" href="#">
                      <span className={`fas fa-fw fa-headphones /\n${styles.colorGoldLocal}`}></span><span className={styles.testColorFont}>Headphones!</span></a>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Links</a>
                    <div className="dropdown-menu" aria-labelledby="dropdown01">
                      <Link to='/aboutone' className="dropdown-item js-scroll-trigger">About One</Link>
                      <Link to='/abouttwo' className="dropdown-item js-scroll-trigger">About Two</Link>
                      <Link to='/aboutthree' className="dropdown-item js-scroll-trigger">About Three</Link>
                      <Link to='/aboutfour' className="dropdown-item js-scroll-trigger">About Four</Link>
                      <Link to='/boardgames' className="dropdown-item js-scroll-trigger">Board Games</Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className={styles.appContent}>
            {renderRoutes(route.routes)}
          </div>

          <InfoBar />

          <div className={styles.footer}>
            <div className="container h-100">
              <div className={`h-100 d-flex flex-column justify-content-center align-items-center ${styles.flexContainer}`}>
                <div>Copyright &copy; 2019 · Election App 2019</div>
                <div><span className={`fas fa-headphones fa-padding ${styles.colorGoldLocal}`}></span><span className={`font-norwester ${styles.colorGoldLocal}`}>Footer Headphones!</span></div>
              </div>
            </div>
          </div>

          <div className="app-modal modal fade" id="appModal1" tabIndex="-1" role="dialog" aria-labelledby="appModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="appModalLabel">Modal Test</h5>
                  <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">

                  <p className={styles.sharedVarColorRutgersScarletXX}>Modal is working. This paragraph's font and the above modal-title's font is using Bootstrap's default font. It is the default 'global' font for this app. It is overriding Bootstrap's default font 'font-family-sans-serif'. It's a hard to read font but easily recognizable for development purposes.</p>

                  <p className={styles.specialAppFontColor}>This paragraph's '@font-face' is 'Old English'.</p>

                  <p className="font-roboto-mono-V4-latin-regular">This paragraph's '@font-face' is 'roboto-mono-v4-latin-regular'.</p>

                  <p className="font-montserratlight color-salmon">This paragraph's '@font-face' is 'font-montserratlight'.</p>

                  <p className="font-lobster-v20-latin-regular">This paragraph's '@font-face' is 'lobster-v20-latin-regular'.</p>

                  <p className="font-norwester">This paragraph's '@font-face' is 'norwester'.</p>

                  <p className="color-crimson open-sans-italic-webfont">This paragraph's '@font-face' is 'OpenSans-Italic-webfont'.</p>

                  <p className="font-philosopher-bold-webfont">This paragraph's '@font-face' is 'font-philosopher-bold-webfont'.</p>

                  <p className="font-sourcesanspro-regular-webfont">This paragraph's '@font-face' is 'sourcesanspro-regular-webfont'.</p>

                  <p className={`color-springgreen ${styles.montserratLightFontGlobalToLocal}`}>This paragraph's '@font-face' is 'MontserratLight'. It is scoped Global to Local.</p>

                  <p className="color-orangered font-opensans-bold-webfont">This paragraph's '@font-face' is 'OpenSans-Bold-webfont' It is scoped Global.</p>

                  <p className={styles.colorCrimsonCssLocal}>This paragraph's color is 'colorCrimsonCssLocal'. It is scoped Local fom 'AppCss1.css'.</p>

                  <p className={styles.coloredText2Local}>This paragraph's color is 'coloredText2Local'. It is scoped Local fom 'AppScss2.scss'.</p>

                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                  <a className="btn btn-primary" href="#">Button Somewhere</a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </HelmetProvider>
    );
  }
}

export default App;