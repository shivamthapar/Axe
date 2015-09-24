var Query = function(){}

Query.prototype.buildInsertQueryString = function(newUrlArray){
  var query = "INSERT INTO sites (site_address, run) VALUES ";
  for(var i = 0; i<newUrlArray.length; i++){
    query+="('"+newUrlArray[i]+"', TRUE),";
  }
  if(newUrlArray.length>0){
    query=query.substring(0, query.length-1);
  }
  return query;
}

Query.prototype.buildFetchQueryString = function(id, startDate, endDate, connectionTypes, browserTypes){
	var str = "SELECT * FROM TESTS WHERE ";
  str+="id = " + id;
  str+=" AND ";
  str+="(conn_type in (" + connectionTypes.join(",") + "))";
  str+=" AND ";
  str+="(browser_type in (" + browserTypes.join(",") + "))";
  str+=" AND ";
  str+="(date>='" + startDate + "' AND date<='" + endDate + "')";
  str+=" ORDER BY date DESC";
	return str;
}

Query.prototype.buildFetchResulstsByIdsQueryString = function(ids, startDate, endDate, connectionTypes, browserTypes){
	var str = "SELECT tests.test_id, tests.results_url, tests.date, tests.tested, tests.fv_load_time, tests.sv_load_time, tests.fv_speed_index, tests.sv_speed_index, tests.fv_start_render, tests.sv_start_render, tests.fv_bytes_in, tests.sv_bytes_in, sites.site_address FROM sites,tests WHERE ";
  str+="(sites.id in (" + ids.join(",") + ")) ";
  str+=" AND ";
	str+="(conn_type in (" + connectionTypes.join(",") + "))";
  str+=" AND ";
  str+="(browser_type in (" + browserTypes.join(",") + "))"
  str+=" AND ";
  str+="date>='"+startDate+"' AND date<='"+endDate+"'";
  str+=" AND tests.id = sites.id";
  str+=" ORDER BY date DESC";
	return str;
}

module.exports = new Query();
