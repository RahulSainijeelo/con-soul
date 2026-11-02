export interface AmbassadorApplication {
  id?: string;
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  collegeName: string;
  degree: string;
  branch: string;
  graduationYear: string;
  studentIdUrl: string; // URL to uploaded student ID image
  socialProfileUrl: string; // Instagram or LinkedIn
  campusInfluence: string; // Description of campus networks
  preferredPromoCode: string; // e.g. ARYAN-NITR
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  generatedPromoCode?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AmbassadorProfile {
  userId: string;
  promoCode: string;
  tier: 'bronze' | 'silver' | 'gold';
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  seatsFilledForFreeTripGoal: number;
  isActive: boolean;
  activatedAt: string;
}

export type AmbassadorApplicationStatus = 'not_applied' | 'pending' | 'approved' | 'rejected';
