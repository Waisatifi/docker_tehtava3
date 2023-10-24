import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import Taulukko from "./Taulukko.jsx";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";

function Home() {
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
  }, [auth]);

  const handleDelete = () => {
    axios
      .get("http://localhost:5000/logout")
      .then((res) => {
        window.location.reload(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div style={{ marginTop: "150px" }}>
      <div>
        {auth ? (
          <>
            <Link to={"/"}>
              <button className="btn btn-edit" onClick={handleDelete}>
                Logout
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              <button className="btn btn-edit">Login</button>
            </Link>
          </>
        )}
        <>
          <Taulukko tableName={"reititin_db"} otsikko={"Reitittimet"} />
          <Taulukko tableName={"kytkimet_db"} otsikko={"Kytkimet"} />
          <Taulukko tableName={"nas_db"} otsikko={"Nas"} />
          <Taulukko tableName={"epdu_db"} otsikko={"ePDU"} />
          <Taulukko tableName={"proxmox_db"} otsikko={"Proxmox"} />
        </>
      </div>
    </div>
  );
}

export default Home;
