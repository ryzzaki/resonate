import React from 'react';

type Props = {};

export const DesktopOnlyCockBlock: React.FC<Props> = (props) => (
  <div className="flex lg:hidden fixed z-50 bg-black w-full h-full flex-col items-center justify-center">
    <div className="mb-40 text-30">(╯°□°)╯︵ ┻━┻</div>
    <p className="text-center">
      We are sorry, but Sonicboom currently supports only desktop devices <br />{' '}
      Thank you for your understatement{' '}
    </p>
  </div>
);
