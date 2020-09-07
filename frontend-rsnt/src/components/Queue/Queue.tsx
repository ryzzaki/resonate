import React from 'react';

type Props = {};

export const Queue: React.FC<Props> = (props) => {
  const {} = props;

  return (
    <div className="px-20">
      <h3 className="text-grey font-bold uppercase text-14 transition duration-300 ease-in-out cursor-pointer">
        Next in queue
      </h3>
    </div>
  );
};
