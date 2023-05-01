import {IDishesCommunication} from '../models/communicationInterfaces';

export function checkIfNameExists(req: IDishesCommunication) {
  if (!req.name) {
    console.log('Missing name');
    return false;
  }
  return true;
}
