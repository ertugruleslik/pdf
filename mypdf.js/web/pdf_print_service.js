/* Copyright 2016 Mozilla Foundation
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

import canvasSize from "canvas-size";
import { AnnotationMode, PixelsPerInch, shadow } from "pdfjs-lib";
import { getXfaHtmlForPrinting } from "./print_utils.js";
import { warn } from "../src/shared/util.js";

let activeService = null;
let dialog = null;
let overlayManager = null;
let viewerApp = { initialized: false };

// Renders the page to the canvas of the given print service, and returns
// the suggested dimensions of the output page.
function renderPage(
  activeServiceOnEntry,
  pdfDocument,
  pageNumber,
  size,
  printResolution,
  optionalContentConfigPromise,
  printAnnotationStoragePromise
) {
  const scratchCanvas = activeService.scratchCanvas;

  // The size of the canvas in pixels for printing.
  let PRINT_UNITS = printResolution / PixelsPerInch.PDF;

  // modified by ngx-extended-pdf-viewer #530
  let scale = 1;

  const canvasWidth = Math.floor(size.width * PRINT_UNITS);
  const canvasHeight = Math.floor(size.height * PRINT_UNITS);
  if (canvasWidth >= 4096 || canvasHeight >= 4096) {
    if (!canvasSize.test({ width: canvasWidth, height: canvasHeight })) {
      const max = determineMaxDimensions();
      scale = Math.min(max / canvasWidth, max / canvasHeight) * 0.95;
    }
    warn("Page " + pageNumber + ": Reduced the [printResolution] to " + Math.floor(printResolution * scale) + " because the browser can't render larger canvases. If you see blank page in the print preview, reduce [printResolution] manually to a lower value.");
  }

  PRINT_UNITS *= scale;
  scratchCanvas.width = Math.floor(size.width * PRINT_UNITS);
  scratchCanvas.height = Math.floor(size.height * PRINT_UNITS);

  // #1659 modified by ngx-extended-pdf-viewer
  const options = window.pdfDefaultOptions.activateWillReadFrequentlyFlag ? { willReadFrequently: true } : undefined;
  const ctx = scratchCanvas.getContext("2d", options);
  // #1659 end of modification by ngx-extended-pdf-viewer
  ctx.save();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  ctx.restore();

  return Promise.all([
    pdfDocument.getPage(pageNumber),
    printAnnotationStoragePromise,
  ]).then(function ([pdfPage, printAnnotationStorage]) {
    const renderContext = {
      canvasContext: ctx,
      transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
      viewport: pdfPage.getViewport({ scale: 1, rotation: size.rotation }),
      intent: "print",
      annotationMode: AnnotationMode.ENABLE_STORAGE,
      optionalContentConfigPromise,
      printAnnotationStorage,
    };
    return pdfPage.render(renderContext).promise;
  });
}

 // modified (added) by ngx-extended-pdf-viewer #530
 function determineMaxDimensions() {
  const checklist = [4096, // iOS
    8192, // IE 9-10
    10836, // Android
    11180, // Firefox
    11402, // Android,
    14188,
    16384
  ];
  for (let width of checklist) {
    if (!canvasSize.test({width: width+1, height: width+1})) {
      return width;
    }
  }
  return 16384;
}

class PDFPrintService {
  constructor({
    pdfDocument,
    pagesOverview,
    printContainer,
    printResolution,
    optionalContentConfigPromise = null,
    printAnnotationStoragePromise = null,
    eventBus, // #588 modified by ngx-extended-pdf-viewer
  }) {
    this.pdfDocument = pdfDocument;
    this.pagesOverview = pagesOverview;
    this.printContainer = printContainer;
    this._printResolution = printResolution || 150;
    this._optionalContentConfigPromise =
      optionalContentConfigPromise || pdfDocument.getOptionalContentConfig();
    this._printAnnotationStoragePromise =
      printAnnotationStoragePromise || Promise.resolve();
    this.currentPage = -1;
    // The temporary canvas where renderPage paints one page at a time.
    this.scratchCanvas = document.createElement("canvas");
      // #588 modified by ngx-extended-pdf-viewer
    this.eventBus = eventBus;
    // #588 end of modification
  }

  layout() {
    this.throwIfInactive();

    const body = document.querySelector("body");
    body.setAttribute("data-pdfjsprinting", true);
    // #1131 modified by ngx-extended-pdf-viewer
    const html = document.querySelector("html");
    html.setAttribute("data-pdfjsprinting", true);
    // #1131 end of modification

    const { width, height } = this.pagesOverview[0];
    const hasEqualPageSizes = this.pagesOverview.every(
      size => size.width === width && size.height === height
    );
    if (!hasEqualPageSizes) {
      globalThis.ngxConsole.warn(
        "Not all pages have the same size. The printed result may be incorrect!"
      );
    }

    // Insert a @page + size rule to make sure that the page size is correctly
    // set. Note that we assume that all pages have the same size, because
    // variable-size pages are not supported yet (e.g. in Chrome & Firefox).
    // TODO(robwu): Use named pages when size calculation bugs get resolved
    // (e.g. https://crbug.com/355116) AND when support for named pages is
    // added (http://www.w3.org/TR/css3-page/#using-named-pages).
    // In browsers where @page + size is not supported, the next stylesheet
    // will be ignored and the user has to select the correct paper size in
    // the UI if wanted.
    this.pageStyleSheet = document.createElement("style");
    this.pageStyleSheet.textContent = `@page { size: ${width}pt ${height}pt;}`;
    body.append(this.pageStyleSheet);
  }

  destroy() {
    if (activeService !== this) {
      // |activeService| cannot be replaced without calling destroy() first,
      // so if it differs then an external consumer has a stale reference to us.
      return;
    }
    this.printContainer.textContent = "";

    const body = document.querySelector("body");
    body.removeAttribute("data-pdfjsprinting");
    // #1131 modified by ngx-extended-pdf-viewer
    const html = document.querySelector("html");
    html.removeAttribute("data-pdfjsprinting");
    // #1131 end of modification

    if (this.pageStyleSheet) {
      this.pageStyleSheet.remove();
      this.pageStyleSheet = null;
    }
    this.scratchCanvas.width = this.scratchCanvas.height = 0;
    this.scratchCanvas = null;
    activeService = null;
    ensureOverlay().then(function () {
      if (overlayManager.active === dialog) {
        overlayManager.close(dialog);
      }
    });
  }

  renderPages() {
    if (this.pdfDocument.isPureXfa) {
      getXfaHtmlForPrinting(this.printContainer, this.pdfDocument);
      return Promise.resolve();
    }

    const pageCount = this.pagesOverview.length;
    const renderNextPage = (resolve, reject) => {
      this.throwIfInactive();
      while (true) {
        // #243
        ++this.currentPage; // #243
        if (this.currentPage >= pageCount) {
          // #243
          break; // #243
        } // #243
        if (
          !window.isInPDFPrintRange ||
          window.isInPDFPrintRange(this.currentPage)
        ) {
          // #243
          break; // #243
        } // #243
      } // #243

      if (this.currentPage >= pageCount) {
        renderProgress(
          window.filteredPageCount | pageCount,
          window.filteredPageCount | pageCount,
          this.eventBus // #588 modified by ngx-extended-pdf-viewer
        ); // #243
        resolve();
        return;
      }

      const index = this.currentPage;
      renderProgress(index, window.filteredPageCount | pageCount, this.eventBus); // #243 and #588 modified by ngx-extended-pdf-viewer
      renderPage(
        this,
        this.pdfDocument,
        /* pageNumber = */ index + 1,
        this.pagesOverview[index],
        this._printResolution,
        this._optionalContentConfigPromise,
        this._printAnnotationStoragePromise
      )
        .then(this.useRenderedPage.bind(this))
        .then(function () {
          renderNextPage(resolve, reject);
        }, reject);
    };
    return new Promise(renderNextPage);
  }

  useRenderedPage() {
    this.throwIfInactive();
    const img = document.createElement("img");
    const scratchCanvas = this.scratchCanvas;
    if ("toBlob" in scratchCanvas) {
      scratchCanvas.toBlob(function (blob) {
        img.src = URL.createObjectURL(blob);
      });
    } else {
      img.src = scratchCanvas.toDataURL();
    }

    const wrapper = document.createElement("div");
    wrapper.className = "printedPage";
    wrapper.append(img);
    this.printContainer.append(wrapper);

    return new Promise(function (resolve, reject) {
      img.onload = resolve;
      img.onerror = reject;
    });
  }

  performPrint() {
    this.throwIfInactive();
    return new Promise(resolve => {
      // Push window.print in the macrotask queue to avoid being affected by
      // the deprecation of running print() code in a microtask, see
      // https://github.com/mozilla/pdf.js/issues/7547.
      setTimeout(() => {
        if (!this.active) {
          resolve();
          return;
        }
        print.call(window);
        // Delay promise resolution in case print() was not synchronous.
        // modified by ngx-extended-pdf-viewer #83
        const isIOS = navigator.platform && [
          "iPad Simulator",
          "iPhone Simulator",
          "iPod Simulator",
          "iPad",
          "iPhone",
          "iPod"
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

        setTimeout(resolve, isIOS ? 1500 : 20); // Tidy-up.
        // end of modification by ngx-extended-pdf-viewer
      }, 0);
    });
  }

  get active() {
    return this === activeService;
  }

  throwIfInactive() {
    if (!this.active) {
      throw new Error("This print request was cancelled or completed.");
    }
  }
}

