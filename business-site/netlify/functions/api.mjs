// Netlify Function: the same api-core as serve.mjs, backed by Netlify Blobs.
// Set ADMIN_PASSWORD in Netlify: Site configuration > Environment variables.

import { getStore } from '@netlify/blobs';
import { createApi } from '../../server/api-core.mjs';

const store = () => getStore({ name: 'business-site', consistency: 'strong' });

const blobStorage = {
  async getContent() {
    return (await store().get('content', { type: 'json' })) ?? null;
  },
  async setContent(content) {
    await store().setJSON('content', content);
  },
  async getImage(id) {
    const result = await store().getWithMetadata(`images/${id}`, { type: 'arrayBuffer' });
    if (!result) return null;
    return { data: new Uint8Array(result.data), type: result.metadata?.type || 'application/octet-stream' };
  },
  async setImage(id, data, type) {
    const bytes = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    await store().set(`images/${id}`, bytes, { metadata: { type } });
  },
  async deleteImage(id) {
    await store().delete(`images/${id}`);
  },
};

const api = createApi({
  storage: blobStorage,
  getPassword: () => process.env.ADMIN_PASSWORD || '',
  // Used to decide when an offer has expired. India by default.
  timeZone: process.env.TIME_ZONE || 'Asia/Kolkata',
});

export default (request) => api.handle(request);

export const config = { path: '/api/*' };
