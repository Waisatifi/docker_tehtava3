import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./AddEdit.css";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  ip: "",
  nimi: "",
  osoite: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);

  const { ip, nimi, osoite } = state;

  const navigator = useNavigate();

  const { id } = useParams();
  const tableName = "reititin_db";

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get/${tableName}/${id}`)
      .then((resp) => setState({ ...resp.data[0] }))
      .catch((err) => console.error("Virhe pyynnössä:", err));
  }, [tableName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ip || !nimi || !osoite)
      toast.error("Please provide value in input field", {
        position: toast.POSITION.TOP_CENTER,
      });
    else {
      if (!id) {
        axios
          .post(`http://localhost:5000/api/post/${tableName}`, {
            ip,
            nimi,
            osoite,
          })
          .then(() => {
            setState({ ip: "", nimi: "", osoite: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(`Contact Added Successfully ${tableName}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        axios
          .put(`http://localhost:5000/api/update/${tableName}/${id}`, {
            ip,
            nimi,
            osoite,
          })
          .then(() => {
            setState({ ip: "", nimi: "", osoite: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Contact Updated Successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      setTimeout(() => navigator("/"), 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="ip">Ip</label>
        <input
          type="text"
          id="ip"
          name="ip"
          placeholder="Enter Ip..."
          value={ip || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="nimi">Nimi</label>
        <input
          type="text"
          id="nimi"
          name="nimi"
          placeholder="Enter Nimi..."
          value={nimi || ""}
          onChange={handleInputChange}
        />
        <label htmlFor="osoite">osoite</label>
        <input
          type="text"
          id="osoite"
          name="osoite"
          placeholder="Enter mobile no..."
          value={osoite || ""}
          onChange={handleInputChange}
        />
        <input type="submit" value={id ? "Update" : "Save"} />
        <Link to="/">
          <input type="button" value="Go Back" />
        </Link>
      </form>
    </div>
  );
};

export default AddEdit;
