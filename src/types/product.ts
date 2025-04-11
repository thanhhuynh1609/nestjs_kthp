import { Document, Types } from 'mongoose';

import { User } from './user';

export interface Product extends Document {
  // owner: User;
  owner: Types.ObjectId | User;
  title: string;
  image: string;
  description: string;
  price: number;
  created: Date;
}
