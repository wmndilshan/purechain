
import React from 'react';
import { EXPERIENCES } from '../data/mockData';

const ExperiencePage: React.FC = () => {
  return (
    <div className="bg-[#f0f2f1] min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold nature-green mb-8">Experience PureChain</h1>
          <p className="text-3xl font-bold text-gray-800 mb-6 heading-font italic">Where Nature Becomes a Way of Life</p>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            At PureChain Organic Farm, every moment is rooted in purity, sustainability, and connection with nature. It's a living ecosystem where you can slow down, breathe deeply, and experience organic farming the way it was meant to be.
          </p>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {EXPERIENCES.map((exp, i) => (
            <div key={exp.id} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              <div className="w-full md:w-1/2">
                <img src={exp.image} alt={exp.title} className="rounded-[40px] shadow-2xl h-[400px] w-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-4xl font-bold nature-green">{exp.title}</h2>
                <div className="space-y-4">
                   {exp.description.map((line, j) => (
                     <p key={j} className="text-lg text-gray-600 flex items-start space-x-3">
                       <span className="text-green-500 mt-1">➤</span>
                       <span>{line}</span>
                     </p>
                   ))}
                </div>
                <button className="pure-green-btn px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform">{exp.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-green-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 heading-font">More Than a Visit – A PureChain Experience</h2>
          <p className="text-xl text-green-100 italic mb-12">
            "At PureChain, every experience is built around purity, sustainability, and mindful living. Whether you stay, visit, or harvest, you leave with more than produce—you leave with awareness, calm, and a deeper connection to nature."
          </p>
          <div className="text-2xl font-bold mb-4">PureChain Organic Farm</div>
          <p className="uppercase tracking-widest text-sm text-green-400">Grow pure. Live pure. Experience nature.</p>
        </div>
      </section>
    </div>
  );
};

export default ExperiencePage;
