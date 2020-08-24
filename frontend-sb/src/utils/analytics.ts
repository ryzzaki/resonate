import ReactGA from 'react-ga';

export const initGA = () => ReactGA.initialize('UA-175957253-1'); // put your tracking id here

export const GApageView = (page) => ReactGA.pageview(page);
