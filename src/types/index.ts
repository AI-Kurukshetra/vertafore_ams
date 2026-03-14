export type UserRole = 'admin' | 'agent' | 'manager'
export type Gender = 'male' | 'female' | 'other'
export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'churned'
export type PolicyType = 'auto' | 'home' | 'life' | 'health' | 'commercial' | 'liability'
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending' | 'renewed'

export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  client_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  date_of_birth: string | null
  gender: Gender | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  occupation: string | null
  company_name: string | null
  status: ClientStatus
  notes: string | null
  avatar_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Policy {
  id: string
  policy_number: string
  client_id: string
  policy_type: PolicyType
  carrier_name: string
  premium_amount: number
  coverage_amount: number | null
  deductible: number | null
  effective_date: string
  expiration_date: string
  status: PolicyStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  client?: Client
}

export interface ClientFilters {
  search: string
  status: ClientStatus | 'all'
  gender: Gender | 'all'
}

export interface PolicyFilters {
  search: string
  status: PolicyStatus | 'all'
  policy_type: PolicyType | 'all'
  carrier: string
}

export interface DashboardStats {
  totalClients: number
  activeClients: number
  activePolicies: number
  expiringThisMonth: number
  totalAnnualPremium: number
  policyByType: Record<PolicyType, number>
}
