"use client"; // for Next.js app directory or any React environment using "use client"

import React, { useState, useRef, useEffect } from "react";

/* ------------------------------------------------------------------
   1. DYNAMIC JSONEDITOR IMPORT
   ------------------------------------------------------------------ */

// We load JSONEditor dynamically to avoid SSR issues in Next.js.
import JSONEditor, { JSONEditorOptions } from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

interface JSONEditorWrapperProps {
  value: any;
  onChange: (value: any) => void;
  options?: JSONEditorOptions;
}

const JSONEditorWrapper: React.FC<JSONEditorWrapperProps> = ({ value, onChange, options }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<JSONEditor | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      // Instantiate the editor
      const defaultOptions: JSONEditorOptions = {
        mode: "tree",
        onChangeJSON: (updatedValue: any) => {
          onChange(updatedValue);
        },
        ...options,
      };

      editorRef.current = new JSONEditor(containerRef.current, defaultOptions, value);
    }

    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  // Update the editor if the external value changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.update(value);
    }
  }, [value]);

  return <div ref={containerRef} style={{ height: "600px", border: "1px solid #ccc" }} />;
};
/* ------------------------------------------------------------------
   2. SCHEMA INTERFACES
   ------------------------------------------------------------------ */

interface SchemaField {
  key: string;
  label: string;
  type: "text" | "number" | "dropdown" | "table";
  defaultValue?: any;
  options?: string[]; 
  columns?: SchemaField[]; // For nested table columns
  hideIf?: { field: string; equals: any };
  showIf?: { field: string; equals: any };
  prepopulateFrom?: string;
}

interface ClassSchema {
  id: string;         
  label: string;      
  fields?: SchemaField[];
  hasRecords? : boolean;
  subClasses?: ClassSchema[];
}

interface AllSchemas {
  classes: ClassSchema[];
}

/* ------------------------------------------------------------------
   3. DEFAULT SCHEMA (with "inputMappings" field)
   ------------------------------------------------------------------ */

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
   4. SCHEMA EDITOR (Using JSONEditor)
   ------------------------------------------------------------------ */

