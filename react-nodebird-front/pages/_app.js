import React from 'react';
import propTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

const App = ({ Component }) => {
  return (
    <>
      <Head>
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

App.propTypes = {
  Component: propTypes.elementType.isRequired,
};

export default App;
