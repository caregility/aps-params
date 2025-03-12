import React, { useEffect, useRef } from "react";

import JSONEditor, { JSONEditorOptions } from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

interface JSONEditorWrapperProps {
    value: any;
    onChange: (value: any) => void;
    options?: JSONEditorOptions;
}

export const JSONEditorWrapper: React.FC<JSONEditorWrapperProps> = ({ value, onChange, options }) => {
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

            console.log("Initializing JSONEditor with value:", value);

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