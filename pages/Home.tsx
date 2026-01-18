
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[#fdfcf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 mb-8 text-[11px] font-black tracking-[0.2em] text-green-700 uppercase bg-green-100/50 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3 animate-pulse"></span>
                Pioneering Traceability in Sri Lanka
              </div>
              <h1 className="text-5xl md:text-7xl font-bold nature-green mb-8 leading-[1.1]">
                Smartly Grown.<br />
                <span className="text-green-600 italic font-medium">Transparently Tracked.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Discover the future of food. We use IoT monitoring and end-to-end traceability to bring farm-to-fork clarity to every meal.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/story" className="pure-green-btn px-10 py-5 rounded-2xl text-center font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  Discover Our Story
                </Link>
                <Link to="/shop" className="bg-white border-2 border-green-800/10 nature-green px-10 py-5 rounded-2xl text-center font-bold text-lg hover:bg-green-50 transition-all">
                  Shop Online
                </Link>
              </div>
            </div>
            <div className="relative">
               <div className="absolute -top-20 -right-20 w-[120%] h-[120%] bg-green-100 rounded-full blur-[100px] opacity-30"></div>
               <div className="relative z-10 p-4 bg-white rounded-[48px] shadow-2xl border border-green-50">
                  <img 
                    src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1000" 
                    alt="Organic Farming Tech" 
                    className="rounded-[40px] w-full h-[500px] object-cover"
                  />
                  <div className="absolute bottom-12 left-12 right-12 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/50 animate-bounce-slow">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-green-700 tracking-widest uppercase">Live Farm Feed</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                     </div>
                     <div className="text-3xl font-black nature-green">100% Organic</div>
                     <p className="text-xs text-gray-500 mt-1">Real-time Soil & Moisture Analysis</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traceability Roadmap */}
      <section className="py-24 nature-bg border-y border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold nature-green mb-6 heading-font">Our Promise of Transparency</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We leverage technology to bridge the trust gap between Sri Lankan farmers and your dining table.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { title: 'Responsibly Grown', icon: '🌱', desc: 'Verified local farmers following strict organic protocols.' },
              { title: 'IoT Monitoring', icon: '📡', desc: 'Real-time sensors tracking soil and environment 24/7.' },
              { title: 'End-to-End Traceability', icon: '🔗', desc: 'Every batch gets a unique digital passport.' },
              { title: 'In-House Delivery', icon: '🚚', desc: 'No middle-men. Direct delivery from our facility.' },
              { title: 'Safety Verified', icon: '✅', desc: 'Transparent data accessibility for every consumer.' }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-green-50 hover:shadow-xl hover:border-green-200 transition-all h-full">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{step.icon}</div>
                  <h3 className="text-xl font-bold nature-green mb-3 leading-tight">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Content Placeholder */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-green-100 rounded-[52px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative aspect-video bg-gray-900 rounded-[48px] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
                    alt="Smart Farming"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-green-700 fill-current" viewBox="0 0 20 20"><path d="M4.516 7.548c0-.923.651-1.623 1.393-1.623.295 0 .566.106.746.281l5.33 4.164a1 1 0 010 1.56l-5.33 4.164a.994.994 0 01-.746.281c-.742 0-1.393-.7-1.393-1.623V7.548z" /></svg>
                    </button>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 text-center text-white/80 text-xs font-bold tracking-[0.3em] uppercase">
                    How PureChain Contributes to Smart Farming
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold nature-green mb-8 leading-tight">
                Our System in Action
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Watch how we use IoT technology to monitor moisture, nutrient levels, and harvest cycles. We're not just growing food; we're gathering data to ensure your safety.
              </p>
              <div className="space-y-6">
                {[
                  { t: 'Live Monitoring', d: 'Sensors update our database every 15 minutes.' },
                  { t: 'Quality Control', d: 'Automated alerts for any deviation in organic standards.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-green-700" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold nature-green">{item.t}</h4>
                      <p className="text-sm text-gray-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/experience" className="inline-block mt-12 text-green-800 font-black border-b-2 border-green-800 pb-1 hover:text-green-600 hover:border-green-600 transition-colors">
                Book a Live Farm Experience →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
