const DB_NAME = "resumeAnalyzer";
const STORE_NAME = "analysis";
const LAST_KEY = "last";

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveLastAnalysis = async (data) => {
  if (typeof indexedDB === "undefined") return;

  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put({ data, savedAt: Date.now() }, LAST_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // Ignore persistence failures.
  }
};

export const loadLastAnalysis = async () => {
  if (typeof indexedDB === "undefined") return null;

  try {
    const db = await openDb();
    const result = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(LAST_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);

      tx.oncomplete = () => db.close();
      tx.onerror = () => db.close();
    });

    return result?.data ?? null;
  } catch {
    return null;
  }
};
