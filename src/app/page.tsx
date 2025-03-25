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
    fetch("http://localhost:5000/api/schema")
      .then((res) => res.json())
      .then((data) => {
        setSchemaJSON(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading schema:", error);
        setLoading(false);
      });
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
