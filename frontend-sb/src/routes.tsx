import React from 'react';
import { Router, Redirect } from '@reach/router';
import { LandingPage } from './components/LandingPage';
import { RedirectPage } from './components/RedirectPage';
import { DJPage } from './components/DJPage/DJPage';
import { Rooms } from './components/Rooms';

type RouterProps = {
  component: React.FC;
  path: string;
  allowed: boolean;
};

const ProtectedRoute: React.FC<RouterProps> = ({
  component: Component,
  allowed,
  ...props
}) => (allowed ? <Component {...props} /> : <Redirect to="/" noThrow />);

const PublicRoute: React.FC<RouterProps> = ({
  component: Component,
  allowed,
  ...props
}) => (allowed ? <Component {...props} /> : <Redirect to="/rooms" noThrow />);

type Props = {
  token?: string;
};

export const Routes: React.FC<Props> = (props) => {
  const { token } = props;

  return (
    <Router>
      <ProtectedRoute path="/party" allowed={!!token} component={DJPage} />
      <ProtectedRoute path="/rooms" allowed={!!token} component={Rooms} />
      <PublicRoute path="/auth" allowed={!token} component={RedirectPage} />
      <LandingPage path="/" />
    </Router>
  );
};
