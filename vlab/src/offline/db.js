// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — offline persistence (spec §19).
// IndexedDB-backed key/value store per named "table", with an
// automatic localStorage fallback (older browsers, or environments
// where IndexedDB is unavailable e.g. some file:// contexts). Never
// throws for lack of storage — the app must keep working with
// in-memory-only state as a last resort.
//
// This module is browser-only (touches window/indexedDB/localStorage
// directly) and is not exercised by tools/test-vlab.js.
// ══════════════════════════════════════════════════════════════

(function (root) {
    'use strict';
    if (!root) return;

    const DB_NAME = 'vlab-cbse-2026-27';
    const DB_VERSION = 1;
    const STORES = [
        'studentProfile', 'experimentProgress', 'experimentAttempts',
        'observations', 'assessmentResults', 'vivaAttempts',
        'settings', 'cachedCurriculum', 'appVersion', 'syncQueue'
    ];

    let dbPromise = null;

    function hasIndexedDB() {
        try { return typeof root.indexedDB !== 'undefined' && root.indexedDB !== null; }
        catch { return false; }
    }

    function openDB() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            if (!hasIndexedDB()) { reject(new Error('IndexedDB unavailable')); return; }
            const req = root.indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                STORES.forEach(name => {
                    if (!db.objectStoreNames.contains(name)) {
                        db.createObjectStore(name, { keyPath: 'id' });
                    }
                });
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
        }).catch(err => { dbPromise = null; throw err; });
        return dbPromise;
    }

    function lsKey(store, id) { return 'vlab:' + store + ':' + id; }

    function lsPut(store, record) {
        try {
            root.localStorage.setItem(lsKey(store, record.id), JSON.stringify(record));
            return true;
        } catch { return false; }
    }

    function lsGet(store, id) {
        try {
            const raw = root.localStorage.getItem(lsKey(store, id));
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    function lsGetAll(store) {
        const out = [];
        try {
            const prefix = 'vlab:' + store + ':';
            for (let i = 0; i < root.localStorage.length; i++) {
                const k = root.localStorage.key(i);
                if (k && k.indexOf(prefix) === 0) {
                    try { out.push(JSON.parse(root.localStorage.getItem(k))); } catch { /* skip corrupt entry */ }
                }
            }
        } catch { /* localStorage unavailable */ }
        return out;
    }

    // put(store, record) — record must have an `id`. Resolves true on
    // success (IndexedDB or localStorage), false if neither is available.
    function put(store, record) {
        if (!record || record.id == null) return Promise.reject(new Error('record.id is required'));
        return openDB()
            .then(db => new Promise((resolve, reject) => {
                const tx = db.transaction(store, 'readwrite');
                tx.objectStore(store).put(record);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error);
            }))
            .catch(() => lsPut(store, record));
    }

    function get(store, id) {
        return openDB()
            .then(db => new Promise((resolve, reject) => {
                const tx = db.transaction(store, 'readonly');
                const req = tx.objectStore(store).get(id);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            }))
            .catch(() => lsGet(store, id));
    }

    function getAll(store) {
        return openDB()
            .then(db => new Promise((resolve, reject) => {
                const tx = db.transaction(store, 'readonly');
                const req = tx.objectStore(store).getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => reject(req.error);
            }))
            .catch(() => lsGetAll(store));
    }

    root.VLAB = root.VLAB || {};
    root.VLAB.db = { STORES, put, get, getAll, hasIndexedDB };
})(typeof window !== 'undefined' ? window : null);
