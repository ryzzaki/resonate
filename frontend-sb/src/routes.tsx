import React from 'react';
import { Router, Redirect } from '@reach/router';
import { LandingPage } from './components/Landing/LandingPage';
import { RedirectPage } from './components/RedirectPage';
import { Party } from './components/Party/Party';
import { Rooms } from './components/Rooms';

type RouterProps = {
  component: React.FC;
  path: string;
  allowed: boolean;
  location?: any;
};

const ProtectedRoute: React.FC<RouterProps> = ({
  component: Component,
  allowed,
  ...props
}) => {
  if (allowed) {
    return <Component {...props} />;
  } else {
    if (props.path === '/party') {
      localStorage.removeItem('redirect_url');
      localStorage.setItem('redirect_url', `/party${props.location.search}`);
    }
    return <Redirect to="/" noThrow />;
  }
};

const PublicRoute: React.FC<RouterProps> = ({
  component: Component,
  allowed,
  ...props
}) => {
  if (allowed) {
    return <Component {...props} />;
  } else {
    const redirectUrl = localStorage.getItem('redirect_url');
    return (
      <Redirect
        to={props.path === '/auth' && redirectUrl ? redirectUrl : '/rooms'}
        noThrow
      />
    );
  }
};

type Props = {
  token?: string;
};

export const Routes: React.FC<Props> = (props) => {
  const { token } = props;

  return (
    <Router>
      <ProtectedRoute path="/party" allowed={!!token} component={Party} />
      <ProtectedRoute path="/rooms" allowed={!!token} component={Rooms} />
      <PublicRoute path="/auth" allowed={!token} component={RedirectPage} />
      <LandingPage path="/" />
    </Router>
  );
};
