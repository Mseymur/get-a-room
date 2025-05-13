import {Gender} from './gender';

export interface Name {
  id: number;
  firstName: string;
  lastName: string;
  genderId: number;
  gender: Gender;
  age: number;
  phoneNumber: string;
  updateAt: string;
  createdAt: string;
  email: string;
  isConfirmed: string;
}
