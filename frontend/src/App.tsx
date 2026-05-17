import banner from '@/assets/banner.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header"></header>

      <main className="app-main">
        <img
          src={banner}
          alt="GenomeLens banner"
          className="app-banner"
          width={450}
        />
        <p>Browse, Filter, Search and Visualize genomes and more.</p>
      </main>

      <footer className="app-footer">
        <small>GenomeLens © {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

export default App;
