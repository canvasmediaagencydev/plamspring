"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout?: unknown;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => unknown;
        InlineLayout?: { SIMPLE: unknown };
      };
    };
  }
}

/**
 * Initialises Google Translate on the page.
 *
 * The hidden `#google_translate_element` div is required by the widget.
 * Actual language switching is handled externally via the `googtrans` cookie
 * so this component just boots the script — the LanguageSwitcher controls it.
 *
 * The Node-prototype patches below suppress React hydration warnings that
 * Google Translate causes by mutating the DOM behind React's back.
 */
export default function GoogleTranslateProvider() {
  useEffect(() => {
    // ── Patch Node prototypes to suppress React hydration errors ──
    if (typeof Node === "function" && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          console.warn("Cannot remove a child from a different parent", child, this);
          return child;
        }
        return originalRemoveChild.apply(this, [child]) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(
        newNode: T,
        referenceNode: Node | null
      ): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          console.warn(
            "Cannot insert before a reference node from a different parent",
            referenceNode,
            this
          );
          return newNode;
        }
        return originalInsertBefore.apply(this, [newNode, referenceNode]) as T;
      };
    }

    // ── Boot Google Translate ──
    window.googleTranslateElementInit = function () {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "th",
            includedLanguages: "en,th,zh-TW", // Thai, English, Traditional Chinese
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.querySelectorAll('script[src*="translate.google.com"]').forEach((s) => s.remove());
    };
  }, []);

  // The widget itself is hidden — switching is cookie-driven via LanguageSwitcher
  return <div id="google_translate_element" className="hidden" />;
}
