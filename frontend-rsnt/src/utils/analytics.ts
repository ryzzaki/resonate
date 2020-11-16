import AppConfig from '../config/app.config';

export const initGA = () => {
  const scriptSrc = document.createElement('script');
  scriptSrc.async = true;
  scriptSrc.src = 'https://www.googletagmanager.com/gtag/js?id=UA-175957253-1';
  document.head.appendChild(scriptSrc);

  const scriptConfig = document.createElement('script');
  scriptConfig.text = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', 'UA-175957253-1');`;
  document.head.appendChild(scriptConfig);
};

export const gaSetUser = (id: string) => {
  if (AppConfig.serverSettings.serverMode === 'development') return;

  window.gtag('create', 'UA-175957253-1', 'auto');
  window.gtag('set', 'userId', id);
};

export const gaEvent = (name: string, category: string) => {
  if (AppConfig.serverSettings.serverMode === 'development') return;

  window.gtag('event', name, {
    event_category: category,
  });
};
