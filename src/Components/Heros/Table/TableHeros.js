import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllHeros } from "../../Function/AxiosRequest";
import { AuthContext } from "../../Login/Context/AuthProvider";
import jwtDecode from "jwt-decode";
import { Toaster } from "react-hot-toast";
const TableHeros = () => {
  const [heros, setHeros] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const { user } = useContext(AuthContext);

  const getHeros = async () => {
    const allHeros = await getAllHeros();
    setHeros(allHeros);
  };

  useEffect(() => {
    getHeros();
  }, []);

  useEffect(() => {
    console.log(user);
    if (user) {
      console.log(jwtDecode(user));
    }
  }, [user]);
  const generateColumns = () => {
    if (heros.length > 0) {
      const keys = Object.keys(heros[0]);
      return keys.map((key) => {
        let headerName = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === "incidents") {
          return {
            field: key,
            headerName: headerName,
            width: 450,
            valueGetter: (params) =>
              params.row[key].map((incident) => incident.type).join(", "),
          };
        } else if (key === "interventions") {
          return {
            field: key,
            headerName: headerName,
            width: 200,
            valueGetter: (params) => params.row[key]?.length,
          };
        } else {
          return {
            field: key,
            headerName: headerName,
            width: 200,
          };
        }
      });
    }
    return [];
  };

  const rows = heros.map((hero) => ({
    ...hero,
    id: hero.id,
  }));
  const filteredRows = heros
    .map((hero) => ({
      ...hero,
      id: hero.id,
    }))
    .filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  return (
    <>
      <Toaster reverseOrder={false} />
      <Grid
        container
        component="main"
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          height: "80vh",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <TextField
            variant="outlined"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Filtrer par nom, email, etc..."
          />
        </Box>
        <DataGrid
          columns={generateColumns()}
          rows={filterValue ? filteredRows : rows}
          pageSize={1}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Grid>
    </>
  );
};

export default TableHeros;
