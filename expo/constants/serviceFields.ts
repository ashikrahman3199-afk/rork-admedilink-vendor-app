export type FieldType = 'text' | 'number' | 'select';

export interface ServiceField {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: string[]; // For select type
}

export const SERVICE_CATEGORIES = {
    BILLBOARD: 'Billboards',
    LED_BILLBOARD: 'LED Billboards',
    RADIO: 'Radio',
    CINEMA: 'Cinema',
    NEWSPAPER: 'Newspaper',
    INFLUENCER: 'Influencers',
    BUS: 'Buses',
    CAB: 'Cabs',
    AUTO: 'Auto',
    METRO_TRAIN: 'Metro & Trains',
    DIGITAL_TV: 'Digital(TV)',
    DIGITAL_MARKETING: 'Digital Marketing',
    LED_VENDING_MACHINE: 'LED Vending Machine',
    LED_VEHICLE: 'LED Vehicle',
} as const;


export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];

export const SERVICE_FIELDS: Record<ServiceCategory, ServiceField[]> = {
    [SERVICE_CATEGORIES.BILLBOARD]: [
        { name: 'size', label: 'Size', type: 'text', placeholder: 'e.g., 20x10 ft' },
        { name: 'impression', label: 'Impression', type: 'text', placeholder: 'e.g., 50k daily' },
        { name: 'lighting', label: 'Lighting', type: 'text', placeholder: 'e.g., Front lit' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., City Center' },
    ],
    [SERVICE_CATEGORIES.LED_BILLBOARD]: [
        { name: 'size', label: 'Size', type: 'text', placeholder: 'e.g., 20x10 ft' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., City Center' },
    ],
    [SERVICE_CATEGORIES.RADIO]: [
        { name: 'primeTime', label: 'Prime Time', type: 'text', placeholder: 'e.g., 8-10 AM' },
        { name: 'frequency', label: 'Frequency', type: 'text', placeholder: 'e.g., 98.3 FM' },
        { name: 'topRjShows', label: 'Top RJ Shows', type: 'text', placeholder: 'e.g., Morning Drive' },
        { name: 'language', label: 'Language', type: 'text', placeholder: 'e.g., English' },
    ],
    [SERVICE_CATEGORIES.CINEMA]: [
        { name: 'venue', label: 'Venue', type: 'text', placeholder: 'e.g., PVR Koramangala' },
        { name: 'seats', label: 'Seats', type: 'number', placeholder: 'e.g., 250' },
        { name: 'screen', label: 'Screen', type: 'text', placeholder: 'e.g., Audi 1' },
        { name: 'chainOfCinema', label: 'Chain of Cinema', type: 'text', placeholder: 'e.g., PVR' },
    ],
    [SERVICE_CATEGORIES.NEWSPAPER]: [
        { name: 'language', label: 'Language', type: 'text', placeholder: 'e.g., English' },
        { name: 'areaCovered', label: 'Area Covered', type: 'text', placeholder: 'e.g., Bangalore South' },
        { name: 'circulation', label: 'Circulation', type: 'number', placeholder: 'e.g., 100000' },
        { name: 'readership', label: 'Readership', type: 'number', placeholder: 'e.g., 350000' },
        { name: 'printDay', label: 'Print Day', type: 'text', placeholder: 'e.g., Sunday' },
        { name: 'newspaperType', label: 'Newspaper Type', type: 'text', placeholder: 'e.g., Daily' },
        { name: 'categories', label: 'Categories', type: 'text', placeholder: 'e.g., General News' },
    ],
    [SERVICE_CATEGORIES.INFLUENCER]: [
        { name: 'gender', label: 'Gender', type: 'text', placeholder: 'e.g., Female' },
        { name: 'avgLikes', label: 'Avg Likes', type: 'number', placeholder: 'e.g., 5000' },
        { name: 'avgViews', label: 'Avg Views', type: 'number', placeholder: 'e.g., 20000' },
        { name: 'avgComment', label: 'Avg Comment', type: 'number', placeholder: 'e.g., 200' },
        { name: 'username', label: 'Username', type: 'text', placeholder: '@username' },
        { name: 'categories', label: 'Categories', type: 'text', placeholder: 'e.g., Lifestyle' },
        { name: 'followers', label: 'Followers', type: 'number', placeholder: 'e.g., 100000' },
        { name: 'platform', label: 'Platform', type: 'text', placeholder: 'e.g., Instagram' },
    ],
    [SERVICE_CATEGORIES.BUS]: [
        { name: 'operator', label: 'Operator', type: 'text', placeholder: 'e.g., BMTC' },
        { name: 'name', label: 'Name', type: 'text', placeholder: 'e.g., Airport Express' },
        { name: 'routes', label: 'Routes', type: 'text', placeholder: 'e.g., KIA-8' },
        { name: 'distancePerDay', label: 'Distance/Day', type: 'text', placeholder: 'e.g., 200 km' },
        { name: 'dailyViewers', label: 'Daily Viewers', type: 'number', placeholder: 'e.g., 5000' },
        { name: 'fleets', label: 'Fleets', type: 'number', placeholder: 'e.g., 50' },
    ],
    [SERVICE_CATEGORIES.CAB]: [
        { name: 'fleets', label: 'Fleets', type: 'number', placeholder: 'e.g., 100' },
        { name: 'categories', label: 'Categories', type: 'text', placeholder: 'e.g., Sedan' },
        { name: 'avgDistancePerDay', label: 'Avg Distance/Day', type: 'text', placeholder: 'e.g., 150 km' },
    ],
    [SERVICE_CATEGORIES.AUTO]: [
        { name: 'fleets', label: 'Fleets', type: 'number', placeholder: 'e.g., 200' },
        { name: 'categories', label: 'Categories', type: 'text', placeholder: 'e.g., Standard' },
        { name: 'avgDistancePerDay', label: 'Avg Distance/Day', type: 'text', placeholder: 'e.g., 100 km' },
    ],
    [SERVICE_CATEGORIES.METRO_TRAIN]: [
        { name: 'ridershipCount', label: 'Ridership Count', type: 'number', placeholder: 'e.g., 500000' },
        { name: 'routeLength', label: 'Route Length', type: 'text', placeholder: 'e.g., 40 km' },
        { name: 'categories', label: 'Categories', type: 'text', placeholder: 'e.g., Inside Coach' },
    ],
    [SERVICE_CATEGORIES.DIGITAL_TV]: [
        { name: 'monthlyReach', label: 'Monthly Reach', type: 'number', placeholder: 'e.g., 1000000' },
        { name: 'language', label: 'Language', type: 'text', placeholder: 'e.g., Hindi' },
        { name: 'primeTime', label: 'Prime Time', type: 'text', placeholder: 'e.g., 7-10 PM' },
        { name: 'categories', label: 'Categories', type: 'text', placeholder: 'e.g., News' },
    ],
    [SERVICE_CATEGORIES.DIGITAL_MARKETING]: [
        { name: 'companyName', label: 'Company Name', type: 'text', placeholder: 'e.g., Google Ads' },
        { name: 'services', label: 'Services', type: 'text', placeholder: 'e.g., SEO, SEM' },
    ],
    [SERVICE_CATEGORIES.LED_VENDING_MACHINE]: [
        { name: 'slotsAvailable', label: 'Slots Available', type: 'number', placeholder: 'e.g., 5' },
        { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 30 seconds' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Mall Entrance' },
    ],
    [SERVICE_CATEGORIES.LED_VEHICLE]: [
        { name: 'slotsAvailable', label: 'Slots Available', type: 'number', placeholder: 'e.g., 10' },
        { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g., YYYY-MM-DD' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., City Square' },
    ],
};


export const SERVICE_OPTIONS: Record<ServiceCategory, string[]> = {
    [SERVICE_CATEGORIES.BILLBOARD]: ['Hoarding', 'Printing & mounting charges'],
    [SERVICE_CATEGORIES.LED_BILLBOARD]: ['Hoardings'],
    [SERVICE_CATEGORIES.RADIO]: ['Jingle', 'RJ mention', 'contest', 'sponsorship tags'],
    [SERVICE_CATEGORIES.CINEMA]: ['Slide AD', 'Video AD'],
    [SERVICE_CATEGORIES.NEWSPAPER]: [
        'Full page',
        'Half page',
        'Quarter page',
        'Custom sized ads',
        'Jacket front side',
        'Jacket back side',
        'Jacket both sides',
        'innovative ads',
        'Pointer ads',
        'skyballs',
        'Display classified ads',
        'advertorial',
        'obituary ads',
        'public notice',
    ],
    [SERVICE_CATEGORIES.INFLUENCER]: ['Instagram reel', 'post', 'story', 'podcast', 'video', 'shorts'],
    [SERVICE_CATEGORIES.BUS]: ['Full bus exterior', 'Swing', 'Interior pamplets', 'Monitoring'],
    [SERVICE_CATEGORIES.CAB]: ['Full cab', 'door branding', 'seat back'],
    [SERVICE_CATEGORIES.AUTO]: ['Auto houd', 'Auto back panel', 'Monitoring'],
    [SERVICE_CATEGORIES.METRO_TRAIN]: [
        'Interior train branding (Metro)',
        'Interior train branding (Local)',
        'Exterior train branding (Metro)',
        'Exterior train branding (Local)',
        'Full train branding (Metro)',
        'Full train branding (Local)',
        'Metro pillars',
        'Metro stations',
        'Digital screens',
        'Promotional space',
        'Back lit',
    ],
    [SERVICE_CATEGORIES.DIGITAL_TV]: ['Video ads'],
    [SERVICE_CATEGORIES.DIGITAL_MARKETING]: ['packages'],
    [SERVICE_CATEGORIES.LED_VENDING_MACHINE]: ['Video ads', 'Static ads'],
    [SERVICE_CATEGORIES.LED_VEHICLE]: ['Video ads', 'Static ads'],
};

