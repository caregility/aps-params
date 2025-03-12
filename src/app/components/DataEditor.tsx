import React, { useState } from "react";

import { AllSchemas, ClassSchema, GenericRecord, SchemaField } from "../types";

import { FieldRenderer, cleanRow } from "./FieldRenderer";

/* ------------------------------------------------------------------
   6. DATA EDITOR
   ------------------------------------------------------------------ */
export function DataEditor({ schemaJSON }: { schemaJSON: AllSchemas }) {
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