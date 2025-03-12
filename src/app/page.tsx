"use client";

import React, { useState } from "react";

import { DataEditor } from "./components/DataEditor";
import { SchemaEditor } from "./components/SchemaEditor";

import { AllSchemas } from "./types";

const defaultSchemaJSON: AllSchemas = {
  classes: [
    {
      id: "tvSwitching",
      label: "TV Switching",
      hasRecords: false,
      subClasses: [
        {
          id: "manufacturer",
          label: "Manufacturer",
          fields: [
            { key: "id", label: "ID", type: "text" },
            { key: "name", label: "Name", type: "text" },
            {
              "key": "standardCommands",
              "label": "Standard Commands",
              "type": "table",
              "prepopulateFrom": "command",
              "columns": [
                {
                  "key": "command",
                  "label": "Command",
                  "type": "dropdown",
                  "options": [
                    "POWER_STATUS",
                    "POWER_ON",
                    "POWER_OFF",
                    "TOGGLE_MUTE",
                    "MUTE_ON",
                    "MUTE_OFF",
                    "SELECT_INPUT",
                    "TOGGLE_POWER",
                    "RESET",
                    "REBOOT",
                    "FIRMWARE_VERSION"
                  ]
                },
                {
                  "key": "code",
                  "label": "Code",
                  "type": "text",
                  "hideIf": { "field": "command", "equals": "SELECT_INPUT" }
                },
                {
                  "key": "responseTimeout",
                  "label": "Response Timeout",
                  "type": "number"
                },
                {
                  "key": "continueTimeout",
                  "label": "Continue Timeout",
                  "type": "number"
                },
                {
                  "key": "inputMappings",
                  "label": "Input Mappings",
                  "type": "table",
                  "showIf": { "field": "command", "equals": "SELECT_INPUT" },
                  "columns": [
                    { "key": "input", "label": "Input", "type": "text" },
                    { "key": "code", "label": "Code", "type": "text" }
                  ]
                }
              ]
            }
          ],
          subClasses: [
            {
              id: "model",
              label: "Model",
              fields: [
                { key: "modelId", label: "Model ID", type: "text" },
                { key: "modelName", label: "Model Name", type: "text" },
                {
                  key: "commands",
                  label: "Commands",
                  type: "table",
                  prepopulateFrom: "command",
                  columns: [
                    {
                      key: "command",
                      label: "Command",
                      type: "dropdown",
                      options: [
                        "POWER_STATUS",
                        "POWER_ON",
                        "POWER_OFF",
                        "TOGGLE_MUTE",
                        "MUTE_ON",
                        "MUTE_OFF",
                        "SELECT_INPUT",
                        "TOGGLE_POWER",
                        "RESET",
                        "REBOOT",
                        "FIRMWARE_VERSION"
                      ]
                    },
                    {
                      key: "code",
                      label: "Code",
                      type: "text",
                      hideIf: { "field": "command", "equals": "SELECT_INPUT" }
                    },
                    {
                      key: "responseTimeout",
                      label: "Response Timeout",
                      type: "number"
                    },
                    {
                      key: "continueTimeout",
                      label: "Continue Timeout",
                      type: "number"
                    },
                    {
                      // Same "inputMappings" sub-table for the sub-commands
                      key: "inputMappings",
                      label: "Input Mappings",
                      showIf: { "field": "command", "equals": "SELECT_INPUT" },
                      type: "table",
                      columns: [
                        { key: "input", label: "Input", type: "text" },
                        { key: "code", label: "Code", type: "text" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

/* ------------------------------------------------------------------
   7. MAIN PAGE WITH TABS
   ------------------------------------------------------------------ */
export default function Home() {
  const [activeTab, setActiveTab] = useState<"schemaEditor" | "dataEditor">("schemaEditor");
  const [schemaJSON, setSchemaJSON] = useState<AllSchemas>(defaultSchemaJSON);
  console.log("Current Schema JSON:", schemaJSON);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl text-black font-bold mb-6">Management Interface</h1>
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setActiveTab("dataEditor")}
          className={
            activeTab === "dataEditor"
              ? "bg-blue-600 text-white px-4 py-2 rounded"
              : "bg-gray-300 px-4 py-2 rounded"
          }
        >
          Data Editor
        </button>
        <button
          onClick={() => setActiveTab("schemaEditor")}
          className={
            activeTab === "schemaEditor"
              ? "bg-blue-600 text-white px-4 py-2 rounded"
              : "bg-gray-300 px-4 py-2 rounded"
          }
        >
          Schema Editor
        </button>
      </div>

      {activeTab === "dataEditor" && <DataEditor schemaJSON={schemaJSON} />}
      {activeTab === "schemaEditor" && (
        <SchemaEditor schemaJSON={schemaJSON} onSchemaChange={setSchemaJSON} />
      )}
    </div>
  );
}
