const DB = 'within-audio-v1';
const STORE = 'recordings';
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function putAudio(id: string, blob: Blob) {
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  }); db.close();
}
export async function getAudio(id: string): Promise<Blob | undefined> {
  const db = await open();
  const value = await new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE); const request = tx.objectStore(STORE).get(id);
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  }); db.close(); return value;
}
export async function deleteAudio(id: string) {
  const db = await open(); await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  }); db.close();
}
export async function clearAudio() {
  const db = await open(); await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  }); db.close();
}
