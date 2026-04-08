/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Hands from '@mediapipe/hands';
import * as Camera from '@mediapipe/camera_utils';
import * as DrawingUtils from '@mediapipe/drawing_utils';
import {
  Camera as CameraIcon,
  CameraOff,
  Hand, 
  MousePointer2, 
  Scissors, 
  Maximize, 
  Settings, 
  Activity, 
  Info,
  ChevronRight,
  Zap,
  Fingerprint
} from 'lucide-react';

interface Gesture {
  id: string;
  name: string;
  command: string;
  icon: ReactNode;
  description: string;
  active: boolean;
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [selectedGesture, setSelectedGesture] = useState<string | null>(null);
  const [detectedGesture, setDetectedGesture] = useState<string>('');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [isDesktop] = useState(() => {
    return typeof window !== 'undefined' && (window as any).electron !== undefined;
  });
  const handsRef = useRef<Hands.Hands | null>(null);
  const cameraRef = useRef<Camera.Camera | null>(null);

  // Auto-update listener
  useEffect(() => {
    if (!isDesktop) return;

    const electron = (window as any).electron;

    // Listen for update events
    electron?.onUpdateAvailable?.(() => {
      console.log('📦 Update available!');
      setUpdateAvailable(true);
    });

    electron?.onUpdateDownloaded?.(() => {
      console.log('✅ Update downloaded!');
      setUpdateDownloaded(true);
    });

    // Check for updates on startup
    electron?.checkForUpdates?.();
  }, [isDesktop]);

  const detectGesture = (landmarks: any): string => {
    if (!landmarks || landmarks.length === 0) return '';

    const hand = landmarks[0];

    // Barmoqlarni nomalari
    const WRIST = hand[0];
    const THUMB_TIP = hand[4];
    const INDEX_TIP = hand[8];
    const MIDDLE_TIP = hand[12];
    const RING_TIP = hand[16];
    const PINKY_TIP = hand[20];

    const THUMB_IP = hand[3];
    const INDEX_PIP = hand[6];
    const MIDDLE_PIP = hand[10];
    const RING_PIP = hand[14];
    const PINKY_PIP = hand[18];

    // Masofa hisoblash funksiyasi
    const distance = (p1: any, p2: any) => {
      return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
      );
    };

    // Barmoq ochiq yoki yopiq ekanini aniqlash
    const isFingerOpen = (tip: any, pip: any, threshold = 0.05) => {
      return distance(tip, pip) > threshold;
    };

    // Harakatlari aniqlash
    const thumbOpen = isFingerOpen(THUMB_TIP, THUMB_IP, 0.05);
    const indexOpen = isFingerOpen(INDEX_TIP, INDEX_PIP, 0.05);
    const middleOpen = isFingerOpen(MIDDLE_TIP, MIDDLE_PIP, 0.05);
    const ringOpen = isFingerOpen(RING_TIP, RING_PIP, 0.05);
    const pinkyOpen = isFingerOpen(PINKY_TIP, PINKY_PIP, 0.05);

    // Pinch aniqlash (barmoq va bosh barmoq yaqin)
    const pinchDistance = distance(THUMB_TIP, INDEX_TIP);
    const isPinch = pinchDistance < 0.05 && !middleOpen && !ringOpen && !pinkyOpen;

    // Peace belgisi (INDEX va MIDDLE ochiq, qolganlar yopiq)
    const isPeace = indexOpen && middleOpen && !ringOpen && !pinkyOpen && !thumbOpen;

    // Musht belgisi (barcha barmolar yopiq)
    const isFist = !indexOpen && !middleOpen && !ringOpen && !pinkyOpen && !thumbOpen;

    // Ochiq kaft (barcha barmolar ochiq)
    const isOpenPalm = indexOpen && middleOpen && ringOpen && pinkyOpen && thumbOpen;

    // Barmoq ko'rsatish (INDEX ochiq, qolganlar yopiq)
    const isPoint = indexOpen && !middleOpen && !ringOpen && !pinkyOpen && !thumbOpen;

