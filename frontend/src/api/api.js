import axios from 'axios';

const API_BASE_URL = 'http://berrynursery.atwebpages.com';
export const getChildren = async () => {
  const response = await axios.get(`${API_BASE_URL}/children.php`);
  return response.data;
};

export const getChild = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/children.php?id=${id}`);
  return response.data;
};

export const addChild = async (childData) => {
  const { className, ...rest } = childData;
  const response = await axios.post(`${API_BASE_URL}/children.php`, { ...rest, class: className });
  return response.data;
};


export const updateChild = async (id, childData) => {
  const response = await axios.put(`${API_BASE_URL}/children.php?id=${id}`, childData);
  return response.data;
};

export const deleteChild = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/children.php?id=${id}`);
  return response.data;
};
export const getReports = async () => {
  const response = await axios.get(`${API_BASE_URL}/reports.php`);
  return response.data;
};

export const getReportsByChild = async (childId) => {
  const response = await axios.get(`${API_BASE_URL}/reports.php?child_id=${childId}`);
  return response.data;
};

export const addReport = async (reportData) => {
  const response = await axios.post(`${API_BASE_URL}/reports.php`, reportData);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/reports.php?id=${id}`);
  return response.data;
};
export const getAttendance = async () => {
  const response = await axios.get(`${API_BASE_URL}/attendance.php`);
  return response.data;
};

export const getAttendanceByChild = async (childId) => {
  const response = await axios.get(`${API_BASE_URL}/attendance.php?child_id=${childId}`);
  return response.data;
};

export const addAttendance = async (attendanceData) => {
  const response = await axios.post(`${API_BASE_URL}/attendance.php`, attendanceData);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/attendance.php?id=${id}`);
  return response.data;
};
export const login = async (identifier, password) => {
  const response = await axios.post(`${API_BASE_URL}/login.php`, { identifier, password });
  return response.data;
};
