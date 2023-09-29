export type User = {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  reservations?: Reservation[];
};

export type Officer = {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
};

export type Reservation = {
  id: number;
  userId: number;
  spotId: number;
  startTime: Date;
  location?: string;
  endTime: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  ParkingSpot?: ParkingSpot;
};

export type ParkingSpot = {
  id: number;
  location?: string | null;
  dateTime?: Date | null | string;
  available: string;
  reservations?: Reservation[];
};

export interface Response<ctx> {
  data: ctx;
  token?: string;
  status?: number;
  message?: string;
}
