import React from 'react';
import { Link } from 'react-router-dom';
import HomeCarousel from './HomeCarousel';
import CountView from './CountView';
import FeatureCard from './FeatureCard'
import Testimony from './Testimony';
import SlideInPage from './SlideInPage';
import { FileDelete } from '../DeleteDialog/FileDelete';
import {ChatWidget} from './ChatWidget';
import Slide from '../../components/ui/Slide';
import SlideNext from '../../components/ui/SlideNext';
import RotateComponent from './RotatedComponent';
import CollabCard from '../Project_Folder/CollabCard';
import { MentorDisplayCard } from '../Mentor/MentorDisplayCards';
import { ProfessionalCard } from '../ProfileUser/ProfessionCard';
import { DetailedProfile } from '../ProfileUser/DetailedProfile';
const App = () => {
  return (
    <div className=''>
    <HomeCarousel />
  <ChatWidget />
    <FeatureCard/>
    <ProfessionalCard/>
    <MentorDisplayCard/>
    <DetailedProfile/>
    
   
   
  
    <CountView />
   
     <Testimony />
   

    
    </div>
  );
};

export default App;
