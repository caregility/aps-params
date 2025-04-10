"use client";

import React, { useState, useEffect } from "react";
import { DataEditor } from "./components/DataEditor";
import { SchemaEditor } from "./components/SchemaEditor";
import { AllSchemas } from "./types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"schemaEditor" | "dataEditor">("schemaEditor");
  const [schemaJSON, setSchemaJSON] = useState<AllSchemas | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load the schema JSON from the backend once on mount
  useEffect(() => {
    setSchemaJSON({
      "classes": [
        {
          "id": "tvSwitching",
          "label": "TV Switching",
          "hasRecords": false,
          "subClasses": [
            {
              "id": "manufacturer",
              "label": "Manufacturer",
              "fields": [
                {
                  "key": "id",
                  "label": "ID",
                  "type": "text"
                },
                {
                  "key": "name",
                  "label": "Name",
                  "type": "text"
                },
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
                        "TOGGLE_POWER",
                        "MUTE_ON",
                        "MUTE_OFF",
                        "TOGGLE_MUTE",
                        "SELECT_INPUT",
                        "REMOTE_CONTROL_STATUS",
                        "REMOTE_CONTROL_ON",
                        "REMOTE_CONTROL_OFF",
                        "RESET",
                        "REBOOT",
                        "FIRMWARE_VERSION"
                      ]
                    },
                    {
                      "key": "code",
                      "label": "Code",
                      "type": "text",
                      "hideIf": {
                        "field": "command",
                        "equals": "SELECT_INPUT"
                      }
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
                      "showIf": {
                        "field": "command",
                        "equals": "SELECT_INPUT"
                      },
                      "columns": [
                        {
                          "key": "input",
                          "label": "Input",
                          "type": "text"
                        },
                        {
                          "key": "code",
                          "label": "Code",
                          "type": "text"
                        }
                      ]
                    }
                  ]
                }
              ],
              "subClasses": [
                {
                  "id": "model",
                  "label": "Model",
                  "fields": [
                    {
                      "key": "id",
                      "label": "Model ID",
                      "type": "text"
                    },
                    {
                      "key": "name",
                      "label": "Model Name",
                      "type": "text"
                    },
                    {
                      "key": "commands",
                      "label": "Commands",
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
                          "hideIf": {
                            "field": "command",
                            "equals": "SELECT_INPUT"
                          }
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
                          "showIf": {
                            "field": "command",
                            "equals": "SELECT_INPUT"
                          },
                          "columns": [
                            {
                              "key": "input",
                              "label": "Input",
                              "type": "text"
                            },
                            {
                              "key": "code",
                              "label": "Code",
                              "type": "text"
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
        }
      ]
    });

    setLoading(false);
  }, []);

  if (loading || !schemaJSON) {
    return <div>Loading schema...</div>;
  }

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
