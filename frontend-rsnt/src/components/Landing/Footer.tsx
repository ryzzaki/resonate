import React from 'react';

export const Footer: React.FC = (props) => {
  return (
    <footer className="font-body flex flex-col items-center w-full border-t-2 border-black2light pt-40 pb-80 ">
      <div className="text-white text-20">Resonate v1.0 </div>
      <ul className="flex text-12 text-greylight">
        <li className="mr-15">
          &copy; 2020 Resonate by @vcngng, @alexnguyen98 & Applifting s.r.o.
        </li>
      </ul>
    </footer>
  );
};
