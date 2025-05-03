import { Link } from 'react-router-dom';
import { Search, Upload, MessageSquare, PlusCircle, MapPin, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-800/30 rounded-full px-4 py-2 text-blue-100">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">Ethiopia's Trusted Medicine Finder</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Health Partner in
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200 mt-2">
                  Finding Medicines
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 max-w-xl">
                Connect with verified pharmacies across Ethiopia. Find medicines, compare prices, and get your prescriptions filled - all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/search" 
                  className="btn bg-white text-blue-700 hover:bg-blue-50 focus:ring-white flex items-center justify-center gap-2 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="h-5 w-5" />
                  <span>Find Medicine</span>
                </Link>
                <Link 
                  to="/upload" 
                  className="btn bg-blue-600/20 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-blue-700/30 focus:ring-white flex items-center justify-center gap-2 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Prescription</span>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 mt-8">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-blue-200 text-sm">Pharmacies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-blue-200 text-sm">Medicines</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-blue-200 text-sm">Users</div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              {/* Main Image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://hospitalnews.com/wp-content/uploads/2023/05/pharmacist-and-patient.jpg"
                  alt="Ethiopian pharmacy professional helping a customer" 
                  className="w-full h-auto rounded-2xl"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-teal-500 text-white p-4 rounded-lg shadow-lg transform rotate-3">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-800 text-white p-4 rounded-lg shadow-lg transform -rotate-6">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234B5563' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">How MedConnect Works</h2>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Finding and purchasing medicines has never been easier. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Search or Upload</h3>
                <p className="text-gray-600 leading-relaxed">
                  Easily search our extensive database of medicines or upload your prescription image. Our system will help you find exactly what you need.
                </p>
              </div>
              <div className="absolute -right-4 top-1/2 hidden md:block">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Find Nearby Pharmacies</h3>
                <p className="text-gray-600 leading-relaxed">
                  Compare prices and availability at pharmacies near you. Get real-time stock information and distance details.
                </p>
              </div>
              <div className="absolute -right-4 top-1/2 hidden md:block">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Connect & Purchase</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chat directly with pharmacies, confirm availability, and get directions. Visit the pharmacy to complete your purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">Powerful Features</h2>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              MedConnect provides everything you need to find and purchase medicines with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Smart Medicine Search</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our intelligent search system helps you find medicines quickly. Search by name, generic compound, or even symptoms to find what you need.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Easy Prescription Upload</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Simply take a photo of your prescription and upload it. Our system will help pharmacies understand your needs and prepare your order.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Real-time Communication</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Chat directly with pharmacies to confirm availability, prices, and get professional advice about your medications.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Verified Pharmacies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every pharmacy on our platform is thoroughly verified and licensed. Rest assured you're getting genuine medicines from trusted professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Find Your Medicine?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of Ethiopians who trust MedConnect for their medical needs. Registration is quick, easy, and completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/register" 
                className="btn bg-white text-blue-700 hover:bg-blue-50 focus:ring-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link 
                to="/search" 
                className="btn bg-blue-700/20 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-blue-700/30 focus:ring-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Search Medicines
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;