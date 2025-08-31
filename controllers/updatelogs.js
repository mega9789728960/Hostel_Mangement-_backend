import database from "../database/databaseconntection.js";

async function updatelogs(newdata, olddata, registration_number) {
    if (olddata && olddata.length > 0) {
        olddata = olddata[0]; // Use the first element of olddata array
    }

    console.log("old" + JSON.stringify(olddata));
    console.log("new" + JSON.stringify(newdata));

    try {
        // Fetch existing logs for this row
        const { data: existingData, error: fetchError } = await database
            .from("user_update_logs")
            .select("column_changes")
            .eq("row_id", registration_number);

        if (fetchError) {
            console.error("Error fetching update logs:", fetchError.message);
            return;
        }

        // If old data exists, compare and update
        if (olddata != null && existingData && existingData.length > 0) {
            const updated = {};

            // Find changed keys
            for (const key in newdata) {
                if (olddata[key] != newdata[key]) {
                    console.log(olddata[key] + "==" + newdata[key]);
                    updated[key] = newdata[key];
                }
            }
            console.log("updated" + JSON.stringify(updated));

            const columnChanges = existingData[0].column_changes;

            for (const key in updated) {
                const temp = columnChanges[key] || {};
                const numericKeys = Object.keys(temp).map(Number).sort((a, b) => a - b);
                const lastKey = numericKeys.length > 0 ? numericKeys[numericKeys.length - 1] : 0;

                temp[lastKey + 1] = {
                    value: updated[key],
                    time: new Date().toISOString(),
                };

                columnChanges[key] = temp;
            }

            // Update the database with new column_changes
            const { error: updateError } = await database
                .from("user_update_logs")
                .update({ column_changes: columnChanges })
                .eq("row_id", registration_number);

            if (updateError) {
                console.error("Failed to update logs:", updateError.message);
            } else {
                console.log("Update logs successfully saved.");
            }

        } else {
            // If no old data, create new log entry
            const currenttime = new Date().toISOString();
            const a = {};

            for (const key in newdata) {
                a[key] = {
                    1: { value: newdata[key], time: currenttime },
                };
            }

            const { error: insertError } = await database.from("user_update_logs").insert([
                {
                    row_id: registration_number,
                    table_name: "students",
                    column_changes: a,
                },
            ]);

            if (insertError) {
                console.error("Failed to insert logs:", insertError.message);
            } else {
                console.log("New logs successfully inserted.");
            }
        }
    } catch (err) {
        console.error("Unexpected error in updatelogs:", err.message);
    }
}

export default updatelogs;
