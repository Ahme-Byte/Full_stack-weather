import './App.css'
import {useState} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Signup from './Signup'
import Login from './Login'
import Forget from './Forget'
import Verified from './Verified'
import Reset from './Reset'
function App() {
  const [weatherData,setWeatherData]=useState({});
  return (
    <BrowserRouter>
    <Header setWeatherData={setWeatherData}/>
    <div className='app'>
    <Routes>
      <Route path='/' element={
          <Content weatherData={weatherData}/>
              } />    
      <Route path='/signup' element={<Signup/>} />
       <Route path='/login' element={<Login/>} />
       <Route path='/forget' element={<Forget/>} />
       <Route path='/verified' element={<Verified/>}/>
       <Route path='/reset/:token' element={<Reset/>}/>
      </Routes>
      </div>
           <Footer/>
      </BrowserRouter>
  )
}

export default App
