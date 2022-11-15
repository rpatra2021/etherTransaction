//import logo from './logo.svg';
import './App.css';

import Header from './components/layouts/header/header';
import Footer from './components/layouts/footer/footer';
import Main from './components/welcome';

const App = () => {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    )
}

export default App;
