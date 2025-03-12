
import React from "react";

import { SchemaField, GenericRecord } from "../types";

// Helper function to remove keys from a row that do not meet the conditions.
export const cleanRow = (row: GenericRecord, columns: SchemaField[]): GenericRecord => {
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

export function FieldRenderer({
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