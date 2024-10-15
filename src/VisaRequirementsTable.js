import React from "react";

const VisaRequirementsTable = ({ combinedVisaReqs }) => {
  const reversedCountryCodesObject = {
    AFG: "Afghanistan",
    ALB: "Albania",
    DZA: "Algeria",
    AND: "Andorra",
    AGO: "Angola",
    ATG: "Antigua and Barbuda",
    ARG: "Argentina",
    ARM: "Armenia",
    AUS: "Australia",
    AUT: "Austria",
    AZE: "Azerbaijan",
    BHS: "Bahamas",
    BHR: "Bahrain",
    BGD: "Bangladesh",
    BRB: "Barbados",
    BLR: "Belarus",
    BEL: "Belgium",
    BLZ: "Belize",
    BEN: "Benin",
    BTN: "Bhutan",
    BOL: "Bolivia",
    BIH: "Bosnia and Herzegovina",
    BWA: "Botswana",
    BRA: "Brazil",
    BRN: "Brunei Darussalam",
    BGR: "Bulgaria",
    BFA: "Burkina Faso",
    BDI: "Burundi",
    CPV: "Cabo Verde",
    KHM: "Cambodia",
    CMR: "Cameroon",
    CAN: "Canada",
    CAF: "Central African Republic",
    TCD: "Chad",
    CHL: "Chile",
    CHN: "China",
    COL: "Colombia",
    COM: "Comoros",
    COG: "Congo",
    COD: "Democratic Republic of the Congo",
    CRI: "Costa Rica",
    HRV: "Croatia",
    CUB: "Cuba",
    CYP: "Cyprus",
    CZE: "Czech Republic",
    DNK: "Denmark",
    DJI: "Djibouti",
    DMA: "Dominica",
    DOM: "Dominican Republic",
    ECU: "Ecuador",
    EGY: "Egypt",
    SLV: "El Salvador",
    GNQ: "Equatorial Guinea",
    ERI: "Eritrea",
    EST: "Estonia",
    SWZ: "Eswatini",
    ETH: "Ethiopia",
    FJI: "Fiji",
    FIN: "Finland",
    FRA: "France",
    GAB: "Gabon",
    GMB: "Gambia",
    GEO: "Georgia",
    DEU: "Germany",
    GHA: "Ghana",
    GRC: "Greece",
    GRD: "Grenada",
    GTM: "Guatemala",
    GIN: "Guinea",
    GNB: "Guinea-Bissau",
    GUY: "Guyana",
    HTI: "Haiti",
    HND: "Honduras",
    HUN: "Hungary",
    ISL: "Iceland",
    IND: "India",
    IDN: "Indonesia",
    IRN: "Iran",
    IRQ: "Iraq",
    IRL: "Ireland",
    ISR: "Israel",
    ITA: "Italy",
    CIV: "Ivory Coast",
    JAM: "Jamaica",
    JPN: "Japan",
    JOR: "Jordan",
    KAZ: "Kazakhstan",
    KEN: "Kenya",
    KIR: "Kiribati",
    KWT: "Kuwait",
    KGZ: "Kyrgyzstan",
    LAO: "Laos",
    LVA: "Latvia",
    LBN: "Lebanon",
    LSO: "Lesotho",
    LBR: "Liberia",
    LBY: "Libya",
    LIE: "Liechtenstein",
    LTU: "Lithuania",
    LUX: "Luxembourg",
    MDG: "Madagascar",
    MWI: "Malawi",
    MYS: "Malaysia",
    MDV: "Maldives",
    MLI: "Mali",
    MLT: "Malta",
    MHL: "Marshall Islands",
    MRT: "Mauritania",
    MUS: "Mauritius",
    MEX: "Mexico",
    FSM: "Micronesia",
    MDA: "Moldova",
    MCO: "Monaco",
    MNG: "Mongolia",
    MNE: "Montenegro",
    MAR: "Morocco",
    MOZ: "Mozambique",
    MMR: "Myanmar",
    NAM: "Namibia",
    NRU: "Nauru",
    NPL: "Nepal",
    NLD: "Netherlands",
    NZL: "New Zealand",
    NIC: "Nicaragua",
    NER: "Niger",
    NGA: "Nigeria",
    PRK: "North Korea",
    MKD: "North Macedonia",
    NOR: "Norway",
    OMN: "Oman",
    PAK: "Pakistan",
    PLW: "Palau",
    PSE: "Palestine",
    PAN: "Panama",
    PNG: "Papua New Guinea",
    PRY: "Paraguay",
    PER: "Peru",
    PHL: "Philippines",
    POL: "Poland",
    PRT: "Portugal",
    QAT: "Qatar",
    ROU: "Romania",
    RUS: "Russia",
    RWA: "Rwanda",
    KNA: "Saint Kitts and Nevis",
    LCA: "Saint Lucia",
    VCT: "Saint Vincent and the Grenadines",
    WSM: "Samoa",
    SMR: "San Marino",
    STP: "Sao Tome and Principe",
    SAU: "Saudi Arabia",
    SEN: "Senegal",
    SRB: "Serbia",
    SYC: "Seychelles",
    SLE: "Sierra Leone",
    SGP: "Singapore",
    SVK: "Slovakia",
    SVN: "Slovenia",
    SLB: "Solomon Islands",
    SOM: "Somalia",
    ZAF: "South Africa",
    KOR: "South Korea",
    SSD: "South Sudan",
    ESP: "Spain",
    LKA: "Sri Lanka",
    SDN: "Sudan",
    SUR: "Suriname",
    SWE: "Sweden",
    CHE: "Switzerland",
    SYR: "Syria",
    TWN: "Taiwan",
    TJK: "Tajikistan",
    TZA: "Tanzania",
    THA: "Thailand",
    TLS: "Timor-Leste",
    TGO: "Togo",
    TON: "Tonga",
    TTO: "Trinidad and Tobago",
    TUN: "Tunisia",
    TUR: "Turkey",
    TKM: "Turkmenistan",
    TUV: "Tuvalu",
    UGA: "Uganda",
    UKR: "Ukraine",
    ARE: "United Arab Emirates",
    GBR: "United Kingdom",
    USA: "United States",
    URY: "Uruguay",
    UZB: "Uzbekistan",
    VUT: "Vanuatu",
    VAT: "Vatican City",
    VEN: "Venezuela",
    VNM: "Vietnam",
    YEM: "Yemen",
    ZMB: "Zambia",
    ZWE: "Zimbabwe",
  };

  const countryCodesObject = {
    Afghanistan: "AF",
    Albania: "AL",
    Algeria: "DZ",
    Andorra: "AD",
    Angola: "AO",
    "Antigua and Barbuda": "AG",
    Argentina: "AR",
    Armenia: "AM",
    Australia: "AU",
    Austria: "AT",
    Azerbaijan: "AZ",
    Bahamas: "BS",
    Bahrain: "BH",
    Bangladesh: "BD",
    Barbados: "BB",
    Belarus: "BY",
    Belgium: "BE",
    Belize: "BZ",
    Benin: "BJ",
    Bhutan: "BT",
    Bolivia: "BO",
    "Bosnia and Herzegovina": "BA",
    Botswana: "BW",
    Brazil: "BR",
    "Brunei Darussalam": "BN",
    Bulgaria: "BG",
    "Burkina Faso": "BF",
    Burundi: "BI",
    "Cabo Verde": "CV",
    Cambodia: "KH",
    Cameroon: "CM",
    Canada: "CA",
    "Central African Republic": "CF",
    Chad: "TD",
    Chile: "CL",
    China: "CN",
    Colombia: "CO",
    Comoros: "KM",
    Congo: "CG",
    "Democratic Republic of the Congo": "CD",
    "Costa Rica": "CR",
    Croatia: "HR",
    Cuba: "CU",
    Cyprus: "CY",
    "Czech Republic": "CZ",
    Denmark: "DK",
    Djibouti: "DJ",
    Dominica: "DM",
    "Dominican Republic": "DO",
    Ecuador: "EC",
    Egypt: "EG",
    "El Salvador": "SV",
    "Equatorial Guinea": "GQ",
    Eritrea: "ER",
    Estonia: "EE",
    Eswatini: "SZ",
    Ethiopia: "ET",
    Fiji: "FJ",
    Finland: "FI",
    France: "FR",
    Gabon: "GA",
    Gambia: "GM",
    Georgia: "GE",
    Germany: "DE",
    Ghana: "GH",
    Greece: "GR",
    Grenada: "GD",
    Guatemala: "GT",
    Guinea: "GN",
    "Guinea-Bissau": "GW",
    Guyana: "GY",
    Haiti: "HT",
    Honduras: "HN",
    Hungary: "HU",
    Iceland: "IS",
    India: "IN",
    Indonesia: "ID",
    Iran: "IR",
    Iraq: "IQ",
    Ireland: "IE",
    Israel: "IL",
    Italy: "IT",
    "Ivory Coast": "CI",
    Jamaica: "JM",
    Japan: "JP",
    Jordan: "JO",
    Kazakhstan: "KZ",
    Kenya: "KE",
    Kiribati: "KI",
    Kuwait: "KW",
    Kyrgyzstan: "KG",
    Laos: "LA",
    Latvia: "LV",
    Lebanon: "LB",
    Lesotho: "LS",
    Liberia: "LR",
    Libya: "LY",
    Liechtenstein: "LI",
    Lithuania: "LT",
    Luxembourg: "LU",
    Madagascar: "MG",
    Malawi: "MW",
    Malaysia: "MY",
    Maldives: "MV",
    Mali: "ML",
    Malta: "MT",
    "Marshall Islands": "MH",
    Mauritania: "MR",
    Mauritius: "MU",
    Mexico: "MX",
    Micronesia: "FM",
    Moldova: "MD",
    Monaco: "MC",
    Mongolia: "MN",
    Montenegro: "ME",
    Morocco: "MA",
    Mozambique: "MZ",
    Myanmar: "MM",
    Namibia: "NA",
    Nauru: "NR",
    Nepal: "NP",
    Netherlands: "NL",
    "New Zealand": "NZ",
    Nicaragua: "NI",
    Niger: "NE",
    Nigeria: "NG",
    "North Korea": "KP",
    "North Macedonia": "MK",
    Norway: "NO",
    Oman: "OM",
    Pakistan: "PK",
    Palau: "PW",
    Palestine: "PS",
    Panama: "PA",
    "Papua New Guinea": "PG",
    Paraguay: "PY",
    Peru: "PE",
    Philippines: "PH",
    Poland: "PL",
    Portugal: "PT",
    Qatar: "QA",
    Romania: "RO",
    Russia: "RU",
    Rwanda: "RW",
    "Saint Kitts and Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Vincent and the Grenadines": "VC",
    Samoa: "WS",
    "San Marino": "SM",
    "Sao Tome and Principe": "ST",
    "Saudi Arabia": "SA",
    Senegal: "SN",
    Serbia: "RS",
    Seychelles: "SC",
    "Sierra Leone": "SL",
    Singapore: "SG",
    Slovakia: "SK",
    Slovenia: "SI",
    "Solomon Islands": "SB",
    Somalia: "SO",
    "South Africa": "ZA",
    "South Korea": "KR",
    "South Sudan": "SS",
    Spain: "ES",
    "Sri Lanka": "LK",
    Sudan: "SD",
    Suriname: "SR",
    Sweden: "SE",
    Switzerland: "CH",
    Syria: "SY",
    Taiwan: "TW",
    Tajikistan: "TJ",
    Tanzania: "TZ",
    Thailand: "TH",
    "Timor-Leste": "TL",
    Togo: "TG",
    Tonga: "TO",
    "Trinidad and Tobago": "TT",
    Tunisia: "TN",
    Turkey: "TR",
    Turkmenistan: "TM",
    Tuvalu: "TV",
    Uganda: "UG",
    Ukraine: "UA",
    "United Arab Emirates": "AE",
    "United Kingdom": "GB",
    "United States": "US",
    Uruguay: "UY",
    Uzbekistan: "UZ",
    Vanuatu: "VU",
    "Vatican City": "VA",
    Venezuela: "VE",
    Vietnam: "VN",
    Yemen: "YE",
    Zambia: "ZM",
    Zimbabwe: "ZW",
  };

  let selectedCountries = [];
  selectedCountries = Object.entries(combinedVisaReqs).filter(
    ([country, requirement]) => requirement === "-1"
  );

  let eVisaCountries = [];
  eVisaCountries = Object.entries(combinedVisaReqs).filter(
    ([country, requirement]) => requirement === "e-visa"
  );

  let visaOnArrivalCountries = [];
  visaOnArrivalCountries = Object.entries(combinedVisaReqs).filter(
    ([country, requirement]) => requirement === "visa on arrival"
  );

  let visaFreeCountries = [];
  visaFreeCountries = Object.entries(combinedVisaReqs).filter(
    ([country, requirement]) => {
      let number = parseInt(requirement);
      return !isNaN(number) && number > 0;
    }
  );

  return (
    <div className="resultsTable">
      <table>
        <thead>
          <tr>
            <th>Pals Passports</th>
          </tr>
        </thead>
        <tbody>
          {selectedCountries.map(([country, requirement]) => {
            const countryCode =
              countryCodesObject[reversedCountryCodesObject[country]];

            return (
              <tr key={country}>
                <td>
                  {countryCode && (
                    <span
                      className={`fi fi-${countryCode.toLowerCase()}`}
                    ></span>
                  )}
                  {" " + reversedCountryCodesObject[country]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Visa Free</th>
          </tr>
        </thead>
        <tbody>
          {visaFreeCountries.map(([country, requirement]) => {
            const countryCode =
              countryCodesObject[reversedCountryCodesObject[country]];

            return (
              <tr key={country}>
                <td>
                  {countryCode && (
                    <span
                      className={`fi fi-${countryCode.toLowerCase()}`}
                    ></span>
                  )}
                  {" " + reversedCountryCodesObject[country]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>eVisa</th>
          </tr>
        </thead>
        <tbody>
          {eVisaCountries.map(([country, requirement]) => {
            const countryCode =
              countryCodesObject[reversedCountryCodesObject[country]];

            return (
              <tr key={country}>
                <td>
                  {countryCode && (
                    <span
                      className={`fi fi-${countryCode.toLowerCase()}`}
                    ></span>
                  )}
                  {" " + reversedCountryCodesObject[country]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Visa On Arrival</th>
          </tr>
        </thead>
        <tbody>
          {visaOnArrivalCountries.map(([country, requirement]) => {
            const countryCode =
              countryCodesObject[reversedCountryCodesObject[country]];

            return (
              <tr key={country}>
                <td>
                  {countryCode && (
                    <span
                      className={`fi fi-${countryCode.toLowerCase()}`}
                    ></span>
                  )}
                  {" " + reversedCountryCodesObject[country]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VisaRequirementsTable;
