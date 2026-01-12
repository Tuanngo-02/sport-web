import { Outlet } from 'react-router'; // Sửa 'react-router' → 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Footer from './components/Footer';
function App() {
  return (
    <>
      <NavBar />
      <div className='mt-25 '> 
      <Outlet />
      </div>
      <Footer/>
    </>
  );
}

export default App;
