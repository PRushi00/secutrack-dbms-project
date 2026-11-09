import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Hero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09111F, 0.04);

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x16243A, 2.0);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0x38D6C5, 3.5);
    primaryLight.position.set(5, 5, 5);
    scene.add(primaryLight);

    const secondaryLight = new THREE.PointLight(0x63A5FF, 4, 15);
    secondaryLight.position.set(-4, -2, 3);
    scene.add(secondaryLight);

    // Security Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Layered Icosahedron Core (Shield Core)
    const innerGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x101B2D,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // 2. Wireframe Lattice Cage
    const wireGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38D6C5,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireCore = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireCore);

    // 3. Floating Asset Nodes & Orbital Ring
    const nodeCount = 14;
    const nodesGroup = new THREE.Group();
    coreGroup.add(nodesGroup);

    const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x38D6C5,
      emissive: 0x38D6C5,
      emissiveIntensity: 0.8,
    });

    const critNodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF626D,
      emissive: 0xFF626D,
      emissiveIntensity: 0.9,
    });

    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 2.2 + (i % 3) * 0.25;

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      nodePositions.push(pos);

      const mesh = new THREE.Mesh(nodeGeometry, i === 1 || i === 4 ? critNodeMaterial : nodeMaterial);
      mesh.position.copy(pos);
      nodesGroup.add(mesh);
    }

    // Interconnecting Vector Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x63A5FF,
      transparent: true,
      opacity: 0.25,
    });
    const lineGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 2.2) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(lines);

    // Particle Cloud (Security Signals)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particleCoords[i] = (Math.random() - 0.5) * 12;
      particleCoords[i + 1] = (Math.random() - 0.5) * 12;
      particleCoords[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38D6C5,
      size: 0.035,
      transparent: true,
      opacity: 0.4,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    const onMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.35;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!mediaQuery.matches) {
        // Slow subtle continuous rotation
        coreGroup.rotation.y += 0.005;
        wireCore.rotation.x -= 0.003;
        nodesGroup.rotation.y += 0.002;
        particleSystem.rotation.y -= 0.001;

        // Pointer easing
        coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
        coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

        // Subtle core pulsation
        const scale = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.025;
        innerCore.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up WebGL resources
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(animationFrameId);

      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      innerGeo.dispose();
      innerMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      critNodeMaterial.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] lg:h-[540px] flex items-center justify-center">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing" />

      {/* Fallback Display if WebGL fails */}
      {!webglSupported && (
        <div className="z-20 text-center p-6 cyber-card max-w-md border-border-default">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-glow flex items-center justify-center border border-accent-primary">
            <span className="text-2xl">🛡️</span>
          </div>
          <h4 className="text-lg font-semibold text-text-primary">SecuTrack Cyber Sentinel Core</h4>
          <p className="text-sm text-text-secondary mt-1">
            Real-time topology of 6 monitored production assets and synchronized vulnerability matrices.
          </p>
        </div>
      )}

      {/* Atmospheric Radial Glow behind core */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-primary/10 blur-[100px] pointer-events-none -z-0" />
      <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full bg-accent-secondary/15 blur-[90px] pointer-events-none -z-0 translate-x-12 translate-y-8" />
    </div>
  );
};

