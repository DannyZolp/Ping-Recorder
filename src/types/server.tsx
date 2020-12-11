export interface server {
  key: number;
  name: string;
  ip: string;
  status?: 'online' | 'offline';
  ping: number;
}
