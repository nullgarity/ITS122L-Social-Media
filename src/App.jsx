import NavBar from './components/NavBar';
import './App.css';

function App() {
  return (
    <>
      <NavBar />

      <main className="main-content">
        <h1>MySocial | Like, Post, and Reply to the World</h1>
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
