import database from "../database/databaseconntection.js";

async function updatelog(data) {
    try {
        console.log("Input data:", JSON.stringify(data));

        for (const i in data) {
            if (i !== "registration_number" && i !== "id") {
                try {
                    // Insert into updatelogs table
                    const { data: insertedData, error } = await database
                        .from("updatelogs")
                        .insert({
                            registration_number: data["registration_number"],
                            column_name: i,
                            updated_value: data[i],
                            updated_time: new Date().toISOString()
                        });

                    if (error) {
                        console.error(`Error inserting column '${i}':`, error);
                    } else {
                        console.log(`Inserted column '${i}':`, insertedData);
                    }
                } catch (dbError) {
                    console.error(`Exception while inserting column '${i}':`, dbError);
                }
            }
        }
    } catch (err) {
        console.error("Unexpected error in updatelog function:", err);
    }
}

export default updatelog;
