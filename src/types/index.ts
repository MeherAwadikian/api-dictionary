export type ApiEntry = {
  name: string;
  category: string;
  description: string;
  auth: string;
  https: boolean | string;
  cors: string;
  link: string;
  useCase: string;
};

export type Filters = {
  category: string;
  auth: string;
  httpsOnly: boolean;
  corsSupport: string;
};
