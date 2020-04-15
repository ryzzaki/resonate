import React from 'react';
import { RouteComponentProps } from '@reach/router';
import Header from './Header';
import Footer from './Footer';

const LandingPage: React.FC<RouteComponentProps> = () => {
  return (
    <section>
      <Header />
      <div className="flex flex-wrap text-center items-center md:flex-no-wrap mb-4">
        <div className="flex-auto hidden md:block w-1/3 bg-blue">
          <p>Lorem Ipsum</p>
        </div>
        <div className="flex-auto w-1/3 bg-red">
          <h1>Middle Box</h1>
          <p>Lorem Ipsum</p>
        </div>
        <div className="flex-auto hidden md:block w-1/3 bg-green">
          <p>Lorem Ipsum</p>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default LandingPage;
