import { useCallback, useRef, useState } from 'react';
import { Navbar } from '../Navbar/Navbar';
import {
  divider,
  leftPanel,
  panels,
  rightPanel,
  root,
} from './Layout.module.css';

const MIN_WIDTH = 460;
const MAX_WIDTH = 1220;
const DEFAULT_WIDTH = 560;

interface LayoutProps {
  leftPanelContent: React.ReactNode;
  rightPanelContent: React.ReactNode;
}

export function Layout({ leftPanelContent, rightPanelContent }: LayoutProps) {
  const [leftWidth, setLeftWidth] = useState(DEFAULT_WIDTH);
  const dragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setLeftWidth((prev) => {
      const next = prev + e.movementX;
      return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next));
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className={root}>
      <Navbar />
      <div
        className={panels}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className={leftPanel} style={{ width: leftWidth }}>
          {leftPanelContent}
        </div>
        <div
          className={divider}
          onPointerDown={onPointerDown}
          role="separator"
          aria-label="Resize panels"
          title="Drag to resize"
        />
        <div className={rightPanel}>{rightPanelContent}</div>
      </div>
    </div>
  );
}
