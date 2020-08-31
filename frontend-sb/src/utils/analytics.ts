import ReactGA from 'react-ga';
import AppConfig from '../config/app.config';

export const initGA = () =>
  ReactGA.initialize('UA-175957253-1', {
    debug: AppConfig.serverSettings.serverMode === 'development',
  });

export const GApageView = (page) => ReactGA.pageview(page);
