import React, { useRef, useState, useCallback } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

const THRESHOLD = 70;
const MAX_PULL = 110;
const RESISTANCE = 0.5;

export default function PullToRefresh({ onRefresh, children, disabled = false }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const startY = useRef(null);
  const pulling = useRef(false);

  const handleTouchStart = useCallback((e) => {
    if (disabled || refreshing) return;
    if (window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
    setTransitioning(false);
  }, [disabled, refreshing]);

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || startY.current == null) return;
    if (window.scrollY > 0) {
      setPull(0);
      pulling.current = false;
      return;
    }
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setPull(Math.min(MAX_PULL, delta * RESISTANCE));
    } else {
      setPull(0);
      pulling.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    startY.current = null;

    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPull(THRESHOLD);
      setTransitioning(true);
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPull(0);
        setTimeout(() => setTransitioning(false), 250);
      }
    } else {
      setTransitioning(true);
      setPull(0);
      setTimeout(() => setTransitioning(false), 250);
    }
  }, [pull, refreshing, onRefresh]);

  const indicator = refreshing ? (
    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
  ) : (
    <ArrowDown
      className="w-5 h-5 text-slate-400 transition-transform duration-200"
      style={{ transform: `rotate(${pull / THRESHOLD * 180}deg)` }}
    />
  );

  const spacerStyle = {
    height: pull,
    transition: transitioning ? 'height 0.25s ease-out' : 'none',
    overflow: 'hidden',
    opacity: pull > 0 || refreshing ? 1 : 0,
    display: pull === 0 && !refreshing && !transitioning ? 'none' : 'flex',
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      <div style={spacerStyle} className="items-center justify-center px-4 pt-2">
        <div className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-full shadow-xs">
          {indicator}
        </div>
      </div>
      {children}
    </div>
  );
}