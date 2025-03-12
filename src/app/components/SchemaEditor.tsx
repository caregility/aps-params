import React from "react";

import { AllSchemas } from "../types";

import { JSONEditorWrapper } from "./JSONEditorWrapper";
/* ------------------------------------------------------------------
   4. SCHEMA EDITOR (Using JSONEditor)
   ------------------------------------------------------------------ */

export function SchemaEditor({
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