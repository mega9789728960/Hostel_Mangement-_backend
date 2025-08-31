const database = await import('../database/databaseconntection.js').then(mod => mod.default);

import bcrypt from "bcrypt";

async function register(req, res) {
  try {
    const data1 = req.body;

    const saltRounds = 10; // controls complexity
    const hashed = await bcrypt.hash(data1["create_password"], saltRounds);

    data1["confirm_password"] = hashed;
    data1["create_password"] = hashed;

    console.log(JSON.stringify(data1));

    delete data1["id"]; // safe even if it doesn't exist

    const { data, error } = await database
      .from("students")
      .select("*")
      .order("id", { ascending: false }) // Sort by id, newest first
      .limit(1); // Only return one row

    if (error) {
      console.error(error);
    } else {
      data1["id"] = data[0]["id"];
      console.log("Last row:", data[0]["id"]);
    }

    const now = new Date();
    const isoString = now.toISOString();

    data1["created_at"] = isoString;
    data1["updated_at"] = isoString;

    // Check if registration number already exists
    const { data: existing, error: selectError } = await database
      .from("students")
      .select("*")
      .eq("registration_number", data1["registration_number"]); // make sure this matches your DB column

    if (selectError) {
      console.error("❌ Error fetching data:", selectError.message);
      return res.status(500).json({
        success: false,
        message: "Error checking registration number",
        error: selectError,
      });
    }

    // If no existing record, insert new student
    if (!existing || existing.length === 0) {
      const { data: inserted, error: insertError } = await database
        .from("students")
        .insert([data1]);

      if (insertError) {
        console.error("❌ Error inserting data:", insertError.message);
        return res.status(500).json({
          success: false,
          message: "Error inserting student",
          error: insertError,
        });
      }

      console.log("✅ Student registered:", inserted);
      return res.status(201).json({
        success: true,
        message: "Student registered successfully",
        student: inserted,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Registration number already exists",
      });
    }
  } catch (err) {
    // Handle unexpected errors
    console.error("💥 Unexpected error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

export default register;
