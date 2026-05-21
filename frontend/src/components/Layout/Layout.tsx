import { Navbar } from '../Navbar/Navbar';
import { leftPanel, panels, rightPanel, root } from './Layout.module.css';

interface LayoutProps {
  leftPanelContent: React.ReactNode;
  rightPanelContent: React.ReactNode;
}

export function Layout({ leftPanelContent, rightPanelContent }: LayoutProps) {
  return (
    <div className={root}>
      <Navbar />
      <div className={panels}>
        <div className={leftPanel}>{leftPanelContent}</div>
        <div className={rightPanel}>{rightPanelContent}</div>
      </div>
    </div>
  );
}
