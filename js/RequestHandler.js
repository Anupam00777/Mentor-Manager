const SERVER_URL = "http://manage.mentorpreptests.in";
export const sendRequest = async (
  path = "",
  method = "GET",
  headers = {},
  body = null,
  query = null,
  callback = null
) => {
  let res;
  const accessKey = localStorage.getItem("accessKey");
  const queryString = new URLSearchParams(query).toString();
  const fullPath = query ? `${path}?${queryString}` : path;
  try {
    res = await fetch(`${SERVER_URL}${fullPath}`, {
      method,
      credentials: "include",
      headers: { ...headers, accesskey: accessKey },
      body: body ? JSON.stringify(body) : null,
    });
  } catch (error) {
    return { error };
  }

  if (callback) return callback(res);
  return res;
};

export const handleServerError = (error) => {
  alert("Error trying to connect to server.");
  console.error(error);
};

export const checkAuthorisation = async (callback) => {
  try {
    return sendRequest(
      `/authenticate`,
      "GET",
      { "Content-Type": "application/json" },
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getInsights = async (callback) => {
  try {
    return sendRequest(`/insights`, "GET", {}, null, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

////////////////////////////////////// MENTORS ///////////////////////////////////////

export const addMentor = async (mentorData, callback) => {
  try {
    return sendRequest(
      `/mentors/`,
      "POST",
      { "Content-Type": "application/json" },
      mentorData,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const addMentorsFromCSV = async (CSVFile, callback) => {
  try {
    return sendRequest(
      `/mentors/addFromCSV`,
      "POST",
      { "Content-Type": "application/json" },
      { file: CSVFile },
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const modifyMentor = async (id, updatedData, callback) => {
  try {
    return sendRequest(
      `/mentors/${id}`,
      "PUT",
      { "Content-Type": "application/json" },
      updatedData,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const deleteMentor = async (id, callback) => {
  try {
    return sendRequest(
      `/mentors/${id}`,
      "DELETE",
      {},
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getMentor = async (id, callback) => {
  try {
    return sendRequest(`/mentors/${id}`, "GET", {}, null, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllMentors = async (limit = 1000, skip = 0, callback) => {
  try {
    return sendRequest(
      `/mentors/`,
      "GET",
      {},
      null,
      { limit, skip },
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

////////////////////////////////////// MENTEES ///////////////////////////////////////

export const addMentee = async (menteeData, callback) => {
  try {
    return sendRequest(
      `/mentees/`,
      "POST",
      { "Content-Type": "application/json" },
      menteeData,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const addMenteesFromCSV = async (CSVFile, callback) => {
  try {
    return sendRequest(
      `/mentees/addFromCSV`,
      "POST",
      { "Content-Type": "application/json" },
      { file: CSVFile },
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const modifyMentee = async (id, updatedData, callback) => {
  try {
    return sendRequest(
      `/mentees/${id}`,
      "PUT",
      { "Content-Type": "application/json" },
      updatedData,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const deleteMentee = async (id, callback) => {
  try {
    return sendRequest(
      `/mentees/${id}`,
      "DELETE",
      {},
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getMentee = async (id, callback) => {
  try {
    return sendRequest(`/mentees/${id}`, "GET", {}, null, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllMentees = async (limit = 1000, skip = 0, callback) => {
  try {
    return sendRequest(
      `/mentees/`,
      "GET",
      {},
      null,
      { limit, skip },
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

////////////////////////////////////// MONTHLY SALARIES ///////////////////////////////////////

export const addMonthlySalaryRecord = async (salaryData, callback) => {
  try {
    return sendRequest(
      `/salary/logs`,
      "POST",
      { "Content-Type": "application/json" },
      salaryData,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const addSalaryRecordsFromCSV = async (CSVFile, callback) => {
  try {
    return sendRequest(
      `/salary/addFromCSV`,
      "POST",
      { "Content-Type": "application/json" },
      { file: CSVFile },
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const modifyMonthlySalaryRecord = async (id, updatedData, callback) => {
  try {
    return sendRequest(
      `/salary/logs/${id}`,
      "PUT",
      { "Content-Type": "application/json" },
      updatedData,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const deleteMonthlySalaryRecord = async (id, callback) => {
  try {
    return sendRequest(
      `/salary/logs/${id}`,
      "DELETE",
      {},
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const auditMonthlySalaryRecord = async (mentorId, month, callback) => {
  try {
    return sendRequest(
      `/audit`,
      "POST",
      { "Content-Type": "application/json" },
      { mentorId, month },
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getMonthlySalaryRecord = async (id, callback) => {
  try {
    return sendRequest(
      `/salary/logs/${id}`,
      "GET",
      {},
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllMonthlySalaryRecord = async (
  limit = 1000,
  skip = 0,
  callback
) => {
  try {
    return sendRequest(
      `/salary/logs`,
      "GET",
      {},
      null,
      { limit, skip },
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const downloadPayslip = async (id, callback) => {
  try {
    return sendRequest(
      `/generate-payslip/${id}`,
      "GET",
      {},
      null,
      null,
      async (res) => {
        // Convert the response to a Blob (binary large object) to handle file download
        const blob = await res.blob();

        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = `payslip_${id}.xlsx`; // Change the file name and extension based on the file type
        document.body.appendChild(a);
        a.click();

        // Cleanup: remove the temporary link and release the blob URL
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Call the callback if provided
        if (callback) return callback();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

////////////////////////////////////// DAILY SALARIES ///////////////////////////////////////

export const addDailySalaryRecord = async (salaryData, callback) => {
  try {
    return sendRequest(
      `/salary/daily`,
      "POST",
      { "Content-Type": "application/json" },
      salaryData,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const addDailySalaryRecordsFromCSV = async (CSVFile, callback) => {
  try {
    return sendRequest(
      `/salary/addFromCSV`,
      "POST",
      { "Content-Type": "application/json" },
      { file: CSVFile },
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const modifyDailySalaryRecord = async (
  filter,
  updatedData,
  callback
) => {
  try {
    const body = { data: updatedData };
    if (filter) body.filter = filter;
    return sendRequest(
      `/salary/daily/upsert`,
      "POST",
      { "Content-Type": "application/json" },
      body,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const deleteDailySalaryRecord = async (id, callback) => {
  try {
    return sendRequest(
      `/salary/daily/${id}`,
      "DELETE",
      {},
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getDailySalaryRecord = async (id, callback) => {
  try {
    return sendRequest(
      `/salary/daily/${id}`,
      "GET",
      {},
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllDailySalaryRecord = async (
  id,
  limit = 1000,
  skip = 0,
  callback
) => {
  try {
    return sendRequest(
      `/salary/daily/mentor/${id}`,
      "GET",
      {},
      null,
      { limit, skip },
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllMentorLeaveRecord = async (mentorId, callback) => {
  try {
    return sendRequest(
      `/salary/leaves/${mentorId}`,
      "GET",
      {},
      null,
      null,
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
