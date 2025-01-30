import React from 'react';
import { Link } from 'react-router-dom';
import HomeCarousel from './HomeCarousel';
import CountView from './CountView';
import FeatureCard from './FeatureCard'
const App = () => {
  return (
    <div className=''>
    <HomeCarousel />
    <FeatureCard/>
    <CountView />
    </div>
  );
};

export default App;
