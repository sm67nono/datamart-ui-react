import React, { useState, useEffect }  from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { blue } from "@material-ui/core/colors";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import StorageIcon from "@material-ui/icons/Storage";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    marginTop: 40,
    // '&:hover': {
    //   maxHeight: 'none'
    // }
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
    color: "#37617f",
    fontWeight: "bold",
  },
  pos: {
    marginBottom: 12,
    marginLeft: 10,
  },
  avatar: {
    backgroundColor: blue[800],
  },
  overlayDiv: {
    width: "100%",
    background: "linear-gradient(to top, white, rgba(255,255,255,0.1))",
    /* transform: translate(75%, -35%); */
    height: 70,
    opacity: 0.9,
    marginTop: -70,
  },
  descText: {
    paddingTop: 10,
    minHeight: 150,
    // '&:hover': {
    //   maxHeight: 'none'
    // }
  },
  descTextSelected: {
    paddingTop: 10,
    minHeight: 50,
    maxHeight: "auto",
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();
  //const bull = <span className={classes.bullet}>•</span>;

  if (props.depth == 3) {
    let selected = props.selectedCardToExpand === props.itemID;

    return (
      <Card className={classes.root}>
        <CardHeader
          style={{ height: 80 }}
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {props.title[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="delete">
              <ArrowBackIcon onClick={() => props.ops("prev", props.title)} />
            </IconButton>
          }
          title={<b className={classes.title}>{props.title[0].toUpperCase() + props.title.substring(1)}</b>}
          subheader={ "Data as of :"+
           ( new Date().getMonth() +
            1) +
            "/" +
            new Date().getDate() +
            "/" +
            new Date().getFullYear()
          }
        />
        <CardContent>
          <Typography className={classes.pos} color="textSecondary">
            Description :
            {/* <Typography
              className={classes.descText}
              variant="body2"
              component="p"
            >
              {props.desc}
            </Typography> */}
            <Typography
              className={selected ? classes.descTextSelected : classes.descText}
              variant="body2"
              component="p"
              onMouseEnter={() => props.setSelectedCard(props.itemID)}
              onMouseLeave={() => props.setSelectedCard(undefined)}
            >
              {props.desc
                ? selected
                  ? props.desc
                  : props.desc.length > 200
                  ? props.desc.slice(0, 200) + "..."
                  : props.desc.slice(0, 200)
                : undefined}
            </Typography>
            <div
              className={
                !selected &&
                props.desc &&
                props.desc.length > 200 &&
                classes.overlayDiv
              }
            />
            {!selected && props.desc && props.desc.length > 200 && (
              <span style={{ float: "right", fontSize: 14 }}>Read more</span>
            )}
          </Typography>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.pos} color="textSecondary">
                Details
              </Typography>
            </ExpansionPanelSummary>
            <Typography className={classes.pos} color="textSecondary">
              <IconButton aria-label="settings">
                <LocalLibraryIcon />
              </IconButton>
              Contact : <a href="#">email@gmail.com</a>
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              Paper :{" "}
              <a href="http://www.pdf995.com/samples/pdf.pdf">Show</a>
            </Typography>
           
            <Typography className={classes.pos} color="textSecondary">
              Download Paper : <PictureAsPdfIcon />
            </Typography>
          </ExpansionPanel>
        </CardContent>
        <CardActions>
          <a
            href={
              "https://www.google.com"
            }
          >
            <Button size="small" onClick={() => console.log("Wiki")}>
              Wiki
            </Button>
          </a>
          <Button size="small" onClick={() => props.openCatalogModal(props.itemID)}>
            Catalog
          </Button>
          <Link target="_blank" to={`/info-flows/${props.itemID}`}>
            <Button
              size="small"
              // onClick={() => props.viz(props.itemID)}
            >
              Info-flows
            </Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
  if (props.depth == 2) {
    let selected = props.selectedCardToExpand === props.itemID;

    return (
      <Card className={classes.root}>
        <CardHeader
          style={{ height: 80 }}
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {props.title[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="delete">
              <ArrowBackIcon onClick={() => props.ops("prev", props.title)} />
            </IconButton>
          }
          title={<b className={classes.title}>{props.title}</b>}
          subheader={"Data as of : "+
            (new Date().getMonth() +
            1) +
            "/" +
            new Date().getDate() +
            "/" +
            new Date().getFullYear()
          }
        />
        <CardContent>
          <Typography className={classes.pos} color="textSecondary">
            Description :
            {/* <Typography variant="body2" component="p">
              {props.desc}
            </Typography> */}
            <Typography
              className={selected ? classes.descTextSelected : classes.descText}
              variant="body2"
              component="p"
              onMouseEnter={() => props.setSelectedCard(props.itemID)}
              onMouseLeave={() => props.setSelectedCard(undefined)}
            >
              {props.desc
                ? selected
                  ? props.desc
                  : props.desc.length > 200
                  ? props.desc.slice(0, 200) + "..."
                  : props.desc.slice(0, 200)
                : undefined}
            </Typography>
            <div
              className={
                !selected &&
                props.desc &&
                props.desc.length > 200 &&
                classes.overlayDiv
              }
            />
            {!selected && props.desc && props.desc.length > 200 && (
              <span style={{ float: "right", fontSize: 14 }}>Read more</span>
            )}
          </Typography>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.pos} color="textSecondary">
                Details
              </Typography>
            </ExpansionPanelSummary>
            <Typography className={classes.pos} color="textSecondary">
              <IconButton aria-label="settings">
                <LocalLibraryIcon />
              </IconButton>
              Contact : <a href="#">email@gmail.com</a>
            </Typography>

            <Typography className={classes.pos} color="textSecondary">
            Download Paper: <PictureAsPdfIcon />
            </Typography>
          </ExpansionPanel>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => props.ops("next", props.title)}>
            View Details
          </Button>
        </CardActions>
      </Card>
    );
  }

  if (props.depth == 0) {
    // console.log(props)
    // console.log(props.selectedCardToExpand, props.itemID)
    let selected = props.selectedCardToExpand === props.itemID;
    // console.log(selected)
    return (
      <>
        <Card className={classes.root}>
          <CardHeader
            style={{ height: 80 }}
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {props.title[0]}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={<b className={classes.title}>{props.title}</b>}
            subheader={ "Data as of : " +
              (new Date().getMonth() +
              1) +
              "/" +
              new Date().getDate() +
              "/" +
              new Date().getFullYear()
            }
          />
          <CardContent>
            <Typography className={classes.pos} color="textSecondary">
              Description
              <Typography
                className={
                  selected ? classes.descTextSelected : classes.descText
                }
                variant="body2"
                component="p"
                onMouseEnter={() => props.setSelectedCard(props.itemID)}
                onMouseLeave={() => props.setSelectedCard(undefined)}
              >
                {props.desc
                  ? selected
                    ? props.desc
                    : props.desc.length > 200
                    ? props.desc.slice(0, 200) + "..."
                    : props.desc.slice(0, 200)
                  : undefined}
              </Typography>
              <div
                className={
                  !selected &&
                  props.desc &&
                  props.desc.length > 200 &&
                  classes.overlayDiv
                }
              />
              {!selected && props.desc && props.desc.length > 200 && (
                <span style={{ float: "right", fontSize: 14 }}>Read more</span>
              )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => props.ops("next", props.title)}>
              View Category
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }
  //else
  let selected = props.selectedCardToExpand === props.itemID;

  return (
    <Card className={classes.root}>
      <CardHeader
        style={{ height: 80 }}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {props.title[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="delete">
            <ArrowBackIcon onClick={() => props.ops("prev", props.title)} />
          </IconButton>
        }
        title={<b className={classes.title}>{props.title[0].toUpperCase() + props.title.substring(1)}</b>}
        subheader={"Data as of : "+
         ( new Date().getMonth() +
          1) +
          "/" +
          new Date().getDate() +
          "/" +
          new Date().getFullYear()
        }
      />
      <CardContent>
        <Typography className={classes.pos} color="textSecondary">
          Description :
          <Typography
            className={selected ? classes.descTextSelected : classes.descText}
            variant="body2"
            component="p"
            onMouseEnter={() => props.setSelectedCard(props.itemID)}
            onMouseLeave={() => props.setSelectedCard(undefined)}
          >
            {props.desc
              ? selected
                ? props.desc
                : props.desc.length > 200
                ? props.desc.slice(0, 200) + "..."
                : props.desc.slice(0, 200)
              : undefined}
          </Typography>
          <div
            className={
              !selected &&
              props.desc &&
              props.desc.length > 200 &&
              classes.overlayDiv
            }
          />
          {!selected && props.desc && props.desc.length > 200 && (
            <span style={{ float: "right", fontSize: 14 }}>Read more</span>
          )}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => props.ops("next", props.title)}>
          View Laureates
        </Button>
      </CardActions>
    </Card>
  );
}
