import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export default defineConfig({
  plugins: [react(), {
    name: 'within-offline-shell',
    closeBundle() {
      const root = 'dist';
      const files = readdirSync(root, { recursive: true }).filter(path => typeof path === 'string' && !path.endsWith('sw.js') && !path.endsWith('.map')).map(path => String(path).replaceAll('\\', '/'));
      const assets = ['/', ...files.filter(path => statSync(join(root, path)).isFile()).map(path => `/${path}`)];
      const hash = createHash('sha256'); assets.slice(1).forEach(path => { hash.update(path); hash.update(readFileSync(join(root, path))); });
      const version = hash.digest('hex').slice(0, 12);
      writeFileSync(join(root, 'sw.js'), `const CACHE='within-${version}';const ASSETS=${JSON.stringify(assets)};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('within-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;if(r.mode==='navigate'){e.respondWith(fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put('/',copy))}return response}).catch(()=>caches.match('/')));return}e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return response})))})`);
    },
  }],
  build: { target: 'es2022' },
});
