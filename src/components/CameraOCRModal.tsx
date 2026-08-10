/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, RotateCw, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

interface CameraOCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractSuccess: (text: string) => void;
  taskType?: 'solve' | 'convert' | 'debug' | 'ask' | 'scan';
}

export default function CameraOCRModal({
  isOpen,
  onClose,
  onExtractSuccess,
  taskType = 'scan',
}: CameraOCRModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setCameraError(null);
      setIsProcessing(false);
      setOcrResult(null);
      startCamera();
    } else {
      stopCamera();
      setCameraActive(false);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  useEffect(() => {
    if (cameraActive && !capturedImage && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive, capturedImage]);

  const startCamera = async () => {
    setCameraError(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        streamRef.current = stream;
        setCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        throw new Error('Camera permission is required to scan text.');
      }
    } catch (err: any) {
      console.warn('Webcam initiation failed:', err);
      setCameraError('Camera permission is required to scan text.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(dataUrl);
        stopCamera();
        setCameraActive(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processOCR = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    setOcrResult(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: capturedImage,
          mimeType: 'image/jpeg',
          taskType,
        }),
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setOcrResult(data.text);
      } else {
        throw new Error(data.error || 'Failed to analyze text.');
      }
    } catch (err: any) {
      console.error(err);
      setOcrResult(`[Error Scan] Could not read image. Fallback to basic manual input. Message: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptText = () => {
    if (ocrResult) {
      // Find and strip markup codeblocks if necessary, or just feed text directly
      onExtractSuccess(ocrResult);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setCameraActive(false);
    setOcrResult(null);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="camera-ocr-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#151821] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/20 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0f1117]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-100 text-sm md:text-base">Camera OCR Text Scanner</h3>
              <p className="text-xs text-gray-400 capitalize">Mode: OCR for {taskType}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Action Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cameraActive && !capturedImage ? (
            /* Live Camera mode */
            <div className="relative aspect-video rounded-xl bg-black border border-gray-800 overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 font-semibold tracking-wide text-gray-900 rounded-full flex items-center space-x-2 shadow-lg"
                >
                  <Camera size={18} />
                  <span>Snap Snapshot</span>
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            /* Image Preview */
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl bg-black/50 border border-gray-800 overflow-hidden flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Captured snippet"
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setCameraActive(true);
                  }}
                  className="absolute top-2 right-2 p-2 bg-gray-900/80 rounded-full text-gray-300 hover:text-white"
                >
                  <RotateCw size={16} />
                </button>
              </div>

              {!ocrResult && !isProcessing && (
                <button
                  onClick={processOCR}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 font-bold tracking-wide text-gray-900 rounded-xl flex items-center justify-center space-x-2 transition-all"
                >
                  <Sparkles size={18} />
                  <span>Scan and Extract with AI OCR</span>
                </button>
              )}
            </div>
          ) : (
            /* Selector options */
            <div className="py-6 flex flex-col items-center justify-center space-y-6">
              {cameraError && (
                <div className="w-full p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl flex flex-col space-y-2 text-rose-300 text-xs text-left">
                  <div className="flex items-start space-x-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={startCamera}
                  className="p-5 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/30 rounded-2xl flex flex-col items-center space-y-3 transition group cursor-pointer"
                >
                  <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl group-hover:scale-115 transition">
                    <Camera size={24} />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Start Device Camera</span>
                  <p className="text-[10px] text-gray-400 text-center">Use webcam to snap math or code textbook snippet</p>
                </button>

                <label className="p-5 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex flex-col items-center space-y-3 cursor-pointer transition group">
                  <div className="p-3 bg-indigo-950 text-indigo-400 rounded-xl group-hover:scale-115 transition">
                    <Upload size={24} />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Upload Image File</span>
                  <p className="text-[10px] text-gray-400 text-center">Select PNG, JPG or HEIC screengrab from folder</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* AI Loader */}
          {isProcessing && (
            <div className="p-6 bg-cyan-950/10 border border-cyan-500/20 rounded-xl flex flex-col items-center justify-center space-y-3 text-center">
              <div className="relative w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
              <p className="text-xs font-medium text-cyan-300 animate-pulse">
                CodeSolver AI is performing multimodal OCR...
              </p>
              <p className="text-[10px] text-gray-400">Sending image matrix to Gemini model server-side to extract text</p>
            </div>
          )}

          {/* OCR text Result view */}
          {ocrResult && (
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5 text-emerald-400 text-xs">
                <CheckCircle size={14} />
                <span>Text Successfully Extracted! Check content below:</span>
              </div>
              <div className="p-3 bg-gray-950/80 border border-gray-800 rounded-xl text-xs font-mono text-gray-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {ocrResult}
              </div>
              <button
                onClick={handleAcceptText}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-gray-900 text-xs rounded-xl transition"
              >
                Insert Extracted Text into Input Block
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
