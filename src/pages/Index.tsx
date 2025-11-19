import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FloatingParticles from "@/components/FloatingParticles";
import { useState, useEffect } from "react";

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: '#0B0F16' }}
    >
      {/* GMUNK Glowing Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 transition-transform duration-500 ease-out"
          style={{ 
            background: 'radial-gradient(circle, #09FBD3 0%, transparent 70%)',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 transition-transform duration-500 ease-out"
          style={{ 
            background: 'radial-gradient(circle, #FF8E4A 0%, transparent 70%)',
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 transition-transform duration-500 ease-out"
          style={{ 
            background: 'radial-gradient(circle, #8378FF 0%, transparent 70%)',
            transform: `translate(calc(-50% + ${mousePosition.x * 10}px), calc(-50% + ${mousePosition.y * 10}px))`
          }}
        />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Subtle Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Faint Geometric Shape - Hexagon Halo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg 
          width="800" 
          height="800" 
          viewBox="0 0 800 800" 
          className="opacity-[0.06] transition-transform duration-700 ease-out"
          style={{ 
            filter: 'blur(2px)',
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
          }}
        >
          <polygon 
            points="400,50 650,212.5 650,537.5 400,700 150,537.5 150,212.5"
            fill="none"
            stroke="#09FBD3"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Top-left Badge */}
      <div className="absolute top-8 left-8 z-20">
        <div 
          className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(9, 251, 211, 0.3)',
            color: '#9CA3AF',
            backdropFilter: 'blur(10px)'
          }}
        >
          MVP · v1.0
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
        <div className="space-y-4">
          <h1 className="mb-4 text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: '#F9FAFB' }}>
            BlockPlane
          </h1>
          <p className="text-xl md:text-2xl mb-3" style={{ color: '#9CA3AF' }}>
            Material Lifecycle Analysis
          </p>
          <p 
            className="text-xs md:text-sm tracking-[0.2em] uppercase font-light"
            style={{ color: 'rgba(148, 163, 184, 0.7)' }}
          >
            Carbon · Circularity · Materials · Clarity
          </p>
        </div>
        
        <Link to="/lifecycle">
          <Button 
            size="lg" 
            className="px-12 py-7 rounded-full text-lg font-bold transition-all duration-300 hover:scale-[1.03] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #09FBD3 0%, #3CE4B2 50%, #FF8E4A 100%)',
              color: '#0B0F16',
              boxShadow: '0 0 40px rgba(9, 251, 211, 0.8), 0 0 60px rgba(9, 251, 211, 0.4)'
            }}
          >
            {/* Inner glow on hover */}
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              }}
            />
            <span className="relative z-10">View Lifecycle Breakdown</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
