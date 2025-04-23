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
import RotateComponent from './RotatedComponent';
import CollabCard from '../Project Folder/CollabCard';
const App = () => {
  return (
    <div className=''>
    <HomeCarousel />
   <CollabCard />
    <FeatureCard/>
    
   
   
  
    <CountView />
   
     <Testimony />
   

    <EditProfile/>
    </div>
  );
};

export default App;
