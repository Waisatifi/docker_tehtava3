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
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

function Taulukko() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/get");
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
    <div style={{ marginTop: "150px" }}>
      <div>
        <div className="mt-5">
          <h3>Reitittimet</h3>
          <Link to="/Addcontact">
            <button className="btn btn-contact">Add Contact</button>
          </Link>
          <TableContainer component={Paper} className="styled-table">
            <Table aria-label="caption table">
              <caption>Contact data in the database</caption>
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
                {data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="right">{item.ip}</TableCell>
                    <TableCell align="right">{item.nimi}</TableCell>
                    <TableCell align="right">{item.osoite}</TableCell>
                    <TableCell align="right">
                      <Link to={`/update/${item.id}`}>
                        <button className="btn btn-edit">Edit</button>
                      </Link>
                      <button
                        className="btn btn-delete"
                        onClick={() => deleteContact("contact_db", item.id)}
                      >
                        Delete
                      </button>
                      <Link to={`/view/${item.id}`}>
                        <button className="btn btn-view">View</button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Taulukko;
