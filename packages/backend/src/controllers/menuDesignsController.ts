import mongoose from 'mongoose';

import {menuDesignSchehma} from '../models/menuDesignInterfaces';

export async function getAllMenuDesigns() {
  const MenuDesigns = mongoose.model('MenuDesigns', menuDesignSchehma, 'MenuDesigns');
  return MenuDesigns.find();
}

// export async function getMaxMenuDesignsId() {
//   const MenuDesigns = mongoose.model('MenuDesigns', menuDesignSchehma, 'MenuDesigns');
//   try {
//     const menuDesign = await MenuDesigns.find()
//       .sort({ _id: -1 })
//       .limit(1);
//     if (menuDesign.length === 0) {
//       console.log('No menu design found.');
//       return 0;
//     }
//
//     const maxMenuDesignId = menuDesign[0]._id +1;
//     console.log('Max menu design id is: ', maxMenuDesignId);
//     return maxMenuDesignId;
//   } catch (error) {
//     console.error('Error occurred while getting max menu design id: ', error);
//     return null;
//   }
// }
//
// export async function updateOrCreateMenuDesigns(menuDesignId: number, menuDesignName: string,
//   maxMenuDesignId: number) {
//   try {
//     const MenuDesigns =
//       mongoose.model('MenuDesigns', menuDesignSchehma, 'MenuDesigns');
//     const menuDesign = await MenuDesigns.findOne({_id: menuDesignId});
//     let menuDesignsData = null;
//
//     if (menuDesign) {
//       menuDesignsData = await MenuDesigns.findOneAndUpdate(
//         { _id: menuDesignId },
//         { name: menuDesignName }
//       );
//     } else {
//       menuDesignsData = new MenuDesigns({
//         _id: maxMenuDesignId,
//         name: menuDesignName
//       });
//       await menuDesignsData.save();
//     }
//
//     return menuDesignsData
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
//
// export async function deleteMenuDesigns(menuDesign: number) {
//   const MenuDesigns =
//     mongoose.model('MenuDesigns', menuDesignSchehma, 'MenuDesigns');
//   return MenuDesigns.findOneAndDelete({ _id: menuDesign });
// }
