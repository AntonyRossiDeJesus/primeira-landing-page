"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
  JSX,
} from "react";

// Interfaces para tipagem
interface ParticleConfig {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

// Particle class com tipagem completa
class Particle implements ParticleState {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public alpha: number;
  public size: number;
  public color: string;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor({ canvas, ctx }: ParticleConfig) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.size = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? "0" : "1";
  }

  public update(): void {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  public draw(): void {
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = "#00ff41";
    this.ctx.font = `${this.size * 8}px monospace`;
    this.ctx.fillText(this.color, this.x, this.y);
  }
}

// Interfaces para o componente
interface AnimationStyles {
  textShadow: string;
  background: string;
  backgroundClip?: string;
  WebkitBackgroundClip?: string;
  WebkitTextFillColor?: string;
  animation: string;
  backgroundSize?: string;
}

interface FloatingCodeSnippet {
  id: string;
  text: string;
  className: string;
  style: React.CSSProperties;
}

const VibeCodingHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Função para inicializar canvas e partículas
  const initializeCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push(new Particle({ canvas, ctx }));
    }
  }, []);

  // Função de animação
  const animate = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle: Particle) => {
      particle.update();
      particle.draw();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Função para redimensionamento
  const handleResize = useCallback((): void => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    initializeCanvas();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeCanvas, animate, handleResize, isClient]);

  // Estilos tipados para as animações
  const helloTitleStyles: AnimationStyles = {
    textShadow: `
      0 0 20px rgb(139, 92, 246),
      0 0 40px rgb(139, 92, 246),
      0 0 60px rgb(139, 92, 246),
      0 0 80px rgb(139, 92, 246)
    `,
    background: "linear-gradient(45deg, #ffffff, rgb(139, 92, 246), #ffffff)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "textGlow 2s ease-in-out infinite alternate",
  };

  const worldSubtitleStyles: AnimationStyles = {
    textShadow: "0 0 30px rgba(255,255,255,0.5)",
    background: "linear-gradient(90deg, #ff0080, #00ffff, #ff0080)",
    backgroundSize: "200% 200%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "rainbowShift 3s linear infinite",
  };

  const rainbowGradientStyle: React.CSSProperties = {
    background: `linear-gradient(
      45deg,
      rgb(139, 92, 246) 0%,
      rgb(168, 85, 247) 10%,
      rgb(192, 38, 211) 20%,
      rgb(225, 29, 72) 30%,
      rgb(249, 115, 22) 40%,
      rgb(234, 179, 8) 50%,
      rgb(132, 204, 22) 60%,
      rgb(34, 197, 94) 70%,
      rgb(16, 185, 129) 80%,
      rgb(6, 182, 212) 90%,
      rgb(59, 130, 246) 100%
    )`,
    zIndex: 2,
  };

  // Snippets de código flutuantes tipados
  const floatingCodeSnippets: FloatingCodeSnippet[] = [
    {
      id: "snippet-1",
      text: '<div className="hero">',
      className:
        "absolute top-20 left-10 text-green-400 font-mono text-sm opacity-60 animate-bounce",
      style: {},
    },
    {
      id: "snippet-2",
      text: 'const hello = "world"',
      className:
        "absolute top-40 right-10 text-blue-400 font-mono text-sm opacity-60 animate-bounce",
      style: { animationDelay: "0.5s" },
    },
    {
      id: "snippet-3",
      text: 'import React from "react"',
      className:
        "absolute bottom-40 left-20 text-purple-400 font-mono text-sm opacity-60 animate-bounce",
      style: { animationDelay: "1s" },
    },
    {
      id: "snippet-4",
      text: "export default Hero",
      className:
        "absolute bottom-20 right-20 text-pink-400 font-mono text-sm opacity-60 animate-bounce",
      style: { animationDelay: "1.5s" },
    },
  ];

  // Gerar números binários estáticos para evitar hydration mismatch
  const digitalRainData = useMemo(() => {
    if (!isClient) return [];

    return Array.from({ length: 20 }, (_, i: number) => ({
      id: `rain-${i}`,
      left: `${i * 5}%`,
      animationDelay: `${i * 0.1}s`,
      digits: Array.from({ length: 20 }, (_, j: number) => ({
        id: `digit-${i}-${j}`,
        value: Math.random() > 0.5 ? "1" : "0",
      })),
    }));
  }, [isClient]);

  // Gerar array de números binários para chuva digital
  const generateDigitalRain = (): JSX.Element[] => {
    return digitalRainData.map((rain) => (
      <div
        key={rain.id}
        className="absolute text-green-400 font-mono text-xs"
        style={{
          left: rain.left,
          animation: `digitalRain 3s linear infinite ${rain.animationDelay}`,
        }}
      >
        {rain.digits.map((digit) => (
          <div key={digit.id} className="opacity-50">
            {digit.value}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-20"
        style={{ zIndex: 1 }}
      />

      {/* Rainbow Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={rainbowGradientStyle}
      />

      {/* Digital Rain Effect */}
      <div className="absolute inset-0 opacity-30" style={{ zIndex: 3 }}>
        {isClient && generateDigitalRain()}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* HELLO Title */}
          <div className="relative">
            <h1
              className="text-6xl md:text-8xl font-black text-white tracking-wider"
              style={helloTitleStyles}
            >
              HELLO
            </h1>
            <div className="absolute inset-0 text-6xl md:text-8xl font-black text-purple-500 opacity-50 blur-sm animate-pulse">
              HELLO
            </div>
          </div>

          {/* WORLD Subtitle */}
          <div className="relative">
            <h2
              className="text-4xl md:text-6xl font-bold text-white tracking-widest"
              style={worldSubtitleStyles}
            >
              WORLD
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 font-mono tracking-wide max-w-3xl mx-auto leading-relaxed">
            BUILDING NEXT-GENERATION
            <br />
            <span className="text-green-400 font-bold">
              SOFTWARE WITH AI, CHAT,
            </span>
            <br />
            <span className="text-purple-400 font-bold">
              AGENTS, AND BEYOND
            </span>
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              type="button"
              aria-label="Start coding"
            >
              <span className="relative z-10">START CODING</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>

          {/* Floating Code Snippets */}
          {floatingCodeSnippets.map((snippet: FloatingCodeSnippet) => (
            <div
              key={snippet.id}
              className={snippet.className}
              style={snippet.style}
            >
              {snippet.text}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes digitalRain {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes textGlow {
          from {
            text-shadow: 0 0 20px rgb(139, 92, 246), 0 0 40px rgb(139, 92, 246),
              0 0 60px rgb(139, 92, 246);
          }
          to {
            text-shadow: 0 0 30px rgb(139, 92, 246), 0 0 50px rgb(139, 92, 246),
              0 0 70px rgb(139, 92, 246), 0 0 90px rgb(139, 92, 246);
          }
        }

        @keyframes rainbowShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default VibeCodingHero;
