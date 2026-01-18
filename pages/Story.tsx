
import React from 'react';

const Story: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-24 nature-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold nature-green mb-8">Our Story</h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto italic">
            "The problem is not farming — it's the lack of transparency and trust."
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section 1: Organic */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold nature-green mb-8">What Does "Organic" Really Mean?</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="prose text-gray-600">
                <p className="mb-4">
                  Organic food is more than a label — it is a promise. A promise of cleaner cultivation, responsible chemical use, and care for human health and the environment.
                </p>
                <p>
                  True organic produce is grown with minimal and controlled use of agrochemicals, respecting nature, soil health, and long-term sustainability. But how do we really know what was used to grow our food?
                </p>
              </div>
              <img src="https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg" alt="Organic" />
            </div>
          </div>

          {/* Section 2: The Gap */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold nature-green mb-8">The Gap We Saw in Sri Lanka</h2>
            <div className="bg-green-50 p-10 rounded-3xl border border-green-100">
              <p className="text-lg text-gray-700 mb-6">
                In Sri Lanka, organic and "safe" vegetables and fruits are widely marketed — yet transparent proof is limited. Most systems rely on manual records or trust alone.
              </p>
              <ul className="grid md:grid-cols-3 gap-6">
                {['Consumers worried about health', 'Retailers trying to maintain credibility', 'Farmers lacking visibility'].map((point, i) => (
                  <li key={i} className="bg-white p-4 rounded-xl shadow-sm border border-green-100 text-sm font-medium text-green-800">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Why PureChain */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold nature-green mb-8">Why We Started PureChain</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              As a group of undergraduates from the University of Moratuwa, we decided to look deeper, not just as engineers, but as consumers and future change-makers. Our insight was clear: technology could bridge the trust gap.
            </p>
          </div>

          {/* Section 4: Farmer Pool */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold nature-green mb-8">Our Farmer Pool – Built on Partnership</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#fcf8f0] p-8 rounded-2xl border border-orange-100">
                <h3 className="text-xl font-bold text-orange-800 mb-4">We select farmers based on:</h3>
                <ul className="space-y-3 text-orange-900/80">
                  <li className="flex items-center space-x-2"><span>•</span> <span>Farming practices, not just labels</span></li>
                  <li className="flex items-center space-x-2"><span>•</span> <span>Guidance toward certification</span></li>
                  <li className="flex items-center space-x-2"><span>•</span> <span>Data-driven quality insights</span></li>
                </ul>
              </div>
              <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg h-full object-cover" alt="Farmer" />
            </div>
          </div>

          {/* Section 5: Technology */}
          <div className="mb-24 text-center">
            <h2 className="text-3xl font-bold nature-green mb-8">Technology That Builds Trust</h2>
            <div className="bg-white border-2 border-green-100 p-12 rounded-[40px] shadow-sm">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">IoT-based Sensor System</h3>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                Monitoring soil conditions, environmental parameters, and agrochemical usage patterns in real-time.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-green-600">
                <span className="bg-green-50 px-4 py-2 rounded-full">Visible</span>
                <span className="bg-green-50 px-4 py-2 rounded-full">Verifiable</span>
                <span className="bg-green-50 px-4 py-2 rounded-full">Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Story;
