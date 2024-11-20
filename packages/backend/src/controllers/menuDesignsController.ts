import mongoose from 'mongoose';

import {menuDesignSchehma} from '../models/menuDesignInterfaces';

export async function getAllMenuDesigns() {
  const MenuDesigns = mongoose.model('MenuDesigns', menuDesignSchehma, 'MenuDesigns');
  return MenuDesigns.find();
}
