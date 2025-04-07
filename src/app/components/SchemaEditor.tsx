"use client";

import React, { useState } from "react";
import { AllSchemas } from "../types";
import { JSONEditorWrapper } from "./JSONEditorWrapper";

type SchemaEditorProps = {
    schemaJSON: AllSchemas;
    onSchemaChange: (newSchema: AllSchemas) => void;
};

export function SchemaEditor({ schemaJSON, onSchemaChange }: SchemaEditorProps) {
    const [saveMessage, setSaveMessage] = useState<string>("");

    const handleChange = (newValue: any) => {
        onSchemaChange(newValue as AllSchemas);
    };

    const handleSave = () => {

    };

    if (!schemaJSON) {
        return <div>Loading schema...</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-black">Schema Editor</h2>
            <p className="mb-2 text-sm text-black">
                Use the interface below to edit the schema for the supported APS params.
            </p>
            <div style={{ height: 600, border: "1px solid #ccc" }}>
                <JSONEditorWrapper
                    value={schemaJSON}
                    onChange={(newValue) => handleChange(newValue)}
                    options={{ mode: "tree" }}
                />
            </div>
            <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                Save Schema
            </button>
            {saveMessage && <div className="mt-2 text-green-600">{saveMessage}</div>}
        </div>
    );
}
