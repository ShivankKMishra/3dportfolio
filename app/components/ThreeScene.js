"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ThreeScene = () => {
  const mountRef = useRef(null);
  const modelRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const clockRef = useRef(new THREE.Clock()); // Clock for animation timing

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current.position.set(4, -0.1, 0.5);

    // Renderer setup with transparency
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable transparency
    });
    rendererRef.current.setClearColor(0x000000, 0); // Explicit transparency
    const canvas = rendererRef.current.domElement;

    // Canvas styling
    canvas.classList.add("rounded-canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";

    // Append canvas to the DOM
    mountRef.current.appendChild(canvas);

    // Update canvas size
    const updateCanvasSize = () => {
      const width = window.innerWidth * 0.5;
      const height = window.innerHeight * 0.5;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    updateCanvasSize();

    // OrbitControls setup
    controlsRef.current = new OrbitControls(cameraRef.current, canvas);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.1;
    controlsRef.current.enableZoom = true;
    controlsRef.current.minDistance = 1;
    controlsRef.current.maxDistance = 20;

    // RGB Lighting setup
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(9, 5, 5);

    const redLight = new THREE.PointLight(0xff0000, 0.8); // Red light
    redLight.position.set(-5, 3, 2);

    const blueLight = new THREE.PointLight(0x0000ff, 0.8); // Blue light
    blueLight.position.set(5, -3, -2);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white ambient light

    scene.add(directionalLight, redLight, blueLight, ambientLight);

    // Model loading
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/sculpt2.glb",
      (gltf) => {
        modelRef.current = gltf.scene;

        // Fix for distortion and transparency issues
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.transparent = false; // Disable transparency
              child.material.depthWrite = true; // Enable depth writing
              child.material.depthTest = true; // Enable depth testing
              child.material.side = THREE.DoubleSide; // Render both sides of the mesh
            }
          }
        });

        // Center and scale model
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        modelRef.current.position.sub(center);

        const size = box.getSize(new THREE.Vector3()).length();
        const cameraDistance =
          size / (2 * Math.tan((Math.PI * cameraRef.current.fov) / 360));
        cameraRef.current.position.z = cameraDistance * 1.5;

        scene.add(modelRef.current);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // Custom dancing animation
    const danceAnimation = () => {
      if (modelRef.current) {
        // Add a bouncing effect
        const bounceHeight =
          Math.sin(clockRef.current.getElapsedTime() * 2) * 0.1;
        modelRef.current.position.y = bounceHeight;

        // Add a swaying effect
        const swayAngle = Math.sin(clockRef.current.getElapsedTime() * 2) * 0.2;
        modelRef.current.rotation.z = swayAngle;

        // Add a spinning effect
        modelRef.current.rotation.y += 0.01;
      }
    };

    // Animation loop
    const animate = () => {
      const delta = clockRef.current.getDelta(); // Get time delta for animations

      // Update the custom dancing animation
      danceAnimation();

      controlsRef.current.update();
      rendererRef.current.render(scene, cameraRef.current);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => updateCanvasSize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(canvas);
      }
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
      controlsRef.current.dispose();
      rendererRef.current.dispose();
      dracoLoader.dispose();
      scene.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default ThreeScene;
