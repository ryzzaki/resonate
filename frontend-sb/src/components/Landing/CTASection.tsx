import React from 'react';

type Props = {};

export const CTASection: React.FC<Props> = (props) => (
  <section className="py-60" id="kickstarter">
    <div className="flex gradient-bg rounded-lg px-40 py-60">
      <h4 className="text-40  leading-normal font-bold mr-100">Kickstarter</h4>
      <div className="flex-1">
        <div className="mb-40 flex flex-col">
          <p className="text-20 font-medium">"Give us your soul"</p>
          <span className="ml-80">Cuong Nguyen, CEO of Resonate</span>
        </div>
        <button className="bg-white text-green font-bold text-20 p-10 px-30 rounded-full">
          <a
            href="https://www.kickstarter.com/projects/cuongnguyen/resonate"
            target="_blank"
          >
            Support us on Kickstarter
          </a>
        </button>
      </div>
    </div>
  </section>
);
