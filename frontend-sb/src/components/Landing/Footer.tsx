import React from 'react';

export const Footer: React.FC = (props) => {
  return (
    <footer className="font-body flex flex-col items-center w-full border-t-2 border-black2light pt-40 pb-80 ">
      <div className="text-white text-20">SonicBoom v1.0 </div>
      <ul className="flex text-12 text-greylight">
        <li className="mr-10">@applifting 2020</li>
      </ul>
    </footer>
  );
};
