import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { load } from '../../redux/modules/info';
import Loading from '../Loading/Loading';

@connect(
  (state) => ({ 
    data: state.info.data,
    loading: state.info.loading,
    error: state.info.error,
    errorResponse: state.info.errorResponse,
  }),
  { load }
)

class InfoBar extends Component {

  static propTypes = {
    // data: PropTypes.shape({
    //   // value: `${v}`,
    //   // timeElapsed: timeElapsedModule1.getSecondsElapsed(),
    //   // time: Date.now(),
    //   // delay: `${delay}`,
    //   // message: 'RESOLVED! This came from the mock API.',
    //      loading: PropTypes.bool,
    // }),
    // load: PropTypes.func.isRequired
  };

  // ============================================================

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> InfoBar > componentDidMount() <<<<<<<<<<<<<<<<<<<<<<');
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('>>>>>>>>>>>>>>>> InfoBar > componentDidUpdate() <<<<<<<<<<<<<<<<<<<<<<');
  };

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> InfoBar > componentWillUnmount() <<<<<<<<<<<<<<<<<<<<<<');
  };

  shouldComponentUpdate(nextProps, nextState) {
    // invoked before rendering when new props or state are being received
    console.log('>>>>>>>>>>>>>>>> InfoBar > shouldComponentUpdate() > nextProps: ', nextProps);
    console.log('>>>>>>>>>>>>>>>> InfoBar > shouldComponentUpdate() > nextState: ', nextState);
    return nextProps;
  };

  // static getDerivedStateFromProps(props, state) {
  //   console.log('>>>>>>>>>>>>>>>> InfoBar > getDerivedStateFromProps() <<<<<<<<<<<<<<<<<<<<<<');
  //   return null;
  // };

  componentDidCatch(error, info) {
    console.log('>>>>>>>>>>>>>>>> InfoBar > componentDidCatch() > info.componentStack: ', info.componentStack);
  };

  // ============================================================

  render() {

    const { data, loading, load, error, errorResponse } = this.props;
    const styles = require('./scss/InfoBar.scss');

    return (

      <div className="card text-center">

        <div className="card-body bg-light">

          {/* (>>>>>>>>>>>>>>>>>>>>>> LOADING >>>>>>>>>>>>>>>>>>>>>>>>) */}

          {loading && (
              <Loading text="Loading" />
            )}

          {/* (>>>>>>>>>>>>>>>>>>>>>> ERROR >>>>>>>>>>>>>>>>>>>>>>>>) */}

          {error && (

              <div className="alert alert-danger text-center" role="alert">RENDERING ERROR<br/><span>{`Message: ${errorResponse.message}`}</span><br/><span>{`Url: ${errorResponse.documentation_url}`}</span></div>

            )}

          {/* (>>>>>>>>>>>>>>>>>>>>>>>> LOADED >>>>>>>>>>>>>>>>>>>>>>>>) */}

          {!loading && (

              <div>
                <div className={`card-title ${styles.infoBar}`}>
                  <h5>InfoBar message: '<span className={styles.message}>{data ? data.message : 'no message!'}</span>'</h5>

                  <h6>{data && new Date(data.time).toString()}</h6>

                  <h6>{data && data.timeElapsed}</h6>
                </div>

                <button type="button" className="btn btn-primary" onClick={load}>
                  Reload from server
                </button>
              </div>
            )}

        </div>
      </div>

    );
  }
}

export default InfoBar;
