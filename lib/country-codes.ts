export async function getCountryCodeFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    // Use Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WatchNextTonight/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    // Extract country code from the response
    const countryCode = data.address?.country_code;

    // Fallback to US if country not found
    return countryCode?.toUpperCase() ?? 'US';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return US as fallback on any error
    return 'US';
  }
}

export const FLAG_EMOJIS: Record<string, string> = {
  // Africa
  AO: '🇦🇴', // Angola
  BF: '🇧🇫', // Burkina Faso
  BI: '🇧🇮', // Burundi
  BJ: '🇧🇯', // Benin
  BW: '🇧🇼', // Botswana
  CD: '🇨🇩', // Congo - Kinshasa
  CF: '🇨🇫', // Central African Republic
  CG: '🇨🇬', // Congo - Brazzaville
  CI: '🇨🇮', // Côte d'Ivoire
  CM: '🇨🇲', // Cameroon
  CV: '🇨🇻', // Cape Verde
  DJ: '🇩🇯', // Djibouti
  DZ: '🇩🇿', // Algeria
  EG: '🇪🇬', // Egypt
  EH: '🇪🇭', // Western Sahara
  ER: '🇪🇷', // Eritrea
  ET: '🇪🇹', // Ethiopia
  GA: '🇬🇦', // Gabon
  GH: '🇬🇭', // Ghana
  GM: '🇬🇲', // Gambia
  GN: '🇬🇳', // Guinea
  GQ: '🇬🇶', // Equatorial Guinea
  GW: '🇬🇼', // Guinea-Bissau
  KE: '🇰🇪', // Kenya
  KM: '🇰🇲', // Comoros
  LR: '🇱🇷', // Liberia
  LS: '🇱🇸', // Lesotho
  LY: '🇱🇾', // Libya
  MA: '🇲🇦', // Morocco
  MG: '🇲🇬', // Madagascar
  ML: '🇲🇱', // Mali
  MR: '🇲🇷', // Mauritania
  MU: '🇲🇺', // Mauritius
  MW: '🇲🇼', // Malawi
  MZ: '🇲🇿', // Mozambique
  NA: '🇳🇦', // Namibia
  NE: '🇳🇪', // Niger
  NG: '🇳🇬', // Nigeria
  RW: '🇷🇼', // Rwanda
  SC: '🇸🇨', // Seychelles
  SD: '🇸🇩', // Sudan
  SL: '🇸🇱', // Sierra Leone
  SN: '🇸🇳', // Senegal
  SO: '🇸🇴', // Somalia
  SS: '🇸🇸', // South Sudan
  ST: '🇸🇹', // São Tomé & Príncipe
  SZ: '🇸🇿', // Eswatini
  TD: '🇹🇩', // Chad
  TG: '🇹🇬', // Togo
  TN: '🇹🇳', // Tunisia
  TZ: '🇹🇿', // Tanzania
  UG: '🇺🇬', // Uganda
  ZA: '🇿🇦', // South Africa
  ZM: '🇿🇲', // Zambia
  ZW: '🇿🇼', // Zimbabwe

  // Americas
  AG: '🇦🇬', // Antigua & Barbuda
  AI: '🇦🇮', // Anguilla
  AR: '🇦🇷', // Argentina
  AW: '🇦🇼', // Aruba
  BB: '🇧🇧', // Barbados
  BL: '🇧🇱', // St. Barthélemy
  BM: '🇧🇲', // Bermuda
  BO: '🇧🇴', // Bolivia
  BQ: '🇧🇶', // Caribbean Netherlands
  BR: '🇧🇷', // Brazil
  BS: '🇧🇸', // Bahamas
  BZ: '🇧🇿', // Belize
  CA: '🇨🇦', // Canada
  CL: '🇨🇱', // Chile
  CO: '🇨🇴', // Colombia
  CR: '🇨🇷', // Costa Rica
  CU: '🇨🇺', // Cuba
  CW: '🇨🇼', // Curaçao
  DM: '🇩🇲', // Dominica
  DO: '🇩🇴', // Dominican Republic
  EC: '🇪🇨', // Ecuador
  FK: '🇫🇰', // Falkland Islands
  GD: '🇬🇩', // Grenada
  GF: '🇬🇫', // French Guiana
  GL: '🇬🇱', // Greenland
  GP: '🇬🇵', // Guadeloupe
  GT: '🇬🇹', // Guatemala
  GY: '🇬🇾', // Guyana
  HN: '🇭🇳', // Honduras
  HT: '🇭🇹', // Haiti
  JM: '🇯🇲', // Jamaica
  KN: '🇰🇳', // St. Kitts & Nevis
  KY: '🇰🇾', // Cayman Islands
  LC: '🇱🇨', // St. Lucia
  MF: '🇲🇫', // St. Martin
  MQ: '🇲🇶', // Martinique
  MS: '🇲🇸', // Montserrat
  MX: '🇲🇽', // Mexico
  NI: '🇳🇮', // Nicaragua
  PA: '🇵🇦', // Panama
  PE: '🇵🇪', // Peru
  PM: '🇵🇲', // St. Pierre & Miquelon
  PR: '🇵🇷', // Puerto Rico
  PY: '🇵🇾', // Paraguay
  SR: '🇸🇷', // Suriname
  SV: '🇸🇻', // El Salvador
  SX: '🇸🇽', // Sint Maarten
  TC: '🇹🇨', // Turks & Caicos Islands
  TT: '🇹🇹', // Trinidad & Tobago
  US: '🇺🇸', // United States
  UY: '🇺🇾', // Uruguay
  VC: '🇻🇨', // St. Vincent & Grenadines
  VE: '🇻🇪', // Venezuela
  VG: '🇻🇬', // British Virgin Islands
  VI: '🇻🇮', // U.S. Virgin Islands

  // Asia
  AE: '🇦🇪', // United Arab Emirates
  AF: '🇦🇫', // Afghanistan
  AM: '🇦🇲', // Armenia
  AZ: '🇦🇿', // Azerbaijan
  BD: '🇧🇩', // Bangladesh
  BH: '🇧🇭', // Bahrain
  BN: '🇧🇳', // Brunei
  BT: '🇧🇹', // Bhutan
  CN: '🇨🇳', // China
  CY: '🇨🇾', // Cyprus
  GE: '🇬🇪', // Georgia
  HK: '🇭🇰', // Hong Kong
  ID: '🇮🇩', // Indonesia
  IL: '🇮🇱', // Israel
  IN: '🇮🇳', // India
  IQ: '🇮🇶', // Iraq
  IR: '🇮🇷', // Iran
  JO: '🇯🇴', // Jordan
  JP: '🇯🇵', // Japan
  KG: '🇰🇬', // Kyrgyzstan
  KH: '🇰🇭', // Cambodia
  KP: '🇰🇵', // North Korea
  KR: '🇰🇷', // South Korea
  KW: '🇰🇼', // Kuwait
  KZ: '🇰🇿', // Kazakhstan
  LA: '🇱🇦', // Laos
  LB: '🇱🇧', // Lebanon
  LK: '🇱🇰', // Sri Lanka
  MM: '🇲🇲', // Myanmar
  MN: '🇲🇳', // Mongolia
  MO: '🇲🇴', // Macao
  MV: '🇲🇻', // Maldives
  MY: '🇲🇾', // Malaysia
  NP: '🇳🇵', // Nepal
  OM: '🇴🇲', // Oman
  PH: '🇵🇭', // Philippines
  PK: '🇵🇰', // Pakistan
  PS: '🇵🇸', // Palestinian Territories
  QA: '🇶🇦', // Qatar
  SA: '🇸🇦', // Saudi Arabia
  SG: '🇸🇬', // Singapore
  SY: '🇸🇾', // Syria
  TH: '🇹🇭', // Thailand
  TJ: '🇹🇯', // Tajikistan
  TL: '🇹🇱', // Timor-Leste
  TM: '🇹🇲', // Turkmenistan
  TR: '🇹🇷', // Turkey
  TW: '🇹🇼', // Taiwan
  UZ: '🇺🇿', // Uzbekistan
  VN: '🇻🇳', // Vietnam
  YE: '🇾🇪', // Yemen

  // Europe
  AD: '🇦🇩', // Andorra
  AL: '🇦🇱', // Albania
  AT: '🇦🇹', // Austria
  AX: '🇦🇽', // Åland Islands
  BA: '🇧🇦', // Bosnia & Herzegovina
  BE: '🇧🇪', // Belgium
  BG: '🇧🇬', // Bulgaria
  BY: '🇧🇾', // Belarus
  CH: '🇨🇭', // Switzerland
  CZ: '🇨🇿', // Czechia
  DE: '🇩🇪', // Germany
  DK: '🇩🇰', // Denmark
  EE: '🇪🇪', // Estonia
  ES: '🇪🇸', // Spain
  EU: '🇪🇺', // European Union
  FI: '🇫🇮', // Finland
  FO: '🇫🇴', // Faroe Islands
  FR: '🇫🇷', // France
  GB: '🇬🇧', // United Kingdom
  GG: '🇬🇬', // Guernsey
  GI: '🇬🇮', // Gibraltar
  GR: '🇬🇷', // Greece
  HR: '🇭🇷', // Croatia
  HU: '🇭🇺', // Hungary
  IE: '🇮🇪', // Ireland
  IM: '🇮🇲', // Isle of Man
  IS: '🇮🇸', // Iceland
  IT: '🇮🇹', // Italy
  JE: '🇯🇪', // Jersey
  LI: '🇱🇮', // Liechtenstein
  LT: '🇱🇹', // Lithuania
  LU: '🇱🇺', // Luxembourg
  LV: '🇱🇻', // Latvia
  MC: '🇲🇨', // Monaco
  MD: '🇲🇩', // Moldova
  ME: '🇲🇪', // Montenegro
  MK: '🇲🇰', // North Macedonia
  MT: '🇲🇹', // Malta
  NL: '🇳🇱', // Netherlands
  NO: '🇳🇴', // Norway
  PL: '🇵🇱', // Poland
  PT: '🇵🇹', // Portugal
  RO: '🇷🇴', // Romania
  RS: '🇷🇸', // Serbia
  RU: '🇷🇺', // Russia
  SE: '🇸🇪', // Sweden
  SI: '🇸🇮', // Slovenia
  SJ: '🇸🇯', // Svalbard & Jan Mayen
  SK: '🇸🇰', // Slovakia
  SM: '🇸🇲', // San Marino
  UA: '🇺🇦', // Ukraine
  VA: '🇻🇦', // Vatican City
  XK: '🇽🇰', // Kosovo

  // Oceania
  AS: '🇦🇸', // American Samoa
  AU: '🇦🇺', // Australia
  CC: '🇨🇨', // Cocos (Keeling) Islands
  CK: '🇨🇰', // Cook Islands
  CX: '🇨🇽', // Christmas Island
  FJ: '🇫🇯', // Fiji
  FM: '🇫🇲', // Micronesia
  GU: '🇬🇺', // Guam
  KI: '🇰🇮', // Kiribati
  MH: '🇲🇭', // Marshall Islands
  MP: '🇲🇵', // Northern Mariana Islands
  NC: '🇳🇨', // New Caledonia
  NF: '🇳🇫', // Norfolk Island
  NR: '🇳🇷', // Nauru
  NU: '🇳🇺', // Niue
  NZ: '🇳🇿', // New Zealand
  PF: '🇵🇫', // French Polynesia
  PG: '🇵🇬', // Papua New Guinea
  PN: '🇵🇳', // Pitcairn Islands
  PW: '🇵🇼', // Palau
  SB: '🇸🇧', // Solomon Islands
  TK: '🇹🇰', // Tokelau
  TO: '🇹🇴', // Tonga
  TV: '🇹🇻', // Tuvalu
  UM: '🇺🇲', // U.S. Outlying Islands
  VU: '🇻🇺', // Vanuatu
  WF: '🇼🇫', // Wallis & Futuna
  WS: '🇼🇸', // Samoa

  // Other territories and special codes
  AC: '🇦🇨', // Ascension Island
  BV: '🇧🇻', // Bouvet Island
  CP: '🇨🇵', // Clipperton Island
  DG: '🇩🇬', // Diego Garcia
  EA: '🇪🇦', // Ceuta & Melilla
  GS: '🇬🇸', // South Georgia & South Sandwich Islands
  HM: '🇭🇲', // Heard & McDonald Islands
  IC: '🇮🇨', // Canary Islands
  IO: '🇮🇴', // British Indian Ocean Territory
  TA: '🇹🇦', // Tristan da Cunha
  TF: '🇹🇫', // French Southern Territories
  UN: '🇺🇳', // United Nations

  // Additional territories that might be returned by geolocation services
  AQ: '🇦🇶', // Antarctica
  SH: '🇸🇭', // Saint Helena
  YT: '🇾🇹', // Mayotte
  RE: '🇷🇪', // Réunion
};
