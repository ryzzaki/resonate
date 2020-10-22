import React from 'react';

export const CTASection: React.FC = () => (
  <section className="py-60" id="kickstarter">
    <div className="flex gradient-bg rounded-lg px-40 py-60">
      <h4 className="text-40 leading-normal font-bold mr-100">Hey there!</h4>
      <div className="flex-1">
        <div className="mb-40 flex flex-row">
          <div className="p-5 flex flex-col">
            <p className="text-20 font-medium">
              Thanks for using the early access of Resonate!
            </p>
          </div>
        </div>
        <a
          href="https://github.com/ryzzaki/SonicBoom"
          rel="noopener noreferrer"
          target="_blank"
        >
          <button className="bg-white text-green font-bold text-20 p-10 px-30 rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            See the code!
          </button>
        </a>
      </div>
    </div>
  </section>
);
