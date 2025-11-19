import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div 
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: '#0B0F16' }}
    >
      {/* GMUNK Glowing Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #09FBD3 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #FF8E4A 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, #8378FF 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-6">
        <div>
          <h1 className="mb-4 text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: '#F9FAFB' }}>
            BlockPlane
          </h1>
          <p className="text-xl md:text-2xl" style={{ color: '#9CA3AF' }}>
            Material Lifecycle Analysis
          </p>
        </div>
        
        <Link to="/lifecycle">
          <Button 
            size="lg" 
            className="px-10 py-6 rounded-xl text-lg font-bold transition-all hover:scale-[1.05]"
            style={{
              background: 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 50%, #FF8E4A 100%)',
              color: '#0B0F16',
              boxShadow: '0 0 32px rgba(9, 251, 211, 0.7)'
            }}
          >
            View Lifecycle Breakdown
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
