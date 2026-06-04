// Toyota 1980–1996 model catalogue
// Used for quick-filter shortcuts and AUTO.RIA search presets

export const TOYOTA_FAVOURITES = [
  {
    id: 'all_80_95',
    i18nKey: 'toyota.all_80_95',
    make: 'Toyota',
    models: [],
    yearFrom: 1980,
    yearTo: 1995,
    searchTerms: [],
    autoRiaModelId: null,
    icon: '/assets/icons/car_scout_logo.png',
  },
  {
    id: 'ae86',
    i18nKey: 'toyota.ae86',
    make: 'Toyota',
    models: ['Corolla AE86', 'Sprinter Trueno AE86', 'Corolla Levin AE86'],
    yearFrom: 1983,
    yearTo: 1987,
    searchTerms: ['AE86', 'хачирокү', 'hachiroku', '4AGE', 'Corolla Levin', 'Sprinter Trueno'],
    autoRiaModelId: null, // TODO: fill from AUTO.RIA API
    icon: '/assets/icons/racing_icon.png',
  },
  {
    id: 'supra_a60',
    i18nKey: 'toyota.supra_a60',
    make: 'Toyota',
    models: ['Supra MA61', 'Celica Supra'],
    yearFrom: 1981,
    yearTo: 1986,
    searchTerms: ['Supra A60', 'MA61', 'Celica Supra'],
    icon: '/assets/icons/performance_icon.png',
  },
  {
    id: 'supra_a70',
    i18nKey: 'toyota.supra_a70',
    make: 'Toyota',
    models: ['Supra MA70', 'Supra JZA70'],
    yearFrom: 1986,
    yearTo: 1993,
    searchTerms: ['Supra A70', 'MA70', 'JZA70', '7M-GTE', '1JZ'],
    icon: '/assets/icons/performance_icon.png',
  },
  {
    id: 'mr2_aw11',
    i18nKey: 'toyota.mr2_aw11',
    make: 'Toyota',
    models: ['MR2 AW11'],
    yearFrom: 1984,
    yearTo: 1989,
    searchTerms: ['MR2 AW11', 'AW11', 'Toyota MR2 1985', 'Toyota MR2 1986'],
    icon: '/assets/icons/electric_icon.png',
  },
  {
    id: 'mr2_sw20',
    i18nKey: 'toyota.mr2_sw20',
    make: 'Toyota',
    models: ['MR2 SW20', 'MR2 Turbo'],
    yearFrom: 1989,
    yearTo: 1999,
    searchTerms: ['MR2 SW20', 'SW20', '3S-GTE', 'MR2 Turbo'],
    icon: '/assets/icons/electric_icon.png',
  },
  {
    id: 'celica',
    i18nKey: 'toyota.celica',
    make: 'Toyota',
    models: ['Celica T160', 'Celica T180', 'Celica GT-Four'],
    yearFrom: 1985,
    yearTo: 1993,
    searchTerms: ['Celica T160', 'Celica T180', 'Celica ST165', 'Celica GT-Four', 'ST185'],
    icon: '/assets/icons/classic_car_icon.png',
  },
  {
    id: 'corolla',
    i18nKey: 'toyota.corolla',
    make: 'Toyota',
    models: ['Corolla E80', 'Corolla E90', 'Corolla E100'],
    yearFrom: 1983,
    yearTo: 1997,
    searchTerms: ['Corolla 1983', 'Corolla 1987', 'Corolla 1991', 'Corolla E80', 'Corolla E90'],
    icon: '/assets/icons/family_car_icon.png',
  },
  {
    id: 'hilux',
    i18nKey: 'toyota.hilux',
    make: 'Toyota',
    models: ['Hilux N50', 'Hilux N60', 'Hilux Surf', '4Runner'],
    yearFrom: 1979,
    yearTo: 1996,
    searchTerms: ['Hilux 1980', 'Hilux Surf', 'Toyota 4Runner', 'Land Cruiser 80'],
    icon: '/assets/icons/offroad_icon.png',
  },
];

// Generic "all Toyota" fallback search preset
export const TOYOTA_GENERIC = {
  make: 'Toyota',
  yearFrom: 1980,
  yearTo: 1996,
};

// AUTO.RIA make ID for Toyota — verify with: GET /api/categories/{categoryId}/marks
export const AUTORIA_TOYOTA_MARK_ID = 79;

export const ALL_TOYOTA_MODELS_80S_90S = [
  "Toyota Corolla", "Toyota Sprinter Trueno", "Toyota Corolla Levin", 
  "Toyota Supra", "Toyota Celica", "Toyota MR2", 
  "Toyota Hilux", "Toyota 4Runner", "Toyota Land Cruiser",
  "Toyota Starlet", "Toyota Crown", "Toyota Cressida",
  "Toyota Chaser", "Toyota Mark II", "Toyota Cresta",
  "Toyota Soarer", "Toyota Carina", "Toyota Corona",
  "Toyota Camry", "Toyota Tercel", "Toyota Paseo", "Toyota Sera"
].sort();
