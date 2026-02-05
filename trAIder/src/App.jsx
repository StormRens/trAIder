import Header from './Header.jsx'
import Footer from './Footer.jsx' 
import StockTicker from './StockTicker.jsx'
import { useState } from 'react';
import AboutMe from './sections/AboutMe.jsx';

//This is where we are going to be adding things to the live/local website.
//When we put things in here, it does matter the order and the syntax.
function App() {

  const [activeSelection, setActiveSelection] = useState('Stocks'); 
  
  const renderSection = () => {
    // For now, just return a placeholder until we build out all sections
    switch(activeSelection) {
      case 'about':
        return <AboutMe />;
      default:
        return <div></div>;
    }
  }

  return(
    <div className="app">
      {/* Header */}
      <Header onNavigate = {setActiveSelection}/>

      {/* Stock Ticker */}
      <StockTicker/>

      {/* Main Content Her */}
      <main className="content">
          {renderSection()}
      </main>
      <Footer/>
    </div>

  );
}

export default App
