import NavBar from './components/NavBar'; // adjust the path as needed
import './App.css';

function App() {
  return (
    <>
      <NavBar />

      <main className="main-content">
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => alert("Clicked!")}>
            Test Button
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
