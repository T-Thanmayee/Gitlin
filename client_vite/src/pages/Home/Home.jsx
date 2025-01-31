import React from 'react';
import { Link } from 'react-router-dom';
import HomeCarousel from './HomeCarousel';
import CountView from './CountView';
import FeatureCard from './FeatureCard'
import Testimony from './Testimony';
import SlideInPage from './SlideInPage';

const App = () => {
  return (
    <div className=''>
    <HomeCarousel />
    <FeatureCard/>
    <SlideInPage />
    <CountView />
    <Testimony />
    </div>
  );
};

export default App;
