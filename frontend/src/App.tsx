import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <Layout
      leftPanelContent={<div>left</div>}
      rightPanelContent={<div>right</div>}
    />
  );
}

export default App;
