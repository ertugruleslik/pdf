/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AppOptions } from "./app_options.js";

const DEFAULT_VIEW_HISTORY_CACHE_SIZE = 20;

/**
 * View History - This is a utility for saving various view parameters for
 *                recently opened files.
 *
 * The way that the view parameters are stored depends on how PDF.js is built,
 * for 'gulp <flag>' the following cases exist:
 *  - MOZCENTRAL        - uses sessionStorage.
 *  - GENERIC or CHROME - uses localStorage, if it is available.
 */
class ViewHistory {
  constructor(fingerprint, cacheSize = DEFAULT_VIEW_HISTORY_CACHE_SIZE) {
    this.fingerprint = fingerprint;
    this.cacheSize = cacheSize;

    this._initializedPromise = this._readFromStorage().then(databaseStr => {
      const database = JSON.parse(databaseStr || "{}");
      let index = -1;
      if (!Array.isArray(database.files)) {
        database.files = [];
      } else {
        while (database.files.length >= this.cacheSize) {
          database.files.shift();
        }

        for (let i = 0, ii = database.files.length; i < ii; i++) {
          const branch = database.files[i];
          if (branch.fingerprint === this.fingerprint) {
            index = i;
            break;
          }
        }
      }
      if (index === -1) {
        index = database.files.push({ fingerprint: this.fingerprint }) - 1;
      }
      this.file = database.files[index];
      this.database = database;
    });
  }

  async _writeToStorage() {
    // #1163 modified by ngx-extended-pdf-viewer
    if (AppOptions.get("disableHistory")) {
      return;
    }
    // #1163 end of modification by ngx-extended-pdf-viewer
    const databaseStr = JSON.stringify(this.database);

    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
      sessionStorage.setItem("pdfjs.history", databaseStr);
      return;
    }
    // #1313 modified by ngx-extended-pdf-viewer
    try {
      localStorage.setItem("pdfjs.history", databaseStr);
    } catch (safariSecurityException) {
      // localStorage is not available on Safari
    }
    // #1313 end of modification by ngx-extended-pdf-viewer

  }

  async _readFromStorage() {
    if (AppOptions.get("disableHistory")) {
      return undefined;
    }
    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
      return sessionStorage.getItem("pdfjs.history");
    }
    // #1313 modified by ngx-extended-pdf-viewer
    try {
      return localStorage.getItem("pdfjs.history");
    } catch (safariSecurityException) {
      // localStorage is not available on Safari
      return undefined;
    }
    // #1313 end of modification by ngx-extended-pdf-viewer
  }

  async set(name, val) {
    await this._initializedPromise;
    this.file[name] = val;
    return this._writeToStorage();
  }

  async setMultiple(properties) {
    await this._initializedPromise;
    for (const name in properties) {
      this.file[name] = properties[name];
    }
    return this._writeToStorage();
  }

  async get(name, defaultValue) {
    await this._initializedPromise;
    const val = this.file[name];
    return val !== undefined ? val : defaultValue;
  }

  async getMultiple(properties) {
    await this._initializedPromise;
    const values = Object.create(null);

    for (const name in properties) {
      const val = this.file[name];
      values[name] = val !== undefined ? val : properties[name];
    }
    return values;
  }
}

export { ViewHistory };