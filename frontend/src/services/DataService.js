import http from "../http-common";
class DataService {
  
  login(user) {
    return http.post("/login", user);
  }
  logout() {
    return http.post("/logout");
  }
  auth(headers) {
    return http.get("/auth", headers);
  }
  getTotalCard(dateFilter) {
    return http.post("/dashboard/getTotalCard", dateFilter);
  }
  getStatusChart(dateFilter) {
    return http.post("/dashboard/getStatusChart", dateFilter);
  }
  getAmountChart(dateFilter) {
    return http.post("/dashboard/getAmountChart", dateFilter);
  }
  getMIStatusChart(dateFilter) {
    return http.post("/dashboard/getMIStatusChart", dateFilter);
  }
  getMOPChart(dateFilter) {
    return http.post("/dashboard/getMOPChart", dateFilter); // previously "/history/getMOPChart"
  }
  getFilteredData(page, filter) {
    return http.post(`/history/getFilteredData/${page}`, filter);
  }
  exportData(filter) {
    return http.post("/export", filter,{responseType: 'blob'});
  }
}

export default new DataService();
