import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InputWidget from './components/InputWidget';
import FeedbackPage from './screens/FeedbackPage';
import HomePage from './screens/HomePage';
import WindTurbineHub from './screens/WindTurbineHub';
import WindTurbinePage from './screens/WindTurbinePage';
import WindScenePrototype from './screens/wind/prototype/WindScenePrototype';
import VoiceDNAPage from './screens/VoiceDNAPage';
import VoiceDNAHub from './screens/VoiceDNAHub';
import ReactionTimeHub from './screens/ReactionTimeHub';
import ReactionTimePage from './screens/ReactionTimePage';
import ReactionTimeClassicPage from './screens/ReactionTimeClassicPage';
import CensusPyramidPage from './screens/CensusPyramidPage';
import ConstellationDesignerPage from './screens/ConstellationDesignerPage';
import KeplersLawPage from './screens/KeplersLawPage';
import MapEarthsAngerPage from './screens/MapEarthsAngerPage';
import CalibratorsPage from './screens/CalibratorsPage';
import DoublingTimePage from './screens/DoublingTimePage';
import ProbabilityCoinPage from './screens/ProbabilityCoinPage';
import InverseSquarePage from './screens/InverseSquarePage';
import ExplorerPage from './screens/ExplorerPage';
import DatasetsHub from './screens/datasets/DatasetsHub';
import DatasetStory from './screens/datasets/DatasetStory';
import DatasetDictionary from './screens/datasets/DatasetDictionary';
import LessonsHub from './screens/lessons/LessonsHub';
import ChaptersPage from './screens/ChaptersPage';
import AugmentChaptersPage from './screens/AugmentChaptersPage';
import NewChaptersPage from './screens/NewChaptersPage';
import ChapterTeeUp from './screens/ChapterTeeUp';
import AlignmentPage from './screens/AlignmentPage';
import BodyAsDataHub from './screens/BodyAsDataHub';
import VoiceDNAClassicPage from './screens/VoiceDNAClassicPage';
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
        {/* Pitch deploy lives on a *.vercel.app subdomain. We want the
            widget visible by default so reviewers don't need a special
            ?getinput URL. apiEndpoint points back to the prototype's
            /api/input because the pitch project is static-only — without
            the override, POSTs would 404 against pitch's own (absent)
            serverless function. */}
        <InputWidget
          allowedHosts={["vercel.app", "localhost"]}
          apiEndpoint="https://prototype-five-iota.vercel.app/api/input"
        />
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wind-turbine" element={<WindTurbineHub />} />
        <Route path="/wind-turbine/classic" element={<WindTurbinePage />} />
        <Route path="/wind-turbine/prototype" element={<WindScenePrototype />} />
        <Route path="/voice-dna" element={<VoiceDNAHub />} />
        <Route path="/voice-dna/quick" element={<VoiceDNAPage />} />
        <Route path="/voice-dna/classic" element={<VoiceDNAClassicPage />} />
        <Route path="/body-as-data" element={<BodyAsDataHub />} />
        <Route path="/reaction-time" element={<ReactionTimeHub />} />
        <Route path="/reaction-time/quick" element={<ReactionTimePage />} />
        <Route path="/reaction-time/classic" element={<ReactionTimeClassicPage />} />
        <Route path="/census-pyramid" element={<CensusPyramidPage />} />
        <Route path="/constellation" element={<ConstellationDesignerPage />} />
        <Route path="/kepler" element={<KeplersLawPage />} />
        <Route path="/map-earths-anger" element={<MapEarthsAngerPage />} />
        <Route path="/calibrators" element={<CalibratorsPage />} />
        <Route path="/doubling-time" element={<DoublingTimePage />} />
        <Route path="/genre-bet" element={<ProbabilityCoinPage />} />
        <Route path="/inverse-square" element={<InverseSquarePage />} />
        <Route path="/explorer" element={<ExplorerPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/chapters/augment" element={<AugmentChaptersPage />} />
        <Route path="/chapters/new" element={<NewChaptersPage />} />
        <Route path="/c/:anchor" element={<ChapterTeeUp />} />
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
