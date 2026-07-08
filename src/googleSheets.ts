/**
 * Google Sheets Integration Utility
 * This file replaces Firebase/Firestore by reading and writing directly to the user's Google Sheet
 * Spreadsheet URL: https://docs.google.com/spreadsheets/d/14nWPvAKtDAHgScXiRxnypHLqNRFcRgIj_kHN6No-Tis/edit
 */

import { RSVP, BlessingMessage } from './types';


const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || "14nWPvAKtDAHgScXiRxnypHLqNRFcRgIj_kHN6No-Tis";

function parseGoogleSheetRows(rows: any[]): BlessingMessage[] {
  const parsed = rows.map((row: any, idx: number) => {
    const cols = row.c || [];
    const getValue = (cell: any) => {
      if (!cell) return "";
      return cell.v !== null && cell.v !== undefined ? String(cell.v) : "";
    };

    const submittedAtVal = getValue(cols[0]);
    const senderName = getValue(cols[1]);
    const relation = getValue(cols[2]);
    const message = getValue(cols[3]);
    const cardStyleVal = getValue(cols[4]);

    // Handle custom Google Visualization date formats like "Date(2027,1,22,10,30,0)"
    let submittedAt = new Date();
    if (submittedAtVal) {
      if (submittedAtVal.includes("Date(")) {
        const parts = submittedAtVal.match(/\d+/g);
        if (parts && parts.length >= 3) {
          submittedAt = new Date(
            parseInt(parts[0]),
            parseInt(parts[1]), // Note: Sheets might return 0-indexed month
            parseInt(parts[2]),
            parts[3] ? parseInt(parts[3]) : 0,
            parts[4] ? parseInt(parts[4]) : 0,
            parts[5] ? parseInt(parts[5]) : 0
          );
        }
      } else {
        const timestamp = Date.parse(submittedAtVal);
        if (!isNaN(timestamp)) {
          submittedAt = new Date(timestamp);
        }
      }
    }

    return {
      id: `sheet-${idx}`,
      senderName: senderName || "शुभचिंतक",
      relation: relation || "Well Wisher",
      message: message || "",
      cardStyle: cardStyleVal ? parseInt(cardStyleVal) || 0 : 0,
      submittedAt
    };
  });

  // Filter out headers or empty messages
  return parsed.filter(item => {
    const nameLower = item.senderName.toLowerCase().trim();
    const msgLower = item.message.toLowerCase().trim();
    
    if (nameLower === "sender name" || msgLower === "blessing message" || msgLower === "message" || nameLower === "submitted at") {
      return false;
    }
    if (!item.message.trim()) {
      return false;
    }
    return true;
  });
}

/**
 * Fetch blessings directly from the public Google Sheet using Google's public JSON Visualization endpoint.
 * This does NOT require any API keys or credentials, meaning there's absolutely NO danger of key exposure!
 * Note: For this to work, the spreadsheet must be set to "Anyone with the link can view" in Google Drive.
 */
