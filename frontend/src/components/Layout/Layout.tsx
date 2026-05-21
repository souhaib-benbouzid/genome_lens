import { setSelectedGene } from '@/store/genesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { Drawer, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSeparatorVertical } from '@tabler/icons-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Navbar } from '../Navbar/Navbar';
import {
  divider,
  dividerHandle,
  leftPanel,
  panels,
  rightPanel,
  root,
} from './Layout.module.css';

const MIN_WIDTH = 680;
const MAX_WIDTH = 1220;
const DEFAULT_WIDTH = 680;

const DRAWER_STYLES = {
  body: { padding: 0, height: '100%', overflow: 'hidden' },
  content: { display: 'flex', flexDirection: 'column' as const },
};

interface LayoutProps {
  leftPanelContent: React.ReactNode;
  rightPanelContent: React.ReactNode;
}

export function Layout({ leftPanelContent, rightPanelContent }: LayoutProps) {
  const [leftWidth, setLeftWidth] = useState(DEFAULT_WIDTH);
  const dragging = useRef(false);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const selectedGene = useAppSelector((s) => s.genes.selectedGene);
  const dispatch = useAppDispatch();

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setLeftWidth((prev) =>
      Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, prev + e.movementX)),
    );
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onDrawerClose = useCallback(
    () => dispatch(setSelectedGene(null)),
    [dispatch],
  );

  const leftPanelStyle = useMemo(
    () => ({ width: isMobile ? '100%' : leftWidth }),
    [isMobile, leftWidth],
  );

  return (
    <div className={root}>
      <Navbar />

      <div
        className={panels}
        onPointerMove={!isMobile ? onPointerMove : undefined}
        onPointerUp={!isMobile ? onPointerUp : undefined}
      >
        <div className={leftPanel} style={leftPanelStyle}>
          {leftPanelContent}
        </div>

        {!isMobile && (
          <>
            <div
              className={divider}
              onPointerDown={onPointerDown}
              role="separator"
              aria-label="Resize panels"
              title="Drag to resize"
            >
              <span className={dividerHandle} aria-hidden="true">
                <IconSeparatorVertical
                  size={28}
                  color="var(--mantine-color-violet-6)"
                />
              </span>
            </div>
            <div className={rightPanel}>{rightPanelContent}</div>
          </>
        )}
      </div>

      {isMobile && (
        <Drawer
          opened={!!selectedGene}
          onClose={onDrawerClose}
          position="bottom"
          size="85%"
          withCloseButton
          title={selectedGene?.gene_symbol ?? selectedGene?.ensembl_id}
          styles={DRAWER_STYLES}
        >
          {rightPanelContent}
        </Drawer>
      )}
    </div>
  );
}
