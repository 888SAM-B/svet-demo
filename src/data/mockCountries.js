export const mockCountries = [
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    flag: '🇺🇿',
    tuitionFee: '₹2.5L - ₹4L / year',
    duration: '6 Years',
    language: 'English',
    popularUniversities: ['Tashkent Medical Academy', 'Samarkand State Medical University'],
    description: 'Highly affordable, WHO & NMC approved English medium programs in safe, historic central Asian cities.'
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    flag: '🇲🇾',
    tuitionFee: '₹6L - ₹10L / year',
    duration: '5 Years',
    language: 'English',
    popularUniversities: ['MAHSA University', 'Newcastle University Medicine Malaysia'],
    description: 'World-class healthcare systems with ultra-modern medical colleges and international clinical exposure.'
  },
  {
    id: 'russia',
    name: 'Russia',
    flag: '🇷🇺',
    tuitionFee: '₹3L - ₹6L / year',
    duration: '6 Years',
    language: 'English / Russian',
    popularUniversities: ['Kazan Federal University', 'Crimean Federal University'],
    description: 'Top-tier government medical institutions with cutting-edge labs and heavily subsidized tuition fees.'
  },
  {
    id: 'uk',
    name: 'UK',
    flag: '🇬🇧',
    tuitionFee: '₹25L - ₹40L / year',
    duration: '5-6 Years',
    language: 'English',
    popularUniversities: ['University of Edinburgh', 'King\'s College London'],
    description: 'Prestigious global degree, unmatched clinical practices, and direct path to NHS careers.'
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    tuitionFee: 'Almost Free (Public) / ₹15L (Private)',
    duration: '6 Years',
    language: 'German (Required)',
    popularUniversities: ['Heidelberg University', 'Charité - Universitätsmedizin Berlin'],
    description: 'Virtually free public university tuition, high living standards, and excellent residency opportunities.'
  },
  {
    id: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    tuitionFee: '₹30L - ₹50L / year',
    duration: '4 Years (Post-Grad)',
    language: 'English',
    popularUniversities: ['Harvard Medical School', 'Johns Hopkins School of Medicine'],
    description: 'Gold standard medical training, top research clinics, and highly rewarding global medical practice.'
  },
  {
    id: 'kyrgyzstan',
    name: 'Kyrgyzstan',
    flag: '🇰🇬',
    tuitionFee: '₹2L - ₹3.5L / year',
    duration: '6 Years',
    language: 'English',
    popularUniversities: ['Kyrgyz State Medical Academy', 'Osh State University'],
    description: 'Most economical option for Indian medical aspirants, providing direct eligibility for NMC screening exams.'
  },
  {
    id: 'philippines',
    name: 'Philippines',
    flag: '🇵🇭',
    tuitionFee: '₹3.5L - ₹5.5L / year',
    duration: '5.5 Years',
    language: 'English',
    popularUniversities: ['Our Lady of Fatima University', 'University of Perpetual Help'],
    description: 'English-speaking culture with US-pattern BS-MD curriculum, boasting highly successful FMGE passing rates.'
  },
  {
    id: 'georgia',
    name: '🇬🇪',
    flag: '🇬🇪',
    nameText: 'Georgia', // handle naming alignment
    tuitionFee: '₹4L - ₹6L / year',
    duration: '6 Years',
    language: 'English',
    popularUniversities: ['Tbilisi State Medical University', 'Caucasus International University'],
    description: 'Beautiful European border nation offering fully integrated medical curricula recognized globally.'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    tuitionFee: '₹20L - ₹35L / year',
    duration: '5 Years',
    language: 'English',
    popularUniversities: ['NUS Yong Loo Lin School of Medicine', 'Duke-NUS Medical School'],
    description: 'Highly competitive and sophisticated, featuring clean, safe environments and advanced technologies.'
  }
];

// Normalize Georgia naming alignment
mockCountries[8].name = 'Georgia';