export async function fetchBlessingsFromSheets(): Promise<BlessingMessage[]> {
  const primaryUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=Shubhkaamna&tqx=out:json`;
  const fallbackUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=Blessings&tqx=out:json`;
  const defaultUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

  async function fetchSheetRows(url: string): Promise<any[] | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Fetch to URL ${url} failed with status: ${response.status}`);
        return null;
      }
      const text = await response.text();
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
      if (!match) {
        console.warn(`Response from ${url} did not match google.visualization regex. Text snippet: ${text.slice(0, 100)}`);
        return null;
      }

      const obj = JSON.parse(match[1]);
      if (obj.status === "error") {
        console.warn(`Google Sheet API returned error for URL ${url}:`, obj.errors);
        return null;
      }

      const table = obj.table;
      if (!table || !table.rows || table.rows.length === 0) {
        console.warn(`No table rows found in Google Sheet response for URL ${url}`);
        return null;
      }

      return table.rows;
    } catch (e) {
      console.warn(`Exception while fetching from ${url} (using offline fallback mode):`, e);
      return null;
    }
  }

  // 1. Try Shubhkaamna sheet first
  let rows = await fetchSheetRows(primaryUrl);

  // 2. If Shubhkaamna is not there/empty, try Blessings
  if (!rows) {
    console.warn("Shubhkaamna sheet not found or empty, trying Blessings sheet...");
    rows = await fetchSheetRows(fallbackUrl);
  }

  // 3. If both are missing/empty, try default first sheet of the spreadsheet
  if (!rows) {
    console.warn("Blessings sheet not found or empty, trying default first sheet...");
    rows = await fetchSheetRows(defaultUrl);
  }

  if (!rows) {
    console.warn("No data rows found in any Google Sheet tab.");
    return [];
  }

  const sheetBlessings = parseGoogleSheetRows(rows);
  return sheetBlessings.reverse();
}

/**
 * Submit RSVP to Google Sheet via Google Apps Script Web App.
 * If the Web App URL is not set up yet, it gracefully falls back to saving locally
 * so the RSVP is NEVER lost and the guest gets a seamless experience!
 */
export async function submitRsvpToSheets(rsvp: RSVP): Promise<boolean> {
  const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";
  
  if (!APPS_SCRIPT_URL) {
    console.warn("VITE_APPS_SCRIPT_URL is not defined yet. Saving RSVP in Local Storage.");
    saveRsvpLocally(rsvp);
    return false;
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Use no-cors mode to bypass browser CORS preflight & redirect blocks
      headers: {
        "Content-Type": "text/plain", // Keep as text/plain to avoid CORS preflight triggers
      },
      body: JSON.stringify({
        action: "rsvp",
        fullName: rsvp.fullName,
        phoneOrEmail: rsvp.phoneOrEmail,
        attendingEvents: rsvp.attendingEvents.join(", "),
        guestsCount: rsvp.guestsCount,
        foodPreference: rsvp.foodPreference,
        specialMessage: rsvp.specialMessage,
        submittedAt: rsvp.submittedAt.toISOString(),
      }),
    });
    
    // Save to local storage backup for instantaneous feedback & offline reliability
    saveRsvpLocally(rsvp);
    return true; // Return true as fetch successfully dispatched and no exception was thrown
  } catch (err) {
    console.warn("CORS or network error submitting RSVP, saved locally:", err);
    saveRsvpLocally(rsvp);
    return false;
  }
}

/**
 * Submit Blessing Message to Google Sheet.
 */
export async function submitBlessingToSheets(blessing: Omit<BlessingMessage, "id" | "submittedAt">): Promise<boolean> {
  const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";
  const submittedAt = new Date();

  const newBlessing: BlessingMessage = {
    ...blessing,
    id: `local-${Date.now()}`,
    submittedAt
  };

  saveBlessingLocally(newBlessing);

  if (!APPS_SCRIPT_URL) {
    console.warn("VITE_APPS_SCRIPT_URL is not defined yet.");
    return false;
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Use no-cors mode to follow redirects cleanly without CORS blocking
      headers: {
        "Content-Type": "text/plain", // Keep as text/plain to avoid CORS preflight triggers
      },
      body: JSON.stringify({
        action: "blessing",
        senderName: blessing.senderName,
        relation: blessing.relation,
        message: blessing.message,
        cardStyle: blessing.cardStyle,
        submittedAt: submittedAt.toISOString(),
      }),
    });
    return true; // Return true as fetch successfully dispatched and no exception was thrown
  } catch (err) {
    console.warn("CORS or network error submitting Blessing, saved locally:", err);
    return false;
  }
}

// --- Local Storage Backup Helpers ---

function saveRsvpLocally(rsvp: RSVP) {
  try {
    const existing = localStorage.getItem("local_rsvps");
    const list = existing ? JSON.parse(existing) : [];
    list.push({
      ...rsvp,
      submittedAt: rsvp.submittedAt.toISOString()
    });
    localStorage.setItem("local_rsvps", JSON.stringify(list));
  } catch (e) {
    console.warn("Failed to write RSVP to localStorage", e);
  }
}

function saveBlessingLocally(blessing: BlessingMessage) {
  try {
    const existing = localStorage.getItem("local_blessings");
    const list = existing ? JSON.parse(existing) : [];
    list.push({
      ...blessing,
      submittedAt: blessing.submittedAt.toISOString()
    });
    localStorage.setItem("local_blessings", JSON.stringify(list));
  } catch (e) {
    console.warn("Failed to write Blessing to localStorage", e);
  }
}

export function getLocalBlessings(): BlessingMessage[] {
  try {
    const existing = localStorage.getItem("local_blessings");
    if (!existing) return [];
    const parsed = JSON.parse(existing);
    return parsed.map((b: any) => ({
      ...b,
      submittedAt: new Date(b.submittedAt)
    }));
  } catch (e) {
    console.warn("Failed to read Blessings from localStorage", e);
    return [];
  }
}

/**
 * GOOGLE APPS SCRIPT CODE REFERENCE:
 * Tell the user to open Google Sheet, click Extensions -> Apps Script, and paste this code:
 * 
 * ```javascript
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     var action = data.action;
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     
 *     if (action === "rsvp") {
 *       var sheet = ss.getSheetByName("RSVP") || ss.insertSheet("RSVP");
 *       if (sheet.getLastRow() === 0) {
 *         sheet.appendRow(["Submitted At", "Full Name", "Contact/Phone/Email", "Attending Events", "Guests Count", "Food Preference", "Special Message"]);
 *         sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f4ebe1").setFontColor("#800020");
 *       }
 *       sheet.appendRow([
 *         data.submittedAt,
 *         data.fullName,
 *         data.phoneOrEmail,
 *         data.attendingEvents,
 *         data.guestsCount,
 *         data.foodPreference,
 *         data.specialMessage
 *       ]);
 *     } else if (action === "blessing") {
 *       var sheet = ss.getSheetByName("Shubhkaamna") || ss.getSheetByName("Blessings");
 *       if (!sheet) {
 *         sheet = ss.insertSheet("Shubhkaamna");
 *       }
 *       if (sheet.getLastRow() === 0) {
 *         sheet.appendRow(["Submitted At", "Sender Name", "Relation", "Blessing Message", "Card Style"]);
 *         sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#f4ebe1").setFontColor("#800020");
 *       }
 *       sheet.appendRow([
 *         data.submittedAt,
 *         data.senderName,
 *         data.relation,
 *         data.message,
 *         data.cardStyle
 *       ]);
 *     }
 *     
 *     return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * 
 * function doGet(e) {
 *   return ContentService.createTextOutput("Rajesh & Anchal Wedding RSVP & Blessings Sheet Sync is active! Use POST to submit data.");
 * }
 * ```
 */
