import { updateSensorPurchases } from '../dapi/purchase';

export async function sensorPurchaseCron() {
  updateSensorPurchases();
}
