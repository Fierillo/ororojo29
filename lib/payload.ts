import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const getPayloadClient = async () => {
  return await getPayload({ config: configPromise });
};