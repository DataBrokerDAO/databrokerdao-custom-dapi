import { updateSensorPurchases } from '../dapi/purchaseRegistry';

export async function sensorPurchaseCron() {
  updateSensorPurchases();
}
