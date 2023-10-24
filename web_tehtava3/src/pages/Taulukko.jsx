import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "bootstrap/dist/css/bootstrap.css";

function Taulukko({ tableName, otsikko }) {
  const [data, setData] = useState([]);

  const [auth, setAuth] = useState(false);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const loadData = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/get/${tableName}`
    );
    setData(response.data);
  };

  useEffect(() => {
    loadData().catch((error) => console.error(error));
  }, []);

  const deleteContact = (tableName, id) => {
    if (window.confirm("Are you sure you want to delete contact?")) {
      axios.delete(`http://localhost:5000/api/remove/${tableName}/${id}`);
      toast.success("Contact Deleted Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      setTimeout(() => loadData(), 500);
    }
  };

  return (
    <div style={{ marginTop: "50px", marginBottom: "50px" }}>
      <div>
        <div className="">
          <h3>{otsikko}</h3>
          {auth ? (
            <Link to={`/Addcontact/${tableName}`}>
              <button className="btn btn-contact">Add Contact</button>
            </Link>
          ) : (
            <></>
          )}
          <TableContainer component={Paper} className="styled-table">
            <Table aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">No.</TableCell>
                  <TableCell align="center">Ip</TableCell>
                  <TableCell align="center">Nimi</TableCell>
                  <TableCell align="center">Osoite</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No data available</TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="right">{item.ip}</TableCell>
                      <TableCell align="right">{item.nimi}</TableCell>
                      <TableCell align="right">{item.osoite}</TableCell>
                      {auth ? (
                        <TableCell align="right">
                          <Link to={`/update/${tableName}/${item.id}`}>
                            <button className="btn btn-edit">Edit</button>
                          </Link>
                          <button
                            className="btn btn-delete"
                            onClick={() => deleteContact(tableName, item.id)}
                          >
                            Delete
                          </button>
                          <Link to={`/view/${tableName}/${item.id}`}>
                            <button className="btn btn-view">View</button>
                          </Link>
                        </TableCell>
                      ) : (
                        <></>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Taulukko;
