import React, { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Stars
    const stars = [];
    const numStars = 300;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Planets
    const planets = [];
    const numPlanets = 3;
    for (let i = 0; i < numPlanets; i++) {
      planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 20,
        color: `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 30 + 50}%)`,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      });
    }

    // Nebulas
    const nebulas = [];
    const numNebulas = 2;
    for (let i = 0; i < numNebulas; i++) {
      nebulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 150,
        color: `hsla(${Math.random() * 60 + 200}, 70%, 50%, 0.1)`,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
      });
    }

    // Black holes
    const blackHoles = [];
    const numBlackHoles = 1;
    for (let i = 0; i < numBlackHoles; i++) {
      blackHoles.push({
        x: canvas.width * 0.8,
        y: canvas.height * 0.2,
        radius: 40,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebulas
      nebulas.forEach(nebula => {
        nebula.x += nebula.speedX;
        nebula.y += nebula.speedY;
        
        // Wrap around
        if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius;
        if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius;
        if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius;

        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw planets
      planets.forEach(planet => {
        planet.x += planet.speedX;
        planet.y += planet.speedY;
        planet.rotation += planet.rotationSpeed;

        // Wrap around
        if (planet.x < -planet.radius) planet.x = canvas.width + planet.radius;
        if (planet.x > canvas.width + planet.radius) planet.x = -planet.radius;
        if (planet.y < -planet.radius) planet.y = canvas.height + planet.radius;
        if (planet.y > canvas.height + planet.radius) planet.y = -planet.radius;

        // Planet glow
        const glowGradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.radius * 2);
        glowGradient.addColorStop(0, planet.color.replace(')', ', 0.3)').replace('hsl', 'hsla'));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        ctx.save();
        ctx.translate(planet.x, planet.y);
        ctx.rotate(planet.rotation);
        const planetGradient = ctx.createLinearGradient(-planet.radius, 0, planet.radius, 0);
        planetGradient.addColorStop(0, planet.color);
        planetGradient.addColorStop(0.5, planet.color.replace('%)', '%, 80%)'));
        planetGradient.addColorStop(1, planet.color);
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw black holes
      blackHoles.forEach(blackHole => {
        blackHole.pulsePhase += blackHole.pulseSpeed;
        const pulse = Math.sin(blackHole.pulsePhase) * 0.2 + 1;

        // Outer glow
        const outerGradient = ctx.createRadialGradient(
          blackHole.x, blackHole.y, 0,
          blackHole.x, blackHole.y, blackHole.radius * 3 * pulse
        );
        outerGradient.addColorStop(0, 'rgba(255, 0, 110, 0.3)');
        outerGradient.addColorStop(0.5, 'rgba(255, 0, 110, 0.1)');
        outerGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(blackHole.x, blackHole.y, blackHole.radius * 3 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Black hole
        const innerGradient = ctx.createRadialGradient(
          blackHole.x, blackHole.y, 0,
          blackHole.x, blackHole.y, blackHole.radius * pulse
        );
        innerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
        innerGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.7)');
        innerGradient.addColorStop(1, 'rgba(255, 0, 110, 0.2)');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(blackHole.x, blackHole.y, blackHole.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw stars
      stars.forEach(star => {
        star.opacity = 0.3 + Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset) * 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Star glow
        if (star.opacity > 0.8) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="space-canvas" />;
}


