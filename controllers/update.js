import database from "../database/databaseconntection.js";
import updatelog from "./upadatelog1.js";

async function update(req, res) {
  try {
    const newData = req.body;

    // Remove null or empty fields
    const cleanedData = Object.fromEntries(
      Object.entries(newData).filter(([_, v]) => v !== null && v !== "")
    );

    const registrationNumber = cleanedData["registration_number"];
    if (!registrationNumber) {
      return res.status(400).json({
        status: "error",
        message: "Registration number is required",
      });
    }

    // Fetch existing student data
    const { data: existingData, error: selectError } = await database
      .from("students")
      .select("*")
      .eq("registration_number", registrationNumber)
      .single();

    if (selectError || !existingData) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Filter only fields that are different from existing data
    const fieldsToUpdate = {};
    for (const key in cleanedData) {
      if (
        key !== "registration_number" &&
        key !== "created_at" && // ignore created_at
        cleanedData[key] !== existingData[key]
      ) {
        fieldsToUpdate[key] = cleanedData[key];
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      // No changes, nothing to update
      return res.status(200).json({
        status: "success",
        message: "No changes detected, update skipped",
      });
    }

    // Perform update
    const { data: updatedData, error: updateError } = await database
      .from("students")
      .update(fieldsToUpdate)
      .eq("registration_number", registrationNumber);

    // Log the updates, excluding created_at
    const logData = { ...fieldsToUpdate, registration_number: registrationNumber };
    await updatelog(logData);

    if (updateError) {
      return res.status(400).json({
        status: "error",
        message: updateError.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Student updated successfully",
      updatedData,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}

export default update;
