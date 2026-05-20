import { Navbar } from '../Navbar/Navbar';
import { body, leftPanel, rightPanel, wrapper } from './Layout.module.css';

interface LayoutProps {
  leftPanelContent: React.ReactNode;
  rightPanelContent: React.ReactNode;
}

export function Layout({ leftPanelContent, rightPanelContent }: LayoutProps) {
  return (
    <div className={body}>
      <Navbar />
      <main className={wrapper}>
        <div className={leftPanel}>{leftPanelContent}</div>
        <div className={rightPanel}>{rightPanelContent}</div>
      </main>
    </div>
  );
}
