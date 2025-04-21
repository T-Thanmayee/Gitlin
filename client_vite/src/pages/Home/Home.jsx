import React from 'react';
import { Link } from 'react-router-dom';
import HomeCarousel from './HomeCarousel';
import CountView from './CountView';
import FeatureCard from './FeatureCard'
import Testimony from './Testimony';
import SlideInPage from './SlideInPage';
import { FileDelete } from '../DeleteDialog/FileDelete';
import { EditProfile } from '../ProfileUser/EditProfile';
import Slide from '../../components/Slide';
const App = () => {
  return (
    <div className=''>
    <HomeCarousel />
    <FeatureCard/>
    <SlideInPage />
    <Slide delay={0.5}> <CountView /></Slide>
   
    <Slide delay={0.5}> <Testimony /></Slide>
   

    <EditProfile/>
    </div>
  );
};

export default App;
