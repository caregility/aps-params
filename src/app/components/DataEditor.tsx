"use client";

import React, { useState, useEffect } from "react";
import { AllSchemas, ClassSchema, GenericRecord } from "../types";
import { FieldRenderer } from "./FieldRenderer";

/**
 * DataEditor without manual "Select Sub-Class" dropdowns.
 * For each subClass in the chain, a "Select Record" dropdown is automatically shown.
 * Then, forms are displayed for whichever subClasses have a selected record.
 * The Save button is only visible when at least one record is open.
 */
export function DataEditor({ schemaJSON }: { schemaJSON: AllSchemas }) {
    // The user picks a class (e.g. "tvSwitching")
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    // For each subClass in the chain, we store the selected record's "id"
    // e.g. subClassChain[0] = "manufacturer" => selectedRecordIds[0] = "samsung"
    //      subClassChain[1] = "model"        => selectedRecordIds[1] = "SAM_MODEL_001"
    const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);

    // The full records JSON from the backend
    const [recordsData, setRecordsData] = useState<any>(null);

    // Load records on mount
    useEffect(() => {
        setRecordsData({
            "classes": [
                {
                    "id": "tvSwitching",
                    "subClasses": [
                        {
                            "id": "manufacturer",
                            "instances": [
                                {
                                    "id": "pdi",
                                    "name": "PDi",
                                    "standardCommands": [
                                        {
                                            "command": "POWER_STATUS",
                                            "code": "10021200121003",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 3000
                                        },
                                        {
                                            "command": "POWER_ON",
                                            "code": "1002010100021003",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 3000
                                        },
                                        {
                                            "command": "POWER_OFF",
                                            "code": "1002010000011003",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 3000
                                        },
                                        {
                                            "command": "TOGGLE_MUTE",
                                            "code": "1002040300071003",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 2000
                                        },
                                        {
                                            "command": "SELECT_INPUT",
                                            "code": "",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 3000,
                                            "inputMappings": [
                                                {
                                                    "input": "hdmi1",
                                                    "code": "10021D000900261003"
                                                },
                                                {
                                                    "input": "hdmi2",
                                                    "code": "10021D000D002A1003"
                                                },
                                                {
                                                    "input": "hdmi3",
                                                    "code": "10021D001600331003"
                                                },
                                                {
                                                    "input": "hdmi4",
                                                    "code": "10021D001700341003"
                                                },
                                                {
                                                    "input": "component1",
                                                    "code": "10021D000700231003"
                                                },
                                                {
                                                    "input": "av1",
                                                    "code": "10021D000400201003"
                                                },
                                                {
                                                    "input": "pcmode",
                                                    "code": "10021D000A00271003"
                                                },
                                                {
                                                    "input": "dvi",
                                                    "code": "10021D000B00281003"
                                                }
                                            ]
                                        },
                                        {
                                            "command": "REMOTE_CONTROL_ON",
                                            "code": "10020A02FF01010C1003",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 2000
                                        },
                                        {
                                            "command": "REMOTE_CONTROL_OFF",
                                            "code": "10020A02FF02010D1003",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 2000
                                        }
                                    ],
                                    "model": [
                                        {
                                            "id": "PDI_MODEL_GENERIC",
                                            "name": "Generic PDi TV",
                                            "commands": []
                                        }
                                    ]
                                },
                                {
                                    "id": "samsung",
                                    "name": "Samsung",
                                    "standardCommands": [
                                        {
                                            "command": "POWER_STATUS",
                                            "code": "0822F0000000AA",
                                            "responseTimeout": 4500,
                                            "continueTimeout": 3000
                                        },
                                        {
                                            "command": "POWER_ON",
                                            "code": "082200000002BB",
                                            "responseTimeout": 5000,
                                            "continueTimeout": 3000
                                        },
                                        {
                                            "command": "POWER_OFF",
                                            "code": "082200000001CC",
                                            "responseTimeout": 9000,
                                            "continueTimeout": 3000
                                        },
                                        {
                                            "command": "TOGGLE_MUTE",
                                            "code": "082202000000DD",
                                            "responseTimeout": 2000,
                                            "continueTimeout": 3000
                                        },
                                        {
                                            "command": "SELECT_INPUT",
                                            "code": "",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 3000,
                                            "inputMappings": [
                                                {
                                                    "input": "tv",
                                                    "code": "08220A000000EE"
                                                },
                                                {
                                                    "input": "av1",
                                                    "code": "08220A000100EF"
                                                },
                                                {
                                                    "input": "av2",
                                                    "code": "08220A000101F0"
                                                },
                                                {
                                                    "input": "av3",
                                                    "code": "08220A000102F1"
                                                },
                                                {
                                                    "input": "svid1",
                                                    "code": "08220A000200F2"
                                                },
                                                {
                                                    "input": "svid2",
                                                    "code": "08220A000201F3"
                                                },
                                                {
                                                    "input": "svid3",
                                                    "code": "08220A000202F4"
                                                },
                                                {
                                                    "input": "component1",
                                                    "code": "08220A000300F5"
                                                },
                                                {
                                                    "input": "component2",
                                                    "code": "08220A000301F6"
                                                },
                                                {
                                                    "input": "component3",
                                                    "code": "08220A000302F7"
                                                },
                                                {
                                                    "input": "pcmode1",
                                                    "code": "08220A000400F8"
                                                },
                                                {
                                                    "input": "pcmode2",
                                                    "code": "08220A000401F9"
                                                },
                                                {
                                                    "input": "pcmode3",
                                                    "code": "08220A000402FA"
                                                },
                                                {
                                                    "input": "dvi1",
                                                    "code": "08220A000600FB"
                                                },
                                                {
                                                    "input": "dvi2",
                                                    "code": "08220A000601FC"
                                                },
                                                {
                                                    "input": "dvi3",
                                                    "code": "08220A000602FD"
                                                },
                                                {
                                                    "input": "hdmi1",
                                                    "code": "08220A000500EE"
                                                },
                                                {
                                                    "input": "hdmi2",
                                                    "code": "08220A000501EE"
                                                },
                                                {
                                                    "input": "hdmi3",
                                                    "code": "08220A000502EE"
                                                },
                                                {
                                                    "input": "hdmi4",
                                                    "code": "08220A000503EE"
                                                }
                                            ]
                                        }
                                    ],
                                    "model": [
                                        {
                                            "id": "SAM_MODEL_001",
                                            "name": "Samsung Model One",
                                            "commands": [
                                                {
                                                    "command": "POWER_STATUS",
                                                    "code": "0822F0000000AA",
                                                    "responseTimeout": 4500,
                                                    "continueTimeout": 3000
                                                },
                                                {
                                                    "command": "SELECT_INPUT",
                                                    "code": "",
                                                    "responseTimeout": 3000,
                                                    "continueTimeout": 3000,
                                                    "inputMappings": [
                                                        {
                                                            "input": "tv",
                                                            "code": "08220A000000EE"
                                                        },
                                                        {
                                                            "input": "av1",
                                                            "code": "08220A000100EF"
                                                        },
                                                        {
                                                            "input": "av2",
                                                            "code": "08220A000101F0"
                                                        },
                                                        {
                                                            "input": "av3",
                                                            "code": "08220A000102F1"
                                                        },
                                                        {
                                                            "input": "svid1",
                                                            "code": "08220A000200F2"
                                                        },
                                                        {
                                                            "input": "svid2",
                                                            "code": "08220A000201F3"
                                                        },
                                                        {
                                                            "input": "svid3",
                                                            "code": "08220A000202F4"
                                                        },
                                                        {
                                                            "input": "component1",
                                                            "code": "08220A000300F5"
                                                        },
                                                        {
                                                            "input": "component2",
                                                            "code": "08220A000301F6"
                                                        },
                                                        {
                                                            "input": "component3",
                                                            "code": "08220A000302F7"
                                                        },
                                                        {
                                                            "input": "pcmode1",
                                                            "code": "08220A000400F8"
                                                        },
                                                        {
                                                            "input": "pcmode2",
                                                            "code": "08220A000401F9"
                                                        },
                                                        {
                                                            "input": "pcmode3",
                                                            "code": "08220A000402FA"
                                                        },
                                                        {
                                                            "input": "dvi1",
                                                            "code": "08220A000600FB"
                                                        },
                                                        {
                                                            "input": "dvi2",
                                                            "code": "08220A000601FC"
                                                        },
                                                        {
                                                            "input": "dvi3",
                                                            "code": "08220A000602FD"
                                                        },
                                                        {
                                                            "input": "hdmi1",
                                                            "code": "08220A000500EE"
                                                        },
                                                        {
                                                            "input": "hdmi2",
                                                            "code": "08220A000501EE"
                                                        },
                                                        {
                                                            "input": "hdmi3",
                                                            "code": "08220A000502EE"
                                                        },
                                                        {
                                                            "input": "hdmi4",
                                                            "code": "08220A000503EE"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "id": "lg",
                                    "name": "LG",
                                    "standardCommands": [
                                        {
                                            "command": "POWER_STATUS",
                                            "code": "ka 00 FF",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 4500
                                        },
                                        {
                                            "command": "POWER_ON",
                                            "code": "ka 01 01",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 5000
                                        },
                                        {
                                            "command": "POWER_OFF",
                                            "code": "ka 01 00",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 5000
                                        },
                                        {
                                            "command": "MUTE_ON",
                                            "code": "ke 01 00",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 2000
                                        },
                                        {
                                            "command": "MUTE_OFF",
                                            "code": "ke 01 01",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 2000
                                        },
                                        {
                                            "command": "SELECT_INPUT",
                                            "code": "",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 3000,
                                            "inputMappings": [
                                                {
                                                    "input": "dtv",
                                                    "code": "xb 01 00"
                                                },
                                                {
                                                    "input": "cadtv",
                                                    "code": "xb 01 01"
                                                },
                                                {
                                                    "input": "satellitedtv",
                                                    "code": "xb 01 02"
                                                },
                                                {
                                                    "input": "atv",
                                                    "code": "xb 01 10"
                                                },
                                                {
                                                    "input": "catv",
                                                    "code": "xb 01 11"
                                                },
                                                {
                                                    "input": "av1",
                                                    "code": "xb 01 20"
                                                },
                                                {
                                                    "input": "av2",
                                                    "code": "xb 01 21"
                                                },
                                                {
                                                    "input": "component1",
                                                    "code": "xb 01 40"
                                                },
                                                {
                                                    "input": "component2",
                                                    "code": "xb 01 41"
                                                },
                                                {
                                                    "input": "rgb",
                                                    "code": "xb 01 60"
                                                },
                                                {
                                                    "input": "hdmi1",
                                                    "code": "xb 01 90"
                                                },
                                                {
                                                    "input": "hdmi2",
                                                    "code": "xb 01 91"
                                                },
                                                {
                                                    "input": "hdmi3",
                                                    "code": "xb 01 92"
                                                },
                                                {
                                                    "input": "hdmi4",
                                                    "code": "xb 01 93"
                                                }
                                            ]
                                        },
                                        {
                                            "command": "REMOTE_CONTROL_OFF",
                                            "code": "km 01 00",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 2000
                                        },
                                        {
                                            "command": "REMOTE_CONTROL_ON",
                                            "code": "km 01 01",
                                            "responseTimeout": 3000,
                                            "continueTimeout": 2000
                                        }
                                    ],
                                    "model": [
                                        {
                                            "id": "LG_MODEL_001",
                                            "name": "LG Model One",
                                            "commands": [
                                                {
                                                    "command": "POWER_STATUS",
                                                    "code": "ka 00 FF",
                                                    "responseTimeout": 3000,
                                                    "continueTimeout": 4500
                                                },
                                                {
                                                    "command": "SELECT_INPUT",
                                                    "code": "",
                                                    "responseTimeout": 3000,
                                                    "continueTimeout": 3000,
                                                    "inputMappings": [
                                                        {
                                                            "input": "dtv",
                                                            "code": "xb 01 00"
                                                        },
                                                        {
                                                            "input": "cadtv",
                                                            "code": "xb 01 01"
                                                        },
                                                        {
                                                            "input": "satellitedtv",
                                                            "code": "xb 01 02"
                                                        },
                                                        {
                                                            "input": "atv",
                                                            "code": "xb 01 10"
                                                        },
                                                        {
                                                            "input": "catv",
                                                            "code": "xb 01 11"
                                                        },
                                                        {
                                                            "input": "av1",
                                                            "code": "xb 01 20"
                                                        },
                                                        {
                                                            "input": "av2",
                                                            "code": "xb 01 21"
                                                        },
                                                        {
                                                            "input": "component1",
                                                            "code": "xb 01 40"
                                                        },
                                                        {
                                                            "input": "component2",
                                                            "code": "xb 01 41"
                                                        },
                                                        {
                                                            "input": "rgb",
                                                            "code": "xb 01 60"
                                                        },
                                                        {
                                                            "input": "hdmi1",
                                                            "code": "xb 01 90"
                                                        },
                                                        {
                                                            "input": "hdmi2",
                                                            "code": "xb 01 91"
                                                        },
                                                        {
                                                            "input": "hdmi3",
                                                            "code": "xb 01 92"
                                                        },
                                                        {
                                                            "input": "hdmi4",
                                                            "code": "xb 01 93"
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
    }, []);

    /**
     * Find the selected class in the schema.
     */
    const getSelectedClassSchema = (): ClassSchema | undefined => {
        if (!selectedClassId) return undefined;
        return schemaJSON.classes.find((c) => c.id === selectedClassId);
    };

    /**
     * Build a "chain" of subClasses in order.
     * For example, for tvSwitching, it might return [manufacturerSchema, modelSchema].
     * This assumes a single chain of nested subClasses.
     */
    const getSubClassChain = (): ClassSchema[] => {
        const chain: ClassSchema[] = [];
        let current = getSelectedClassSchema();
        while (current?.subClasses && current.subClasses.length > 0) {
            // We assume there's exactly one subClass at each level
            const firstSub = current.subClasses[0];
            chain.push(firstSub);
            current = firstSub; // move deeper
        }
        return chain;
    };

    /**
     * For a given subClass and the parent's selected record (if any),
     * return the array of available instances for this subClass.
     */
    const getAvailableInstances = (
        subClassIndex: number,
        chain: ClassSchema[]
    ): GenericRecord[] => {
        if (!recordsData || !selectedClassId) return [];

        const topLevelClass = recordsData.classes.find((c: any) => c.id === selectedClassId);
        if (!topLevelClass) return [];

        const subSchema = chain[subClassIndex];
        if (!subSchema) return [];

        if (subClassIndex === 0) {
            // For the first subClass, read from the class's subClasses
            const subClassRecord = topLevelClass.subClasses.find((sc: any) => sc.id === subSchema.id);
            if (!subClassRecord) return [];
            return subClassRecord.instances || [];
        } else {
            // For deeper levels, get the parent's selected record and then its sub-array.
            const parentSchema = chain[subClassIndex - 1];
            const parentSelectedId = selectedRecordIds[subClassIndex - 1];
            if (!parentSelectedId) return [];
            const parentInstances = getAvailableInstances(subClassIndex - 1, chain);
            const parentRecord = parentInstances.find((inst) => inst.id === parentSelectedId);
            if (!parentRecord) return [];
            return parentRecord[subSchema.id] || [];
        }
    };

    /**
     * Handle when the user picks a record for a particular subClass in the chain.
     */
    const handleRecordChange = (subClassIndex: number, newId: string) => {
        const updated = [...selectedRecordIds];
        updated[subClassIndex] = newId;
        // Clear out deeper selections
        updated.splice(subClassIndex + 1);
        setSelectedRecordIds(updated);
    };

    /**
     * Renders a dropdown for each subClass in the chain, labeled by the subClass id.
     */
    const renderSubClassDropdowns = () => {
        const chain = getSubClassChain();
        return chain.map((subSchema, idx) => {
            const instances = getAvailableInstances(idx, chain);
            const selectedId = selectedRecordIds[idx] || "";
            return (
                <div key={subSchema.id} className="mb-2 flex items-center">
                    <div className="flex-1">
                        <label className="block mb-1 text-black font-semibold">
                            {`Select Record for "${subSchema.id}"`}
                        </label>
                        <select
                            className="p-1 border rounded w-full text-black"
                            value={selectedId}
                            onChange={(e) => handleRecordChange(idx, e.target.value)}
                        >
                            <option value="">-- Choose a Record --</option>
                            {instances.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.name || inst.id}
                                </option>
                            ))}
                            <option value="new">+ New Record</option>
                        </select>
                    </div>
                </div>
            );
        });
    };

    /**
     * Renders a form for each subClass that has a selected record.
     */
    const renderForms = () => {
        const chain = getSubClassChain();
        return chain.map((subSchema, idx) => {
            const selectedId = selectedRecordIds[idx];
            if (!selectedId || selectedId === "new") {
                // Skip rendering if nothing is selected or if "new" is chosen.
                return null;
            }
            const instances = getAvailableInstances(idx, chain);
            const record = instances.find((inst) => inst.id === selectedId);
            if (!record) return null;
            return (
                <div key={subSchema.id} className="mb-4 border p-4 rounded bg-white text-black">
                    <h3 className="text-md font-semibold mb-2">Editing Record for “{subSchema.label}”</h3>
                    {subSchema.fields?.map((field) => (
                        <div key={field.key} className="mb-2">
                            <label className="block text-black">{field.label}:</label>
                            <FieldRenderer
                                field={field}
                                value={record[field.key]}
                                onChange={(val) => {
                                    record[field.key] = val;
                                    // Force re-render by updating state
                                    setRecordsData({ ...recordsData });
                                }}
                            />
                        </div>
                    ))}
                </div>
            );
        });
    };

    /**
     * Handle saving the entire records data by posting it to the backend.
     */
    const handleSave = () => {
        if (!recordsData || !selectedClassId) return;
        fetch("http://localhost:5000/api/records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recordsData, null, 2)
        })
            .then((res) => res.json())
            .then((data) => console.log("Save response:", data))
            .catch((error) => console.error("Error saving records:", error));
    };

    // Get the forms to check if a record is open.
    const forms = renderForms();

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-black">Data Editor</h2>

            {/* Top-level class selection */}
            <label className="block mb-2 text-black font-semibold">Select Class:</label>
            <select
                className="p-1 border rounded mb-4 text-black"
                value={selectedClassId || ""}
                onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedRecordIds([]);
                }}
            >
                <option value="">-- Choose a Class --</option>
                {schemaJSON.classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                        {cls.label} ({cls.id})
                    </option>
                ))}
            </select>

            {/* Render a dropdown for each subClass in the chain */}
            {selectedClassId && renderSubClassDropdowns()}

            {/* Render forms for each chosen record */}
            {forms}

            {/* Only show the Save button if at least one record is open */}
            {forms.length > 0 && (
                <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                    Save All Changes
                </button>
            )}

            {/* Debug: Show full records JSON */}
            <div className="mt-8 bg-gray-800 text-green-300 p-4 rounded">
                <h3 className="text-lg font-bold mb-2">Current JSON Data</h3>
                <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(recordsData, null, 2)}
                </pre>
            </div>
        </div>
    );
}
