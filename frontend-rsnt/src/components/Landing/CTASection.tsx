import React from 'react';

type Props = {};

export const CTASection: React.FC<Props> = (props) => (
  <section className="py-60" id="kickstarter">
    <div className="flex gradient-bg rounded-lg px-40 py-60">
      <h4 className="text-40 leading-normal font-bold mr-100">Kickstarter</h4>
      <div className="flex-1">
        <div className="mb-40 flex flex-row">
          <div className="p-5 flex flex-col">
            <p className="text-20 font-medium">"Give us your soul"</p>
            <span className="ml-80"> - Cuong Nguyen, CEO of Resonate</span>
          </div>
          <div className="p-5 flex flex-col">
            <p className="text-20 font-medium">"I am single & desperate"</p>
            <span className="ml-80"> - Xuan Anh Nguyen, CTO of Resonate</span>
          </div>
        </div>
        <a
          href="https://www.kickstarter.com/projects/cuongnguyen/resonate"
          rel="noopener noreferrer"
          target="_blank"
        >
          <button className="bg-white text-green font-bold text-20 p-10 px-30 rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            Support us on Kickstarter
          </button>
        </a>
      </div>
    </div>
  </section>
);
