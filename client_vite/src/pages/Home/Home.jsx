import React from 'react';
import { Link } from 'react-router-dom';
import HomeCarousel from './HomeCarousel';
import CountView from './CountView';
import FeatureCard from './FeatureCard'
import Testimony from './Testimony';
import SlideInPage from './SlideInPage';
import { FileDelete } from '../DeleteDialog/FileDelete';
import { EditProfile } from '../ProfileUser/EditProfile';
import Slide from '../../components/ui/Slide';
import SlideNext from '../../components/ui/SlideNext';
const App = () => {
  return (
    <div className=''>
    <HomeCarousel />
   
    <FeatureCard/>
    
   
    <SlideNext delay={0.6} className="translate-x-10 rotate-6 p-4">
  <h1>This will slide in from right and rotate!</h1>
</SlideNext>
   <Slide delay={0.5}><SlideInPage /></Slide> 
    <Slide delay={0.8}> <CountView /></Slide>
   
    <Slide delay={0.9}> <Testimony /></Slide>
   

    <EditProfile/>
    </div>
  );
};

export default App;