const print = window.print;
window.printPDF = function printPdf() {
  if (!PDFViewerApplication.enablePrint) {
    return;
  }
  if (activeService) {
    globalThis.ngxConsole.warn("Ignored window.printPDF() because of a pending print job.");
    return;
  }
  ensureOverlay().then(function () {
    if (activeService) {
      overlayManager.open(dialog);
    }
  });

  try {
    dispatchEvent("beforeprint");
  } finally {
    if (!activeService) {
      globalThis.ngxConsole.error("Expected print service to be initialized.");
      ensureOverlay().then(function () {
        if (overlayManager.active === dialog) {
          overlayManager.close(dialog);
        }
      });
      return; // eslint-disable-line no-unsafe-finally
    }
    const activeServiceOnEntry = activeService;
    activeService
      .renderPages()
      .then(function () {
        // #643 modified by ngx-extended-pdf-viewer
        const progressIndicator = document.getElementById("printServiceDialog");
        if (progressIndicator) {
          progressIndicator.classList.add("hidden");
        }
        // #643 end of modification
        return activeServiceOnEntry.performPrint();
      })
      .catch(function () {
        // Ignore any error messages.
      })
      .then(function () {
        // aborts acts on the "active" print request, so we need to check
        // whether the print request (activeServiceOnEntry) is still active.
        // Without the check, an unrelated print request (created after aborting
        // this print request while the pages were being generated) would be
        // aborted.
        if (activeServiceOnEntry.active) {
          abort();
        }
      });
  }
};

