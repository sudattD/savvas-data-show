import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './screens/HomePage';
import WindTurbinePage from './screens/WindTurbinePage';
import VoiceDNAPage from './screens/VoiceDNAPage';
import ReactionTimePage from './screens/ReactionTimePage';
import ExplorerPage from './screens/ExplorerPage';
import DatasetsHub from './screens/datasets/DatasetsHub';
import DatasetStory from './screens/datasets/DatasetStory';
import LessonsHub from './screens/lessons/LessonsHub';
import SliderOfLies from './screens/lessons/SliderOfLies';
import WalkIntoABar from './screens/lessons/WalkIntoABar';
import TidyData from './screens/lessons/TidyData';
import CsvFromHell from './screens/lessons/CsvFromHell';
import PickYourStory from './screens/lessons/PickYourStory';
import SurvivorshipBias from './screens/lessons/SurvivorshipBias';
import RareDiseaseTest from './screens/lessons/RareDiseaseTest';
import CrackTheHeadline from './screens/lessons/CrackTheHeadline';
import HitTheTarget from './screens/lessons/HitTheTarget';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wind-turbine" element={<WindTurbinePage />} />
        <Route path="/voice-dna" element={<VoiceDNAPage />} />
        <Route path="/reaction-time" element={<ReactionTimePage />} />
        <Route path="/explorer" element={<ExplorerPage />} />
        <Route path="/datasets" element={<DatasetsHub />} />
        <Route path="/datasets/:id" element={<DatasetStory />} />
        <Route path="/lessons" element={<LessonsHub />} />
        <Route path="/lessons/slider-of-lies" element={<SliderOfLies />} />
        <Route path="/lessons/walk-into-a-bar" element={<WalkIntoABar />} />
        <Route path="/lessons/tidy-data" element={<TidyData />} />
        <Route path="/lessons/csv-from-hell" element={<CsvFromHell />} />
        <Route path="/lessons/pick-your-story" element={<PickYourStory />} />
        <Route path="/lessons/survivorship-bias" element={<SurvivorshipBias />} />
        <Route path="/lessons/rare-disease" element={<RareDiseaseTest />} />
        <Route path="/lessons/crack-the-headline" element={<CrackTheHeadline />} />
        <Route path="/lessons/hit-the-target" element={<HitTheTarget />} />
      </Routes>
    </BrowserRouter>
  );
}
