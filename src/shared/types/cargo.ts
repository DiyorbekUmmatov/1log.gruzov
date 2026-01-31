export interface Cargo {
  id: number;
  created_at: string;
  updated_at: string;
  source: string;
  origin: string;
  origin_latin: string;
  origin_country: string | null;
  destination: string;
  destination_latin: string;
  destination_country: string | null;
  type: string | null;
  weight: string | null;
  volume: string | null;
  car_type: string | null;
  price: number | null;
  date_loading: string | null;
  distance: number | null;
  company: string | null;
  full_name: string | null;
  phone: string | null;
  phones: string[];
  telegram_id: number;
  telegram_group: string;
  phoned: number;
  shared: number;
  chatted_telegram: number;
  chatted_whatsup: number;
  viewed: number;
  username: string | null;
  whatsup: string | null;
  name: string | null;
  account: number;
  is_premium: boolean;
  manager: unknown | null;
}

export interface CargoApi {
  count: number;
  results: Cargo[];
}

export type CargoParams = {
  page?: number;
  car_type?: string;
  origin: string;
  destination: string;
  origin_country?: string;
  destination_country?: string;
  created_at?: string;
  date?: string;
  weight?: string;
  volume?: string;
  is_premium?: boolean;
};

export type UpdateData = {
  phoned?: boolean;
  shared?: boolean;
  chatted_telegram?: boolean;
  chatted_whatsup?: boolean;
};
