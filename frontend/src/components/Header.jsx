import { Camera, Cloud } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-600 rounded-lg">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Smart CCTV Portal
              </h1>
              <p className="text-slate-400 mt-1">
                IoT Event Monitoring + Zoho CRM Integration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg border border-slate-600">
            <Cloud className="w-5 h-5 text-teal-400" />
            <span className="text-teal-400 font-medium">Zoho CRM</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