    // Harakat tasnifi
    if (isFist) return 'fist';
    if (isPinch) return 'pinch';
    if (isPeace) return 'swipe';
    if (isOpenPalm) return 'palm';
    if (isPoint) return 'point';

    return '';
  };

  const onResults = (results: any) => {
    if (!canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d')!;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Qo'lni chizish
    if (results.landmarks && results.landmarks.length > 0) {
      for (const landmarks of results.landmarks) {
        DrawingUtils.drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 5,
        });
        DrawingUtils.drawLandmarks(canvasCtx, landmarks, {
          color: '#FF0000',
          lineWidth: 2,
        });
      }

      // Aniqlangan harakatni o'rnatish
      const gesture = detectGesture(results.landmarks);
      if (gesture) {
        setDetectedGesture(gesture);
        setSelectedGesture(gesture);

        // Execute gesture action in Electron
        if (isDesktop && (window as any).electron?.executeGestureAction) {
          (window as any).electron.executeGestureAction(gesture).catch((e: any) => {
            console.error('Gesture action error:', e);
          });
        }
      }
    }

    canvasCtx.restore();
  };

  const gestures: Gesture[] = [
    {
      id: 'point',
      name: 'Barmoqni yurgizish',
      command: 'Mishkani boshqarish',
      icon: <MousePointer2 className="w-6 h-6" />,
      description: 'Ko\'rsatkich barmog\'ingiz bilan kursor harakatini boshqaring.',
      active: true
    },
    {
      id: 'pinch',
      name: 'Pinch (chimchilash)',
      command: 'Obyektni ushlash',
      icon: <Hand className="w-6 h-6" />,
      description: 'Ikki barmoqni birlashtirib fayllarni yoki oynalarni ushlang.',
      active: true
    },
    {
      id: 'swipe',
      name: 'Svayp (surish)',
      command: 'Oynalarni almashtirish',
      icon: <ChevronRight className="w-6 h-6" />,
      description: 'Qo\'lingizni chapga yoki o\'ngga siljitib ish stollarini o\'zgartiring.',
      active: false
    },
    {
      id: 'fist',
      name: 'Musht tugish',
      command: 'Skrinshot olish',
      icon: <Scissors className="w-6 h-6" />,
      description: 'Qo\'lingizni musht qilib joriy ekranni rasmga oling.',
      active: true
    },
    {
      id: 'palm',
      name: 'Ochiq kaft',
      command: 'To\'xtatish / Play',
      icon: <Activity className="w-6 h-6" />,
      description: 'Musiqa yoki videoni to\'xtatish uchun kaftingizni ko\'rsating.',
      active: true
    }
  ];

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      if (!isCameraEnabled) {
        setCameraActive(false);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);

          // Initialize MediaPipe Hands
          const hands = new Hands.Hands({
            locateFile: (file: string) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
          });

          hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });

          handsRef.current = hands;

          hands.onResults(onResults);

          const camera = new Camera.Camera(videoRef.current, {
            onFrame: async () => {
              await hands.send({ image: videoRef.current! });
            },
            width: 1280,
            height: 720,
          });

          cameraRef.current = camera;
          camera.start();
        }
      } catch (err) {
        console.error("Kameraga ruxsat berilmadi:", err);
        setCameraActive(false);
      }
    }
    
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [isCameraEnabled]);

  return (
    <div className="min-h-screen p-6 flex gap-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* Sidebar / Camera Section */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 flex flex-col gap-6 z-10"
      >
        <div className="glass rounded-3xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {cameraActive ? 'Live Feed' : 'Kamera Ochiq'}
              </span>
            </div>
            <button 
              onClick={() => setIsCameraEnabled(!isCameraEnabled)}
              className={`p-1.5 rounded-lg transition-colors ${isCameraEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-500'}`}
              title={isCameraEnabled ? "Kamerani o'chirish" : "Kamerani yoqish"}
            >
               {isCameraEnabled ? <CameraIcon className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {!cameraActive && (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                {isCameraEnabled ? (
                   <>
                     <CameraIcon className="w-8 h-8 opacity-20 animate-pulse" />
                     <span className="text-xs">Kamera yuklanmoqda...</span>
                   </>
                 ) : (
                  <>
                    <CameraOff className="w-8 h-8 opacity-20" />
                    <span className="text-xs">Kamera o'chirilgan</span>
                  </>
                )}
              </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-opacity duration-700 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
            />
            
            {/* Canvas overlay for gesture detection */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: cameraActive ? 'block' : 'none' }}
            />

            {/* Camera Overlay UI */}
            <div className="absolute inset-0 border-[20px] border-transparent pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/50" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/50" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/50" />
            </div>
          </div>

          <div className="p-4 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">
                {detectedGesture ? 'Harakati aniqlandi' : 'Harakati kutilmoqda'}
              </span>
              <span className="text-xs font-mono text-blue-400">
                {detectedGesture ? (
                  gestures.find(g => g.id === detectedGesture)?.name || detectedGesture
                ) : (
                  '—'
                )}
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: detectedGesture ? '100%' : '0%' }}
                className="h-full bg-green-500"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 flex-1 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Tizim holati
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-slate-400">CPU Yuklamasi</span>
              <span className="text-xs font-mono">12%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-slate-400">Kechikish (Latency)</span>
              <span className="text-xs font-mono">14ms</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-slate-400">Dastur versiyasi</span>
              <span className="text-xs font-mono">v2.4.0</span>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <button className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Kalibratsiya qilish
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Section */}
      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 flex flex-col gap-6 z-10"
      >
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">GestureControl</h1>
              {isDesktop && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  Desktop
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">Aqlli qo'l harakatlari orqali boshqaruv markazi</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 rounded-2xl glass glass-hover">
              <Info className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-3 rounded-2xl glass glass-hover">
              <Maximize className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white px-2">Faol harakatlar</h2>
            <div className="space-y-3">
              {gestures.map((gesture) => (
                <motion.div
                  key={gesture.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedGesture(gesture.id)}
                  className={`p-4 rounded-3xl cursor-pointer transition-all duration-300 border ${
                    selectedGesture === gesture.id 
                      ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                      : 'glass border-white/5 glass-hover'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      selectedGesture === gesture.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'
                    }`}>
                      {gesture.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{gesture.name}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mt-0.5">
                        Buyruq: <span className="text-blue-400">{gesture.command}</span>
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${gesture.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-600'}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white px-2">Harakat tafsilotlari</h2>
            <AnimatePresence mode="wait">
              {selectedGesture ? (
                <motion.div
                  key={selectedGesture}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-[2rem] p-8 flex flex-col items-center text-center h-full"
                >
                  <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                    {gestures.find(g => g.id === selectedGesture)?.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {gestures.find(g => g.id === selectedGesture)?.name}
                  </h3>
                  <div className="px-4 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-mono mb-6">
                    {gestures.find(g => g.id === selectedGesture)?.command}
                  </div>
                  <p className="text-slate-400 leading-relaxed max-w-xs mb-8">
                    {gestures.find(g => g.id === selectedGesture)?.description}
                  </p>
                  
                  <div className="w-full grid grid-cols-2 gap-4 mt-auto">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Muvaffaqiyat</span>
                      <span className="text-lg font-mono text-white">99.2%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Ishlatilgan</span>
                      <span className="text-lg font-mono text-white">1,240</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-slate-300">
                    Sozlamalarni o'zgartirish
                  </button>
                </motion.div>
              ) : (
                <div className="glass rounded-[2rem] p-8 flex flex-col items-center justify-center text-center h-full border-dashed border-white/10">
                  <Fingerprint className="w-16 h-16 text-slate-700 mb-4" />
                  <p className="text-slate-500">Tafsilotlarni ko'rish uchun harakatni tanlang</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
