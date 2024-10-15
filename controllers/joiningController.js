import db from "../config/db.js";

// Submit Joining Form(HR Supervisor)
export const fillJoiningForm = async (req, res) => {
  try {
    const {
      employeeID,
      full_name,
      fathers_name,
      date_of_birth,
      gender,
      marital_status,
      blood_group,
      official_contact_no,
      official_mail_id,
      personal_contact_no,
      personal_mail_id,
      present_address_name,
      present_address_relation,
      present_address_contact_no,
      present_address_full_address,
      present_address_state,
      present_address_district_city,
      present_address_pin_code,
      permanent_address_name,
      permanent_address_relation,
      permanent_address_contact_no,
      permanent_address_full_address,
      permanent_address_state,
      permanent_address_district_city,
      permanent_address_pin_code,
      date_of_interview,
      date_of_joining,
      company_name,
      department,
      designation,
      employee_type,
      mode_of_recruitment,
      reference_consultancy,
      pan_no,
      adhar_no,
      bank,
      account_no,
      ifsc_code,
      branch_address,
      uan_no,
      e_name1,
      e_relation1,
      e_address1,
      e_contact_no1,
      e_name2,
      e_relation2,
      e_address2,
      e_contact_no2,
      date,
    } = req.body;

    const photo_url = req.file
      ? `/uploads/${encodeURIComponent(req.file.originalname)}`
      : null;

    const query = `
      INSERT INTO joining_forms (
        photo_url,employeeID, full_name, fathers_name, date_of_birth, gender, marital_status, blood_group,
        official_contact_no, official_mail_id, personal_contact_no, personal_mail_id,
        present_address_name, present_address_relation, present_address_contact_no,
        present_address_full_address, present_address_state, present_address_district_city,
        present_address_pin_code, permanent_address_name, permanent_address_relation,
        permanent_address_contact_no, permanent_address_full_address, permanent_address_state,
        permanent_address_district_city, permanent_address_pin_code, date_of_interview,
        date_of_joining,company_name, department, designation, employee_type, mode_of_recruitment,
        reference_consultancy, pan_no,adhar_no, bank, account_no, ifsc_code, branch_address, uan_no,
        e_name1, e_relation1, e_address1, e_contact_no1, e_name2, e_relation2, e_address2, e_contact_no2, date
      ) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      photo_url,
      employeeID || null,
      full_name || null,
      fathers_name || null,
      date_of_birth || null,
      gender || null,
      marital_status || null,
      blood_group || null,
      official_contact_no || null,
      official_mail_id || null,
      personal_contact_no || null,
      personal_mail_id || null,
      present_address_name || null,
      present_address_relation || null,
      present_address_contact_no || null,
      present_address_full_address || null,
      present_address_state || null,
      present_address_district_city || null,
      present_address_pin_code || null,
      permanent_address_name || null,
      permanent_address_relation || null,
      permanent_address_contact_no || null,
      permanent_address_full_address || null,
      permanent_address_state || null,
      permanent_address_district_city || null,
      permanent_address_pin_code || null,
      date_of_interview || null,
      date_of_joining || null,
      company_name || null,
      department || null,
      designation || null,
      employee_type || null,
      mode_of_recruitment || null,
      reference_consultancy || null,
      pan_no || null,
      adhar_no || null,
      bank || null,
      account_no || null,
      ifsc_code || null,
      branch_address || null,
      uan_no || null,
      e_name1 || null,
      e_relation1 || null,
      e_address1 || null,
      e_contact_no1 || null,
      e_name2 || null,
      e_relation2 || null,
      e_address2 || null,
      e_contact_no2 || null,
      date || null,
    ];

    // Ensure values length matches query placeholders count
    const placeholderCount = (query.match(/\?/g) || []).length;
    if (values.length !== placeholderCount) {
      return res.status(400).json({
        error: `Expected ${placeholderCount} values, but got ${values.length}.`,
      });
    }
    await db.promise().query(query, values);
    return res
      .status(201) //201 for resource created
      .json({ message: "Joining form submitted successfully", photo_url });
  } catch (err) {
    res.status(500).json({ error: err.message }); //500 for server error
  }
};

// Get Joining Forms(worker,Supervisor,Admin)
export const getJoiningForms = async (req, res) => {
  try {
    const query = "SELECT * FROM joining_forms";
    const [result] = await db.promise().query(query);
    if (result.length === 0) {
      return res.status(404).json({ message: "No joining forms found" }); //404 for not found
    }
    res.status(200).json(result); //200 for success
  } catch (err) {
    res.status(500).json({ error: err.message }); //500 for server error
  }
};

//Update Joining Form(HR Supervisor)
export const updateJoiningForm = async (req, res) => {
  try {
    const { id } = req.params; //Assuming form ID is passes in URL
    const updatedFields = req.body;
    //File handling for photo upload
    const photo_url = req.file
      ? `/uploads/${encodeURIComponent(req.file.originalname)}`
      : null;
    if (photo_url) {
      updatedFields.photo_url = photo_url;
    }

    //check if there are fields to update
    const field = Object.keys(updatedFields)
      .map((field) => `${field} = ?`)
      .join(", ");

    //Initialize values array
    const values = Object.values(updatedFields);

    if (field.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    //Add ID for where clause
    values.push(id);

    const query = `UPDATE joining_forms SET ${field} WHERE id = ?`;

    //Ensure query runs as promise
    await db.promise().query(query, values);
    return res
      .status(200)
      .json({ message: "Joining form updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
