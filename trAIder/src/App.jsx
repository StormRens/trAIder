import Header from './Header.jsx'
import Footer from './Footer.jsx' 
import Food from './Food.jsx';

//This is where we are going to be adding things to the live/local website.
//When we put things in here, it does matter the order and the syntax.
function App() {
  return(
    <div className="app">
      <Header/>
      <main className="content">
          {/*The main content is going to go here*/}
      </main>
      <Footer/>
    </div>

  );
}

export default App
