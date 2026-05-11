import type { Dataset } from '../lib/dataset';
import { WIND_TURBINE_DATASET } from './windTurbineDataset';
import { CO2_DATASET } from './co2Dataset';
import { COUNTRIES_DATASET } from './countriesDataset';
import { EARTHQUAKES_DATASET } from './earthquakesDataset';
import { EXOPLANETS_DATASET } from './exoplanetsDataset';
import { TIDES_DATASET } from './tidesDataset';
import { PENGUINS_DATASET } from './penguinsDataset';
import { BABY_NAMES_DATASET } from './babyNamesDataset';
import { NEO_DATASET } from './neoDataset';
import { MARATHON_DATASET } from './marathonDataset';
import { MOORE_LAW_DATASET } from './mooreLawDataset';
import { STARS_DATASET } from './starsDataset';
import { HURRICANES_DATASET } from './hurricanesDataset';
import { SPOTIFY_DATASET } from './spotifyDataset';
import { POPULATION_DATASET } from './populationDataset';
import { OLYMPIC_100M_DATASET } from './olympic100mDataset';
import { HEART_RATE_DATASET } from './heartRateDataset';
import { SOLAR_SYSTEM_DATASET } from './solarSystemDataset';

export const DATASETS: Dataset[] = [
  WIND_TURBINE_DATASET,
  CO2_DATASET,
  TIDES_DATASET,
  COUNTRIES_DATASET,
  EARTHQUAKES_DATASET,
  HURRICANES_DATASET,
  SOLAR_SYSTEM_DATASET,
  EXOPLANETS_DATASET,
  STARS_DATASET,
  PENGUINS_DATASET,
  HEART_RATE_DATASET,
  BABY_NAMES_DATASET,
  POPULATION_DATASET,
  NEO_DATASET,
  MARATHON_DATASET,
  OLYMPIC_100M_DATASET,
  MOORE_LAW_DATASET,
  SPOTIFY_DATASET,
];

export function getDataset(id: string): Dataset {
  return DATASETS.find((d) => d.id === id) ?? DATASETS[0];
}
