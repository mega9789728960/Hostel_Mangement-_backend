import supabase from "../database/databaseconntection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function login(req, res) {
    const SECRET_KEY = "mega";

    try {
        const { registration_number, password } = req.body;

        if (!registration_number || !password) {
            return res.status(400).json({ success: false, message: "Missing registration_number or password" });
        }

        const { data, error } = await supabase
            .from("students")
            .select("registration_number, password")
            .eq("registration_number", registration_number);

        if (error) {
            console.error("Database error:", error.message);
            return res.status(500).json({ success: false, message: "Database query failed" });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const student = data[0];
        console.log(data);
        console.log(registration_number);
        console.log(password);

        const match = await bcrypt.compare(password, student.password);

        if (match) {
            console.log("Text matches the hash!");
            const token = jwt.sign({ registration_number, password }, SECRET_KEY);
            return res.json({ success: true, token: token });
        } else {
            console.log("Text does NOT match the hash!");
            return res.json({ success: false, message: "Incorrect password" });
        }
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
}

export default login;
