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

// Particle class com tipagem completa e melhorias de performance
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
  private life: number;
  private maxLife: number;

  constructor({ canvas, ctx }: ParticleConfig) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.reset();
    this.life = Math.random() * 200;
    this.maxLife = 200;
  }

  private reset(): void {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.size = Math.random() * 3 + 1;
    this.color = Math.random() > 0.5 ? "0" : "1";
  }

  public update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // Bounce off walls with some energy loss
    if (this.x < 0 || this.x > this.canvas.width) {
      this.vx *= -0.8;
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.vy *= -0.8;
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }

    // Fade out over time
    this.alpha = (this.life / this.maxLife) * 0.8;

    // Reset particle when it dies
    if (this.life <= 0) {
      this.reset();
      this.life = this.maxLife;
    }
  }

  public draw(): void {
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color === "1" ? "#00ff41" : "#ff4100";
    this.ctx.font = `${this.size * 10}px 'Courier New', monospace`;
    this.ctx.fillText(this.color, this.x, this.y);
  }
}

// Interfaces para o componente
interface AnimationStyles {
  textShadow?: string;
  background?: string;
  backgroundClip?: string;
  WebkitBackgroundClip?: string;
  WebkitTextFillColor?: string;
  animation?: string;
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Função para rastrear posição do mouse
  const handleMouseMove = useCallback((e: MouseEvent): void => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Função para inicializar canvas e partículas
  const initializeCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles with better distribution
    particlesRef.current = [];
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push(new Particle({ canvas, ctx }));
    }
  }, []);

  // Função de animação melhorada
  const animate = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with fade effect for trails
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle: Particle) => {
      // Add mouse interaction
      const dx = mousePosition.x - particle.x;
      const dy = mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.01;
        particle.vy += (dy / distance) * force * 0.01;
      }

      particle.update();
      particle.draw();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [mousePosition]);

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
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeCanvas, animate, handleResize, handleMouseMove, isClient]);

  // Estilos tipados para as animações
  const helloTitleStyles: AnimationStyles = {
    textShadow: `
      0 0 20px rgb(139, 92, 246),
      0 0 40px rgb(139, 92, 246),
      0 0 60px rgb(139, 92, 246),
      0 0 80px rgb(139, 92, 246),
      0 0 100px rgb(139, 92, 246)
    `,
    background:
      "linear-gradient(45deg, #ffffff, rgb(139, 92, 246), #00ff41, #ffffff)",
    backgroundSize: "300% 300%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation:
      "textGlow 2s ease-in-out infinite alternate, gradientShift 4s linear infinite",
  };

  const worldSubtitleStyles: AnimationStyles = {
    textShadow: "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(0,255,65,0.3)",
    background:
      "linear-gradient(90deg, #ff0080, #00ffff, #ff4100, #00ff41, #ff0080)",
    backgroundSize: "400% 400%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "rainbowShift 4s linear infinite",
  };

  const rainbowGradientStyle: React.CSSProperties = {
    background: `conic-gradient(
      from 0deg,
      rgb(139, 92, 246) 0deg,
      rgb(168, 85, 247) 36deg,
      rgb(192, 38, 211) 72deg,
      rgb(225, 29, 72) 108deg,
      rgb(249, 115, 22) 144deg,
      rgb(234, 179, 8) 180deg,
      rgb(132, 204, 22) 216deg,
      rgb(34, 197, 94) 252deg,
      rgb(16, 185, 129) 288deg,
      rgb(6, 182, 212) 324deg,
      rgb(139, 92, 246) 360deg
    )`,
    animation: "rotate 20s linear infinite",
    zIndex: 2,
  };

  // Snippets de código flutuantes tipados com mais variedade
  const floatingCodeSnippets: FloatingCodeSnippet[] = [
    {
      id: "snippet-1",
      text: '<Hero className="futuristic" />',
      className:
        "absolute top-20 left-10 text-green-400 font-mono text-sm opacity-70 hover:opacity-100 transition-all duration-300",
      style: { animation: "float 6s ease-in-out infinite" },
    },
    {
      id: "snippet-2",
      text: "const nextGen = await AI.build()",
      className:
        "absolute top-40 right-10 text-blue-400 font-mono text-sm opacity-70 hover:opacity-100 transition-all duration-300",
      style: {
        animation: "float 6s ease-in-out infinite",
        animationDelay: "1s",
      },
    },
    {
      id: "snippet-3",
      text: "import { Future } from 'tomorrow'",
      className:
        "absolute bottom-40 left-20 text-purple-400 font-mono text-sm opacity-70 hover:opacity-100 transition-all duration-300",
      style: {
        animation: "float 6s ease-in-out infinite",
        animationDelay: "2s",
      },
    },
    {
      id: "snippet-4",
      text: "export default Innovation",
      className:
        "absolute bottom-20 right-20 text-pink-400 font-mono text-sm opacity-70 hover:opacity-100 transition-all duration-300",
      style: {
        animation: "float 6s ease-in-out infinite",
        animationDelay: "3s",
      },
    },
    {
      id: "snippet-5",
      text: "useEffect(() => { magic() }, [])",
      className:
        "absolute top-1/2 left-5 text-cyan-400 font-mono text-xs opacity-60 hover:opacity-100 transition-all duration-300",
      style: {
        animation: "float 8s ease-in-out infinite",
        animationDelay: "4s",
      },
    },
    {
      id: "snippet-6",
      text: "{ isAwesome && <Component /> }",
      className:
        "absolute top-1/3 right-5 text-yellow-400 font-mono text-xs opacity-60 hover:opacity-100 transition-all duration-300",
      style: {
        animation: "float 7s ease-in-out infinite",
        animationDelay: "2.5s",
      },
    },
  ];

  // Gerar números binários com padrões mais interessantes
  const digitalRainData = useMemo(() => {
    if (!isClient) return [];

    return Array.from({ length: 25 }, (_, i: number) => ({
      id: `rain-${i}`,
      left: `${i * 4}%`,
      animationDelay: `${i * 0.15}s`,
      speed: 2 + Math.random() * 3,
      digits: Array.from({ length: 30 }, (_, j: number) => ({
        id: `digit-${i}-${j}`,
        value:
          Math.random() > 0.7
            ? "1"
            : Math.random() > 0.8
            ? "0"
            : Math.random() > 0.9
            ? "█"
            : "▓",
      })),
    }));
  }, [isClient]);

  // Gerar array de números binários para chuva digital
  const generateDigitalRain = (): JSX.Element[] => {
    return digitalRainData.map((rain) => (
      <div
        key={rain.id}
        className="absolute text-green-400 font-mono text-xs leading-tight"
        style={{
          left: rain.left,
          animation: `digitalRain ${rain.speed}s linear infinite ${rain.animationDelay}`,
          filter: "blur(0.5px)",
        }}
      >
        {rain.digits.map((digit, index) => (
          <div
            key={digit.id}
            className="opacity-40 hover:opacity-80 transition-opacity duration-300"
            style={{
              color:
                index % 7 === 0
                  ? "#00ff41"
                  : index % 11 === 0
                  ? "#ff4100"
                  : "#00ff41",
              textShadow: "0 0 10px currentColor",
            }}
          >
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
        className="absolute inset-0 opacity-30"
        style={{ zIndex: 1 }}
      />

      {/* Rainbow Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={rainbowGradientStyle}
      />

      {/* Digital Rain Effect */}
      <div className="absolute inset-0 opacity-40" style={{ zIndex: 3 }}>
        {isClient && generateDigitalRain()}
      </div>

      {/* Glitch overlay effect */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-multiply"
        style={{ zIndex: 4 }}
      >
        <div
          className="w-full h-full bg-gradient-to-b from-transparent via-red-500 to-transparent animate-pulse"
          style={{ animation: "glitch 0.3s linear infinite" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* HELLO Title */}
          <div className="relative group">
            <h1
              className="text-6xl md:text-8xl font-black text-white tracking-wider transform transition-all duration-300 hover:scale-105"
              style={helloTitleStyles}
            >
              HELLO
            </h1>
            <div className="absolute inset-0 text-6xl md:text-8xl font-black text-purple-500 opacity-50 blur-sm animate-pulse">
              HELLO
            </div>
            <div className="absolute inset-0 text-6xl md:text-8xl font-black text-green-400 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300">
              HELLO
            </div>
          </div>

          {/* WORLD Subtitle */}
          <div className="relative group">
            <h2
              className="text-4xl md:text-6xl font-bold text-white tracking-widest transform transition-all duration-300 hover:scale-105"
              style={worldSubtitleStyles}
            >
              WORLD
            </h2>
            <div className="absolute inset-0 text-4xl md:text-6xl font-bold text-cyan-400 opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300">
              WORLD
            </div>
          </div>

          {/* Subtitle melhorada */}
          <div className="relative">
            <p className="text-lg md:text-xl text-gray-300 font-mono tracking-wide max-w-3xl mx-auto leading-relaxed">
              CONSTRUINDO SOFTWARE DE
              <br />
              <span className="text-green-400 font-bold animate-pulse">
                PRÓXIMA GERAÇÃO COM IA,
              </span>
              <br />
              <span
                className="text-purple-400 font-bold animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                AGENTES E MUITO ALÉM
              </span>
            </p>
          </div>

          {/* CTA Button melhorado */}
          <div className="pt-8">
            <button
              className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 transform"
              type="button"
              aria-label="Começar a codar"
            >
              <span className="relative z-10 tracking-wider">
                COMEÇAR A CODAR
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-300 -z-10"></div>
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

      {/* CSS Animations Aprimoradas */}
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
              0 0 70px rgb(139, 92, 246), 0 0 90px rgb(139, 92, 246),
              0 0 110px rgb(139, 92, 246);
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

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(1deg);
          }
          50% {
            transform: translateY(-5px) rotate(-1deg);
          }
          75% {
            transform: translateY(-15px) rotate(0.5deg);
          }
        }

        @keyframes glitch {
          0% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(-2px);
          }
          20% {
            transform: translateX(2px);
          }
          30% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(1px);
          }
          50% {
            transform: translateX(-1px);
          }
          60% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default VibeCodingHero;