function SchemaEditor({
  schemaJSON,
  onSchemaChange
}: {
  schemaJSON: AllSchemas;
  onSchemaChange: (newSchema: AllSchemas) => void;
}) {

  // We can store the JSONEditor’s value in local state if desired,
  // or just rely on onChange events.
  const handleChange = (newValue: any) => {
    onSchemaChange(newValue as AllSchemas);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">Schema Editor</h2>
      <p className="mb-2 text-sm text-black">
        Use the interface below to edit the schema for the supported APS params.  This will serve as the basis for the records available in the data editor.
      </p>

      {/* JSONEditorComponent */}
      <div style={{ height: 600, border: "1px solid #ccc" }}>
        <JSONEditorWrapper
          value={schemaJSON}
          onChange={(newValue) => handleChange(newValue)}
          options={{
            mode: "tree"
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   5. RECURSIVE TABLE RENDERING FOR "DATA EDITOR"
   ------------------------------------------------------------------ */

// A generic record is just an object.
interface GenericRecord {
  [key: string]: any;
}
// Helper function to remove keys from a row that do not meet the conditions.
const cleanRow = (row: GenericRecord, columns: SchemaField[]): GenericRecord => {
  // Start with a shallow copy of the row.
  const cleanedRow = { ...row };
  columns.forEach((col) => {
    // If hideIf condition is met, remove the key.
    if (col.hideIf && cleanedRow[col.hideIf.field] === col.hideIf.equals) {
      delete cleanedRow[col.key];
    }
    // If showIf condition exists and is not met, remove the key.
    if (col.showIf && cleanedRow[col.showIf.field] !== col.showIf.equals) {
      delete cleanedRow[col.key];
    }
  });
  return cleanedRow;
};

function FieldRenderer({
  field,
  value,
  onChange
}: {
  field: SchemaField;
  value: any;
  onChange: (newVal: any) => void;
}) {
  if (field.type === "text") {
    return (
      <input
        type="text"
        value={value || ""}
        className="p-1 border rounded w-full"
        onChange={(e) => onChange(e.target.value)}
      />
    );
  } else if (field.type === "number") {
    return (
      <input
        type="number"
        value={value || 0}
        className="p-1 border rounded w-full"
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    );
  } else if (field.type === "dropdown") {
    return (
      <select
        className="p-1 border rounded w-full"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">--Select--</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "table" && field.columns) {
    // For table fields, value is expected to be an array of rows.
    const rows = Array.isArray(value) ? value : [];

    // Create a new row with default empty values.
    const addRow = () => {
      let newRow: GenericRecord = {};
      field.columns!.forEach((col) => {
        newRow[col.key] = "";
      });
      // Clean the row before adding it.
      newRow = cleanRow(newRow, field.columns!);
      onChange([...rows, newRow]);
    };

    // Update a specific cell.
    const updateRowField = (rowIndex: number, colKey: string, newVal: any) => {
      const updated = [...rows];
      updated[rowIndex] = { ...updated[rowIndex], [colKey]: newVal };
      // Clean the entire row based on the column conditions.
      updated[rowIndex] = cleanRow(updated[rowIndex], field.columns!);
      onChange(updated);
    };

    // Remove an entire row.
    const removeRow = (rowIndex: number) => {
      const updated = [...rows];
      updated.splice(rowIndex, 1);
      onChange(updated);
    };

    return (
      <div className="border p-2 rounded">
        <button
          className="mb-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
          onClick={addRow}
        >
          + Add Row
        </button>
        {rows.length > 0 ? (
          <table className="w-full border text-sm">
            <thead>
              <tr>
                {/* Render header for every column in the schema */}
                {field.columns!.map((col) => (
                  <th key={col.key} className="border p-1">
                    {col.label}
                  </th>
                ))}
                <th className="border p-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {field.columns!.map((col) => {
                    // Determine whether to render content for this cell.
                    const shouldRender =
                      !(
                        col.hideIf &&
                        row[col.hideIf.field] === col.hideIf.equals
                      ) &&
                      !(
                        col.showIf &&
                        row[col.showIf.field] !== col.showIf.equals
                      );
                    return (
                      <td key={col.key} className="border p-1">
                        {shouldRender ? (
                          <FieldRenderer
                            field={col}
                            value={row[col.key]}
                            onChange={(val) =>
                              updateRowField(rowIdx, col.key, val)
                            }
                          />
                        ) : null}
                      </td>
                    );
                  })}
                  {/* Render the remove button in its own dedicated cell */}
                  <td className="border p-1">
                    <button
                      onClick={() => removeRow(rowIdx)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm">No rows. Click “+ Add Row”.</div>
        )}
      </div>
    );
  }
  // Default fallback for unsupported field types.
  return <span className="text-gray-500">[Unsupported field type]</span>;
}



/* ------------------------------------------------------------------
   6. DATA EDITOR
   ------------------------------------------------------------------ */
function DataEditor({ schemaJSON }: { schemaJSON: AllSchemas }) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubclassPath, setSelectedSubclassPath] = useState<string[]>([]);
  const [records, setRecords] = useState<{ [classId: string]: GenericRecord[] }>({});

  // Find the top-level class schema.
  const chosenClassSchema = schemaJSON.classes.find((cls) => cls.id === selectedClassId);

  // Determine the active schema by iterating through subclass selections.
  let activeSchema: ClassSchema | undefined = chosenClassSchema;
  if (activeSchema && activeSchema.subClasses) {
    for (let level = 0; level < selectedSubclassPath.length; level++) {
      activeSchema = activeSchema.subClasses?.find(
        (sub) => sub.id === selectedSubclassPath[level]
      );
      if (!activeSchema) break;
    }
  }

  const activeClassId = activeSchema?.id;
  const currentRecords = activeClassId ? records[activeClassId] || [] : [];

  const handleTopLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value || null;
    setSelectedClassId(newId);
    setSelectedSubclassPath([]);
  };

  const handleSubclassChange = (level: number, value: string) => {
    const updatedPath = [...selectedSubclassPath];
    updatedPath[level] = value;
    updatedPath.splice(level + 1);
    setSelectedSubclassPath(updatedPath);
  };

  const handleClear = (level: number) => {
    // Clears from this level downward
    setSelectedSubclassPath(selectedSubclassPath.slice(0, level - 1));
  };

  const renderSubclassDropdowns = () => {
    const dropdowns = [];
    let currentSchema = chosenClassSchema;
    let level = 0;
    while (currentSchema && currentSchema.subClasses && currentSchema.subClasses.length > 0) {
      const selectedId = selectedSubclassPath[level] || "";
      dropdowns.push(
        <div key={level} className="mb-2 flex items-center">
          <div className="flex-1">
            <label className="block mb-1 text-black font-semibold">
              Select Sub-Class:
            </label>
            <select
              className="p-1 border rounded w-full text-black"
              value={selectedId}
              onChange={(e) => handleSubclassChange(level, e.target.value)}
            >
              <option value="">-- Choose an Option --</option>
              {currentSchema.subClasses.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.label} ({sub.id})
                </option>
              ))}
            </select>
          </div>
          {selectedId && (
            <button
              onClick={() => handleClear(level)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      );
      if (!selectedId) break;
      currentSchema = currentSchema.subClasses.find((sub) => sub.id === selectedId);
      level++;
    }
    return dropdowns;
  };

  // Record management
  const addRecord = () => {
    if (!activeClassId || !activeSchema) return;
    const newRec: GenericRecord = {};
    activeSchema.fields?.forEach((f) => {
      if (f.type === "table") {
        if (f.prepopulateFrom) {
          // Find the column to prepopulate from.
          const targetCol = f.columns?.find((col) => col.key === f.prepopulateFrom);
          if (targetCol && targetCol.options && targetCol.options.length > 0) {
            newRec[f.key] = targetCol.options.map((opt) => {
              const row: GenericRecord = {};
              f.columns?.forEach((col) => {
                row[col.key] = "";
              });
              // Set the specified column to the option.
              if (f.prepopulateFrom) {
                row[f.prepopulateFrom] = opt;
              }
              // Clean the row based on conditions.
              return cleanRow(row, f.columns!);
            });
          } else {
            newRec[f.key] = [];
          }
        } else {
          newRec[f.key] = [];
        }
      } else {
        newRec[f.key] = f.defaultValue !== undefined ? f.defaultValue : "";
      }
    });
    
    setRecords((prev) => {
      const updatedList = prev[activeClassId]
        ? [...prev[activeClassId], newRec]
        : [newRec];
      return { ...prev, [activeClassId]: updatedList };
    });
  };


  const updateRecordField = (recordIndex: number, field: SchemaField, newVal: any) => {
    if (!activeClassId) return;
    setRecords((prev) => {
      const updatedList = [...(prev[activeClassId] || [])];
      updatedList[recordIndex] = { ...updatedList[recordIndex], [field.key]: newVal };
      return { ...prev, [activeClassId]: updatedList };
    });
  };

  const removeRecord = (recordIndex: number) => {
    if (!activeClassId) return;
    setRecords((prev) => {
      const updatedList = [...(prev[activeClassId] || [])];
      updatedList.splice(recordIndex, 1);
      return { ...prev, [activeClassId]: updatedList };
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">Data Editor</h2>
      {/* Top-level class selection */}
      <label className="block mb-2 text-black font-semibold">Select Class:</label>
      <select
        className="p-1 border rounded mb-4 text-black"
        value={selectedClassId || ""}
        onChange={handleTopLevelChange}
      >
        <option value="">-- Choose a Class --</option>
        {schemaJSON.classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.label} ({cls.id})
          </option>
        ))}
      </select>

      {/* Render nested subclass dropdowns */}
      {chosenClassSchema && renderSubclassDropdowns()}

      {/* Render record table for the active schema */}
      {activeClassId && activeSchema && activeSchema.hasRecords !== false && (
        <div className="mb-4 border p-4 rounded bg-white text-black">
          <h3 className="text-md font-semibold mb-2">
            {`Records for ${activeSchema.label}`}
          </h3>
          <button onClick={addRecord} className="mb-2 px-3 py-1 bg-green-500 text-white rounded">
            + Add Record
          </button>
          {currentRecords.length > 0 ? (
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  {activeSchema.fields?.map((f) => (
                    <th key={f.key} className="border p-2">
                      {f.label} ({f.key})
                    </th>
                  ))}
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((rec, rIdx) => (
                  <tr key={rIdx}>
                    {activeSchema.fields?.map((f) => (
                      <td key={f.key} className="border p-2 align-top">
                        <FieldRenderer
                          field={f}
                          value={rec[f.key]}
                          onChange={(val) => updateRecordField(rIdx, f, val)}
                        />
                      </td>
                    ))}
                    <td className="border p-2">
                      <button
                        onClick={() => removeRecord(rIdx)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-600">No records yet. Click “+ Add Record”.</div>
          )}
        </div>
      )}
      {/* Full records JSON */}
      <div className="mt-8 bg-gray-800 text-green-300 p-4 rounded">
        <h3 className="text-lg font-bold mb-2">Current JSON Data</h3>
        <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(records, null, 2)}</pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   7. MAIN PAGE WITH TABS
   ------------------------------------------------------------------ */
export default function Home() {
  const [activeTab, setActiveTab] = useState<"schemaEditor" | "dataEditor">("schemaEditor");
  const [schemaJSON, setSchemaJSON] = useState<AllSchemas>(defaultSchemaJSON);

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
