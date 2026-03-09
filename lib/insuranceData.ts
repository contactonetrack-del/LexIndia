export interface InsurancePolicy {
  id: string;
  providerName: string;
  planName: string;
  coverageType: 'Individual' | 'Family Floater';
  sumInsured: number;
  premium: number; // Monthly
  claimSettlementRatio: number;
  networkHospitals: number;
  coPay: string;
  roomRentLimit: string;
  preExistingWaitingPeriod: string;
  features: string[];
}

export const healthPolicies: InsurancePolicy[] = [
  {
    id: 'h1',
    providerName: 'HDFC ERGO',
    planName: 'Optima Secure',
    coverageType: 'Family Floater',
    sumInsured: 1000000,
    premium: 1250,
    claimSettlementRatio: 98.5,
    networkHospitals: 10500,
    coPay: 'No Co-pay',
    roomRentLimit: 'No Limit',
    preExistingWaitingPeriod: '3 Years',
    features: ['4X Coverage', 'Protect Benefit', 'Preventive Health Checkup']
  },
  {
    id: 'h2',
    providerName: 'Care Health',
    planName: 'Care Supreme',
    coverageType: 'Family Floater',
    sumInsured: 1000000,
    premium: 1050,
    claimSettlementRatio: 95.2,
    networkHospitals: 9400,
    coPay: 'No Co-pay',
    roomRentLimit: 'Single Private Room',
    preExistingWaitingPeriod: '4 Years',
    features: ['Unlimited Automatic Recharge', 'AYUSH Treatment', 'Annual Health Checkup']
  },
  {
    id: 'h3',
    providerName: 'Star Health',
    planName: 'Comprehensive',
    coverageType: 'Family Floater',
    sumInsured: 1000000,
    premium: 1400,
    claimSettlementRatio: 90.1,
    networkHospitals: 14000,
    coPay: '10% (above 60 yrs)',
    roomRentLimit: 'Single Private Room',
    preExistingWaitingPeriod: '3 Years',
    features: ['Bariatric Surgery Cover', 'Maternity Cover', 'Outpatient Dental/Ophthalmic']
  },
  {
    id: 'h4',
    providerName: 'ICICI Lombard',
    planName: 'Health AdvantEdge',
    coverageType: 'Individual',
    sumInsured: 500000,
    premium: 750,
    claimSettlementRatio: 97.8,
    networkHospitals: 7500,
    coPay: 'No Co-pay',
    roomRentLimit: 'No Limit',
    preExistingWaitingPeriod: '2 Years',
    features: ['Domestic Evacuation', 'Wellness Program', 'Teleconsultation']
  },
  {
    id: 'h5',
    providerName: 'Niva Bupa',
    planName: 'ReAssure 2.0',
    coverageType: 'Family Floater',
    sumInsured: 1000000,
    premium: 1150,
    claimSettlementRatio: 96.0,
    networkHospitals: 8500,
    coPay: 'No Co-pay',
    roomRentLimit: 'No Limit',
    preExistingWaitingPeriod: '3 Years',
    features: ['Booster+ Benefit', 'Safeguard Benefit', 'LiveHealthy Discount']
  }
];
