import React from 'react';

type Props = {};

export const MobileWarning: React.FC<Props> = (props) => (
  <div className="flex lg:hidden fixed z-50 bg-black w-full h-full flex-col items-center justify-center">
    <div className="mb-40 text-30">(╯°□°)╯︵ ┻━┻</div>
    <p className="text-center">
      We are sorry, but Resonate currently only supports desktop devices
    </p>
  </div>
);
