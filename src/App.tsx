import React, { Component } from 'react';
import Board from './Board';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>2048</h1>
        </header>
        <section className="App-section">
          <Board></Board>
        </section>
      </div>
    );
  }
}

export default App;
