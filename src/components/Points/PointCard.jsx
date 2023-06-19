import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  CardHeader,
  Snackbar,
  Alert,
} from "@mui/material";
import { JsonViewer } from "@textea/json-viewer";
import PointImage from "./PointImage";
import { alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CopyAll } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

/**
 * Component for displaying vectors of a point
 * @param {Object} point
 * @returns {JSX.Element|null}
 * @constructor
 */
const Vectors = memo(function Vectors({ point, setRecommendationIds }) {
  if (!point.hasOwnProperty("vector")) {
    return null;
  }

  // to unify the code, we will convert the vector to an object
  // when there is only one vector in the point
  let vectors = {};
  if (Array.isArray(point.vector)) {
    vectors[""] = point.vector;
  } else {
    vectors = point.vector;
  }

  return (
    <Box pt={2}>
      {Object.keys(vectors).map((key) => {
        return (
          <Grid key={key} container spacing={2}>
            <Grid item xs={4} my={1}>
              {key === "" ?
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  display={"inline"}
                  mr={1}
                >
                  Default vector
                </Typography>
                :
                <>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    display={"inline"}
                    mr={1}
                  >
                    Name:
                  </Typography>
                  <Chip
                    label={key}
                    size="small"
                    variant="outlined"
                  />
                </>
              }
            </Grid>

            <Grid item xs={4} my={1}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                display={"inline"}
                mr={1}
              >
                Length:
              </Typography>
              <Chip
                label={vectors[key].length}
                variant="outlined"
                size="small"/>
            </Grid>
            <Grid item xs={4} my={1} display={"flex"}>
              <Box sx={{ flexGrow: 1 }}/>

              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setRecommendationIds([point.id],
                    key === "" ? null : key); // todo: fix this
                }}
              >
                Find Similar
              </Button>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
});

const PointCard = (props) => {
  const theme = useTheme();
  const { point, setRecommendationIds } = props;
  const [openTooltip, setOpenTooltip] = React.useState(false);

  function resDataView(data) {
    const Payload = Object.keys(data.payload).map((key) => {
      return (
        <div key={key}>
          <Grid container spacing={2}>
            <Grid item xs={2} my={1}>
              <Typography
                variant="subtitle1"
                display={"inline"}
                fontWeight={600}
              >
                {key}
              </Typography>
            </Grid>

            <Grid item xs={10} my={1}>
              {typeof data.payload[key] === "object" ? (
                <Typography variant="subtitle1">
                  {" "}
                  <JsonViewer
                    value={data.payload[key]}
                    displayDataTypes={false}
                    defaultInspectDepth={0}
                    rootName={false}
                  />{" "}
                </Typography>
              ) : (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  display={"inline"}
                >
                  {"\t"} {data.payload[key].toString()}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Divider/>
        </div>
      );
    });

    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={2} my={1}>
            <Typography variant="subtitle1" display="inline" fontWeight={600}>
              id
            </Typography>
          </Grid>
          <Grid item xs={10} my={1}>
            <Typography
              variant="subtitle1"
              display="inline"
              color="text.secondary"
            >
              {data["id"] !== null ? data["id"] : "NULL"}
            </Typography>
          </Grid>
        </Grid>
        <Divider/>
        {Payload}
      </>
    );
  }

  return (
    <>
      <Card
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardHeader
          title={"Point " + point.id}
          action={
            <Tooltip title="Copy JSON" placement="right">
              <IconButton
                aria-label="copy point"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(point));
                  setOpenTooltip(true);
                }}>
                <CopyAll/>
              </IconButton>
            </Tooltip>
          }
        />
        <CardHeader subheader={"Payload:"} sx={{
          flexGrow: 1,
          background: alpha(theme.palette.primary.main, 0.05),
        }}/>
        <CardContent>
          <Grid container display={"flex"}>
            <Grid item xs my={1}>
              {resDataView(point)}
            </Grid>
            {point.payload.images &&
              <Grid item xs={3} display="grid" justifyContent={'center'}>
                <PointImage data={point.payload} sx={{ml: 2}}/>
              </Grid>
            }
          </Grid>
        </CardContent>
        <CardHeader subheader={"Vectors:"} sx={{
          flexGrow: 1,
          background: alpha(theme.palette.primary.main, 0.05),
        }}/>
        <CardContent>
          {point?.vector &&
            <Vectors
              point={point}
              setRecommendationIds={setRecommendationIds}/>
          }
        </CardContent>
      </Card>
      <Snackbar
        open={openTooltip}
        severity="success"
        autoHideDuration={3000}
        onClose={() => setOpenTooltip(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Point JSON copied to clipboard.
        </Alert>
      </Snackbar>
    </>
  );
};

// prop types validation

Vectors.propTypes = {
  point: PropTypes.object.isRequired,
  setRecommendationIds: PropTypes.func.isRequired,
};

PointCard.propTypes = {
  point: PropTypes.object.isRequired,
  setRecommendationIds: PropTypes.func.isRequired,
};

export default PointCard;

export { Vectors };