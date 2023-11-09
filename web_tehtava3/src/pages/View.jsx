import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./View.css";
import axios from "axios";

const View = () => {
  const [laite, setLaite] = useState({});
  const { tableName, id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get/${tableName}/${id}`)
      .then((resp) => setLaite({ ...resp.data[0] }));
  }, [id]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card">
        <div className="card-header">
          <p>User Contact Details</p>
        </div>
        <div className="conatiner">
          <strong>ID: </strong>
          <span>{id}</span>
          <br />
          <br />
          <strong>Ip: </strong>
          <span>{laite.ip}</span>
          <br />
          <br />
          <strong>Nimi: </strong>
          <span>{laite.nimi}</span>
          <br />
          <br />
          <strong>Osoite: </strong>
          <span><a href={laite.osoite}>{laite.osoite}</a></span>
          <br />
          <br />
          <Link to="/">
            <button className="btn btn-edit">Go Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default View;