function dispatchEvent(eventType) {
  const event = new CustomEvent(eventType, {
    bubbles: false,
    cancelable: false,
    detail: "custom",
  });
  window.dispatchEvent(event);
}

function abort() {
  if (activeService) {
    activeService.destroy();
    dispatchEvent("afterprint");
  }
}

function renderProgress(index, total, eventBus) { // #588 modified by ngx-extended-pdf-viewer
  if (typeof PDFJSDev === "undefined" && window.isGECKOVIEW) {
    return;
  }
  dialog = document.getElementById("printServiceDialog"); // #1434 modified by ngx-extended-pdf-viewer
  const progress = Math.round((100 * index) / total);
  const progressBar = dialog.querySelector("progress");
  const progressPerc = dialog.querySelector(".relative-progress");
  progressBar.value = progress;
  progressPerc.setAttribute("data-l10n-args", JSON.stringify({ progress }));
  // #588 modified by ngx-extended-pdf-viewer
  eventBus.dispatch("progress", {
    source: this,
    type: "print",
    total,
    page: index,
    percent: (100 * index) / total,
  });
  // #588 end of modification

}

window.addEventListener(
  "keydown",
  function (event) {
    // Intercept Cmd/Ctrl + P in all browsers.
    // Also intercept Cmd/Ctrl + Shift + P in Chrome and Opera
    if (
      event.keyCode === /* P= */ 80 &&
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      (!event.shiftKey || window.chrome || window.opera)
    ) {
      window.print();

      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);

if ("onbeforeprint" in window) {
  // Do not propagate before/afterprint events when they are not triggered
  // from within this polyfill. (FF / Chrome 63+).
  const stopPropagationIfNeeded = function (event) {
    if (event.detail !== "custom") {
      event.stopImmediatePropagation();
    }
  };
  window.addEventListener("beforeprint", stopPropagationIfNeeded);
  window.addEventListener("afterprint", stopPropagationIfNeeded);
}

let overlayPromise;
function ensureOverlay() {
  if (typeof PDFJSDev === "undefined" && window.isGECKOVIEW) {
    return Promise.reject(
      new Error("ensureOverlay not implemented in GECKOVIEW development mode.")
    );
  }
  if (!overlayPromise) {
    overlayManager = viewerApp.overlayManager;
    if (!overlayManager) {
      throw new Error("The overlay manager has not yet been initialized.");
    }
    dialog = document.getElementById("printServiceDialog"); // #1434 modified by ngx-extended-pdf-viewer

    overlayPromise = overlayManager.register(
      dialog,
      /* canForceClose = */ true
    );

    document.getElementById("printCancel").onclick = abort;
    dialog.addEventListener("close", abort);
  }
  return overlayPromise;
}

/**
 * @implements {IPDFPrintServiceFactory}
 */
class PDFPrintServiceFactory {
  static initGlobals(app) {
    viewerApp = app;
  }

  static get supportsPrinting() {
    return shadow(this, "supportsPrinting", true);
  }

  static createPrintService(params) {
    if (activeService) {
      throw new Error("The print service is created and active.");
    }
    return (activeService = new PDFPrintService(params));
  }
}

export { PDFPrintServiceFactory };
