const SERVER_URL = "http://manage.mentorpreptests.in";
export const sendRequest = async (
  path = "",
  method = "GET",
  headers = {},
  body = null,
  callback = null
) => {
  let res;
  try {
    res = await fetch(`${SERVER_URL}${path}`, {
      method,
      credentials: "include",
      headers,
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

export const checkAuthorisation = async (accessKey, callback) => {
  try {
    return sendRequest(
      `/authenticate`,
      "POST",
      { "Content-Type": "application/json" },
      { accessKey },
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
    return sendRequest(`/insights`, "GET", {}, null, async (res) => {
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
    return sendRequest(`/mentors/${id}`, "DELETE", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getMentor = async (id, callback) => {
  try {
    return sendRequest(`/mentors/${id}`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllMentors = async (callback) => {
  try {
    return sendRequest(`/mentors/`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
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
    return sendRequest(`/mentees/${id}`, "DELETE", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getMentee = async (id, callback) => {
  try {
    return sendRequest(`/mentees/${id}`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllMentees = async (callback) => {
  try {
    return sendRequest(`/mentees/`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
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
    return sendRequest(`/salary/logs/${id}`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllMonthlySalaryRecord = async (callback) => {
  try {
    return sendRequest(`/salary/logs`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
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
    return sendRequest(`/salary/daily/${id}`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const getAllDailySalaryRecord = async (callback) => {
  try {
    return sendRequest(`/salary/daily`, "GET", {}, null, async (res) => {
      if (callback) return callback(await res.json());
      return res.json();
    });
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
      async (res) => {
        if (callback) return callback(await res.json());
        return res.json();
      }
    );
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
