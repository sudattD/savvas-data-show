import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InputWidget from './components/InputWidget';
import FeedbackPage from './screens/FeedbackPage';
import HomePage from './screens/HomePage';
import WindTurbinePage from './screens/WindTurbinePage';
import VoiceDNAPage from './screens/VoiceDNAPage';
import ReactionTimePage from './screens/ReactionTimePage';
import CensusPyramidPage from './screens/CensusPyramidPage';
import ExplorerPage from './screens/ExplorerPage';
import DatasetsHub from './screens/datasets/DatasetsHub';
import DatasetStory from './screens/datasets/DatasetStory';
import DatasetDictionary from './screens/datasets/DatasetDictionary';
import LessonsHub from './screens/lessons/LessonsHub';
import ChaptersPage from './screens/ChaptersPage';
import AlignmentPage from './screens/AlignmentPage';
import SliderOfLies from './screens/lessons/SliderOfLies';
import WalkIntoABar from './screens/lessons/WalkIntoABar';
import TidyData from './screens/lessons/TidyData';
import CsvFromHell from './screens/lessons/CsvFromHell';
import PickYourStory from './screens/lessons/PickYourStory';
import SurvivorshipBias from './screens/lessons/SurvivorshipBias';
import RareDiseaseTest from './screens/lessons/RareDiseaseTest';
import CrackTheHeadline from './screens/lessons/CrackTheHeadline';
import HitTheTarget from './screens/lessons/HitTheTarget';

// Two deployments share this source. PITCH_MODE = true is for the
// stand-alone alignment artifact (`/` serves the pitch page, no
// prototype routes). PITCH_MODE = false is the full prototype.
const PITCH_MODE = import.meta.env.VITE_PITCH_MODE === 'true';

export default function App() {
  if (PITCH_MODE) {
    return (
      <BrowserRouter>
        <Routes>
          {/* All paths render the alignment page — no prototype leakage. */}
          <Route path="*" element={<AlignmentPage />} />
        </Routes>
        {/* allowedHosts: empty array means the widget never auto-shows.
            It still activates when ?getinput is in the URL, so Derek can
            share a review URL with Park without cluttering the default
            view. */}
        <InputWidget allowedHosts={[]} />
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wind-turbine" element={<WindTurbinePage />} />
        <Route path="/voice-dna" element={<VoiceDNAPage />} />
        <Route path="/reaction-time" element={<ReactionTimePage />} />
        <Route path="/census-pyramid" element={<CensusPyramidPage />} />
        <Route path="/explorer" element={<ExplorerPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/alignment" element={<AlignmentPage />} />
        <Route path="/datasets" element={<DatasetsHub />} />
        <Route path="/datasets/:id" element={<DatasetStory />} />
        <Route path="/datasets/:id/dictionary" element={<DatasetDictionary />} />
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
        <Route path="/admin/feedback" element={<FeedbackPage />} />
      </Routes>
      <InputWidget allowedHosts={['localhost', 'vercel.app']} />
    </BrowserRouter>
  );
}
