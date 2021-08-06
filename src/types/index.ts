export interface WorkData {
  deposit?: string;
  createBlock?: string;
}

export interface Work {
  tokenId: number;
  name: string;
  url?: string;
  status: number;
  address: string;
  description: string;
  metadata: string;
  externalLinks: string;
  price?: number | string;
  latestPrice?: number;
  categoryId: number;
  classId: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  data?: WorkData;
  pledge?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Order {
  currencyId: string;
  deadline: string;
  orderOwner: string;
  deposit: string;
  classId: number;
  tokenId: number;
  price: string;
  owner: string;
  categoryId: number;
}

export interface Collection {
  name: string;
  id: number;
  classId: number;
  description: string;
  totalIssuance: number;
}
