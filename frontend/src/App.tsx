import { DetailPanel } from './components/DetailPanel/DetailPanel';
import { GeneTable } from './components/GeneTable/GeneTable';
import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <Layout
      leftPanelContent={<GeneTable />}
      rightPanelContent={<DetailPanel />}
    />
  );
}

export default App;
