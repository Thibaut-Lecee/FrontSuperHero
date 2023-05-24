import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { API_URL, HERO_KEY } from "../../App";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MapLocation from "./MapLocation";
import hero from "../Heros/Hero.json";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { green, red } from "@mui/material/colors";
import {
  handleAxiosErrors,
  showNotificationSuccess,
} from "../Function/AxiosRequest";
import { toast, Toaster } from "react-hot-toast";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Squad Gang
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#f44336",
    },
  },
});

const Register = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = React.useState([]);
  const [image, setImage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    nom: "",
    email: "",
    telephone: "",
    location: "",
  });
  const [selectedIncidents, setSelectedIncidents] = React.useState([
    null,
    null,
    null,
  ]);
  const [location, setLocation] = React.useState({
    lat: null,
    lng: null,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      nom: data.get("nom"),
      incidents: selectedIncidents,
      adresse: location,
    });
    if (validateForm(data)) {
      console.log("valid");
      sendData(data);
    }
  };
  const sendData = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/heros/createHero`,
        {
          email: data.get("email"),
          password: data.get("password"),
          nom: data.get("nom"),
          phoneNumber: data.get("telephone"),
          incidents: selectedIncidents,
          adresse: location,
        },
        {
          Headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        showNotificationSuccess("Inscription réussie");
        navigate("/Login");
      }
    } catch (error) {
      console.log(error);
      handleAxiosErrors(error);
    }
  };

  const handleLocation = (lat, lng) => {
    setLocation({ lat, lng });
  };

  const handleChange = (index) => (event) => {
    setSelectedIncidents((prevState) => {
      const newState = [...prevState];
      newState[index] = event.target.value;
      return newState;
    });
  };
  const getAllIncidents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/incidents/allIncidents`,
        {
          Headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIncidents(response.data.incidents);
    } catch (error) {}
  };

  const getRandomPicture = async () => {
    setLoading(true);
    try {
      const random = Math.floor(Math.random() * hero.length);
      console.log(hero[random]);
      const picture = await axios.get(
        `https://www.superheroapi.com/api.php/${HERO_KEY}/search/${hero[random].name}`
      );
      console.log(picture.data.results);
      if (picture.status === 200 && picture.data.results !== undefined) {
        setLoading(false);
        setImage(picture.data.results[0].image.url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = (data) => {
    // Cloner l'objet errors pour ne pas le modifier directement
    let newErrors = { ...errors };

    // Vérifiez si le nom est vide
    if (!data.get("nom")) {
      newErrors.nom = "Le nom est requis.";
    } else {
      newErrors.nom = "";
    }

    // Vérifiez si l'email est vide ou n'a pas le format correct
    const email = data.get("email");
    if (!/\S+@\S+\.\S+/.test(email) && email !== "") {
      newErrors.email = "L'email n'est pas valide.";
    } else {
      newErrors.email = "";
    }

    // Vérifiez si le téléphone est vide
    if (!data.get("telephone")) {
      newErrors.telephone = "Le numéro de téléphone est requis.";
    } else {
      newErrors.telephone = "";
    }

    if (!data.get("password")) {
      newErrors.password = "Le mot de passe est requis.";
    } else {
      newErrors.password = "";
    }

    // Vérifiez si la localisation est vide
    if (!location.lat || !location.lng) {
      newErrors.location = "La localisation est requise.";
    } else {
      newErrors.location = "";
    }

    if (selectedIncidents.length < 0) {
      toast.error("Veuillez sélectionner au moins 1 incidents");
    } else {
      newErrors.incidents = "";
    }

    // Mettez à jour l'état des erreurs
    setErrors(newErrors);

    // Si tous les champs sont valides, retournez true, sinon false
    return !Object.values(newErrors).some((error) => error !== "");
  };
  React.useEffect(() => {
    getAllIncidents();
    getRandomPicture();
  }, []);
  return (
    <>
      <Toaster reverseOrder={false} />
      <ThemeProvider theme={defaultTheme}>
        {!loading && (
          <Grid container component="main" sx={{ mt: 1 }}>
            <CssBaseline />
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              sx={{
                backgroundImage: `url(${image})`,
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "80%",
                backgroundPosition: "center",
                borderRadius: "8px",
                border: "1px solid #eaeaea",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />

            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 6,
                  mx: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  S'enregistrer
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{}}
                >
                  {/* // handle errors with material ui documentations textField */}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nom"
                    label="Votre SuperName"
                    name="nom"
                    autoComplete="name"
                    autoFocus
                    error={errors.nom !== ""}
                    helperText={errors.nom}
                    InputProps={{
                      endAdornment: errors.nom && (
                        <HighlightOffIcon style={{ color: red[500] }} />
                      ),
                    }}
                    FormHelperTextProps={{
                      style: {
                        color: errors.nom ? red[500] : green[500],
                      },
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="telephone"
                    label="Numéro de téléphone"
                    name="telephone"
                    autoComplete="phone"
                    autoFocus
                    inputProps={{ maxLength: 10 }}
                    error={errors.telephone !== ""}
                    helperText={errors.telephone}
                    InputProps={{
                      endAdornment: errors.telephone && (
                        <HighlightOffIcon style={{ color: red[500] }} />
                      ),
                    }}
                    FormHelperTextProps={{
                      style: {
                        color: errors.telephone ? red[500] : green[500],
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    error={errors.email !== ""}
                    helperText={errors.email}
                    InputProps={{
                      endAdornment: errors.email && (
                        <HighlightOffIcon style={{ color: red[500] }} />
                      ),
                    }}
                    FormHelperTextProps={{
                      style: {
                        color: errors.email ? red[500] : green[500],
                      },
                    }}
                  />
                  {/* Add this Box for MapLocation */}
                  <MapLocation
                    HighlightOffIcon={HighlightOffIcon}
                    CheckCircleOutlineIcon={CheckCircleOutlineIcon}
                    red={red}
                    green={green}
                    locationCallBack={handleLocation}
                    error={errors.location}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={errors.password !== ""}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: errors.password && (
                        <HighlightOffIcon style={{ color: red[500] }} />
                      ),
                    }}
                    FormHelperTextProps={{
                      style: {
                        color: errors.password ? red[500] : green[500],
                      },
                    }}
                  />

                  {[...Array(3)].map((_, index) => (
                    <FormControl key={index} sx={{ display: "flex" }}>
                      <InputLabel id={`incident-select-label-${index}`}>
                        Incident {index + 1}
                      </InputLabel>
                      <Select
                        labelId={`incident-select-label-${index}`}
                        id={`incident-select-${index}`}
                        sx={{ minWidth: 120, marginBottom: 1 }}
                        value={selectedIncidents[index] || ""}
                        onChange={handleChange(index)}
                      >
                        {incidents.map((incident, idx) => (
                          <MenuItem
                            key={idx}
                            value={incident.id}
                            disabled={selectedIncidents.includes(incident.id)}
                          >
                            {incident.type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button type="submit" fullWidth variant="contained">
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link
                        onClick={() => navigate("/Login")}
                        variant="body2"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {"Vous avez un compte ? Connectez-vous"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 1 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </ThemeProvider>
    </>
  );
};

export default Register;
