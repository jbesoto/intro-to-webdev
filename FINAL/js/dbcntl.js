import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const DATABASE_URL = "https://qfgukdtejvguiqtlqfay.supabase.co";
const DATABASE_KEY = "PASTE KEY HERE";
const TAP_DATA_LIMIT = 35;
const PREVIEW_LIMIT = 10;

const db = createClient(`${DATABASE_URL}`, `${DATABASE_KEY}`);

/**
 * Asynchronously loads action data from Supabase into a specified HTML table.
 * Populates the table with action-related data including device info, timestamps,
 * orders, employees, and machines.
 *
 * @param {HTMLTableElement} table - The HTML table element to populate.
 * @param {number} limit - Maximum number of records to fetch.
 */
const loadActions = async (table, limit) => {
  const response = await db
    .from("action_tap_data")
    .select()
    .limit(limit)
    .order("timestamp", { ascending: false });
  const data = response.data;

  const headers = ["Device", "Timestamp", "Order", "Employee", "Machine"];

  const thead = table.querySelector("THEAD");
  const tbody = table.querySelector("TBODY");

  // Clear the table
  thead.innerHTML = "<tr></tr>";
  tbody.innerHTML = "";

  // Populate headers
  for (const headerText of headers) {
    const header = document.createElement("TH");
    header.textContent = headerText;
    thead.querySelector("TR").appendChild(header);
  }

  // Populate rows
  for (const record of data) {
    const row = document.createElement("TR");
    for (const property in record) {
      let value = record[property];
      if (!value) {
        if (property == "machine_id") {
          value = "Ship_Null_1";
        }
      }

      const cell = document.createElement("TD");
      if (property == "device_id") {
        let span = document.createElement("SPAN");
        span.classList.add("text-secondary");
        span.textContent = value;
        cell.appendChild(span);
      } else {
        cell.textContent = value;
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
};

/**
 * Asynchronously fetches device data from Supabase and populates the specified
 * HTML table. Lists devices, their allocation status, and associated machines.
 *
 * @param {HTMLTableElement} table - The HTML table element to populate.
 */
const loadDevices = async (table) => {
  const response = await db
    .from("devices")
    .select()
    .order("allocated", { ascending: false });
  const data = response.data;

  const headers = ["Device", "Machine", "Allocated"];

  const thead = table.querySelector("THEAD");
  const tbody = table.querySelector("TBODY");

  // Clear the table
  thead.innerHTML = "<tr></tr>";
  tbody.innerHTML = "";

  // Populate headers
  for (const headerText of headers) {
    const header = document.createElement("TH");
    header.textContent = headerText;
    thead.querySelector("TR").appendChild(header);
  }

  // Populate rows
  for (const record of data) {
    const row = document.createElement("TR");
    for (const property in record) {
      let value = record[property];
      if (!value) {
        if (property == "machine_id") {
          value = "Ship_Null_1";
        } else if (property == "allocated") {
          value = "false";
        }
      }
      const cell = document.createElement("TD");
      cell.textContent = value;
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
};

/**
 * Asynchronously retrieves order data from Supabase and fills the given HTML
 * table. Details include order number, employee, device, timestamp, and machine
 * information.
 *
 * @param {HTMLTableElement} table - The HTML table element to populate.
 */
const loadOrders = async (table) => {
  const response = await db
    .from("order_tap_data")
    .select()
    .limit(TAP_DATA_LIMIT)
    .order("timestamp", { ascending: true });
  const data = response.data;

  const headers = ["Order", "Employee", "Device", "Timestamp", "Machine"];

  const thead = table.querySelector("THEAD");
  const tbody = table.querySelector("TBODY");

  thead.innerHTML = "<tr></tr>";
  tbody.innerHTML = "";

  // Populate headers
  for (const headerText of headers) {
    const header = document.createElement("TH");
    header.textContent = headerText;
    thead.querySelector("TR").appendChild(header);
  }

  // Populate rows
  for (const record of data) {
    const row = document.createElement("TR");
    for (const property in record) {
      let value = record[property];
      if (!value) {
        if (property == "employee_id") {
          value = "5000";
        } else if (property == "machine_id") {
          value = "Ship_Null_1";
        }
      }
      const cell = document.createElement("TD");
      cell.textContent = value;
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
};

/**
 * Asynchronously updates statistical data on the web page. Fetches counts of
 * actions, orders, employees, and devices from the Supabase database and updates
 * the respective HTML elements with these counts.
 */
const updateStats = async () => {
  // Update action taps
  let response = await db.from("action_tap_data").select();
  const actionCount = response.data.length;
  document.getElementById("action-tap-count").textContent = actionCount;

  // Update order stats
  response = await db.from("orders").select();
  const orderCount = response.data.length;
  document.getElementById("order-count").textContent = orderCount;

  // Update employee stats
  response = await db.from("employees").select();
  const employeeCount = response.data.length;
  document.getElementById("employee-count").textContent = employeeCount;

  // Update devices stats
  response = await db.from("devices").select();
  const totalDevices = response.data.length;
  let activeDevices = 0;
  for (const device of response.data) {
    if (device["allocated"]) {
      activeDevices += 1;
    }
  }
  document.getElementById("active-device-count").textContent = activeDevices;
  document.getElementById("offline-device-count").textContent =
    totalDevices - activeDevices;
};

/**
 * Controls database interactions based on the provided command. The function
 * dynamically calls other data loading functions based on the input command.
 *
 * @param {string} cmd - A command that determines which data to load and which
 *                       table to populate. Supported commands are 'la', 'lo',
 *                       'ld', and 'll'.
 */
const dbcntl = (cmd) => {
  switch (cmd) {
    case "la":
      loadActions(document.getElementById("actions-table"), TAP_DATA_LIMIT);
      break;
    case "lo":
      loadOrders(document.getElementById("orders-table"));
      break;
    case "ld":
      loadDevices(document.getElementById("devices-table"));
      break;
    case "ll":
      loadActions(document.getElementById("actions-table"), PREVIEW_LIMIT);
      break;
    case "us":
      updateStats();
      break;
  }
};

export { dbcntl };
