import React, { Component } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CustomAutoComplete from "./AutoComplete";
import { DropzoneArea } from "material-ui-dropzone";
import ScrollableList from "./ScrollableList";
import _ from "lodash";
import Slide from "@material-ui/core/Slide";
import { TextField, Divider } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DataSetTable from "./DataSetTable";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const relatedDatasets = [
  { title: "Dataset 1" },
  { title: "Dataset 2" },
  { title: "Dataset 3" },
  { title: "Dataset 4" },
  { title: "Dataset 5" },
  { title: "Dataset 6" },
  { title: "Dataset 7" },
  { title: "Dataset 8" },
  { title: "Dataset 9" },
  { title: "Dataset 10" },
  { title: "Dataset 11" },
  { title: "Dataset 12" },
];

const useStyles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogPaper: {
    minHeight: "90vh",
    maxHeight: "90vh",
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
  buttonContainer: {
    backgroundColor: "#37617f",
    color: "rgba(255, 255, 255, 1)",
  },
  paperRoot: {
    // padding: '2px 4px',
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  dropzoneArea: {
    width: "90%",
  },
});

const DialogTitle = (props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      domainDataGroup: [],
      subDomainDataGroup: [],
      dataCategoryGroup: {},
      initialDataSet: undefined,
      dataSetGroup: undefined,
      filteredDataSetGroup: undefined,
      groups: ["Year", "Category", "Laureates", "Details"],
      domainData: [],
      subDomainData: [],
      categoriesData: [],
      dataSet: [],
      selectedDomain: undefined,
      selectedSubDomain: undefined,
      selectedDataCategory: undefined,
      selectedDataSet: {},
      searchVal: "",
      datasetName: "",
      datasetDesc: "",
      datasetOwner: "",
      publishedBy: "",
      publishedDate: new Date(),
    };
  }

  componentDidMount() {
    const { groups } = this.state;
   /* fetch("http://localhost:7898/metadata")
      
      .then((res) => res.json())
      .then(
        (result) => {
          let dataGroups = _.groupBy(result["data"], groups[0]);
          let dataSetGroups = _.groupBy(result["data"], "DataSubSetId");
          // console.log(dataSetGroups);
          let domainInfo = Object.keys(dataGroups).map((d) => ({
            key: dataGroups[d][0].domainId,
            value: dataGroups[d][0][groups[0]],
          }));
          this.setState({
            initialDataSet: dataSetGroups,
            dataSetGroup: dataSetGroups,
            filteredDataSetGroup: dataSetGroups,
            domainDataGroup: dataGroups,
            domainData: domainInfo,
          });
        },
        (error) => {
          console.log(error);
        }
      );*/
  }

  handleDataSetSelect = (val) => {
    // console.log("----val----", val)
    const { selectedDataSet, filteredDataSetGroup } = this.state;
    let currValId = val["DataSubSetId"];
    // console.log(currValId)
    let currVal;
    let selectedList = { ...selectedDataSet };
    let dataSetList = { ...filteredDataSetGroup };
    currVal = selectedList[currValId];
    // console.log(currVal)
    if (currVal === undefined) {
      selectedList[currValId] = dataSetList[currValId];
      delete dataSetList[currValId];
    } else {
      dataSetList[currValId] = selectedList[currValId];
      delete selectedList[currValId];
    }
    this.setState({
      selectedDataSet: selectedList,
      filteredDataSetGroup: dataSetList,
    });
  };

  handleDomainChange = (val) => {
    const { groups, domainDataGroup, dataSetGroup } = this.state;
    this.setState(
      {
        selectedDomain: val,
        selectedSubDomain: undefined,
        selectedDataCategory: undefined,
        // selectedDataSet: undefined
        // filteredDataSetGroup: dataSetGroup
      },
      () => {
        let dataSubDomainGroup = [];
        let dataSetGroups = [];
        this.state.selectedDomain.forEach((category) => {
          let data = _.groupBy(domainDataGroup[category.value], groups[1]);
          let dataSet = _.groupBy(
            domainDataGroup[category.value],
            "DataSubSetId"
          );
          dataSubDomainGroup = { ...dataSubDomainGroup, ...data };
          dataSetGroups = { ...dataSetGroups, ...dataSet };
        });
        let subDomainInfo = Object.keys(dataSubDomainGroup).map((d) => ({
          key: dataSubDomainGroup[d][0].DataSubSetId,
          value: dataSubDomainGroup[d][0][groups[1]],
        }));
        if (_.isEmpty(this.state.selectedDomain)) {
          dataSetGroups = this.state.initialDataSet;
        }
        this.setState({
          subDomainData: subDomainInfo,
          dataSubDomainGroup,
          filteredDataSetGroup: dataSetGroups,
          dataSetGroup: dataSetGroups,
        });
      }
    );
  };

  handleSubDomainChange = (val) => {
    const {
      groups,
      dataSubDomainGroup,
      domainDataGroup,
      dataSetGroup,
    } = this.state;
    this.setState(
      {
        selectedSubDomain: val,
        selectedDataCategory: undefined,
        // selectedDataSet: undefined
        // filteredDataSetGroup: dataSetGroup
      },
      () => {
        let dataCategoryGroup = [];
        let dataSetGroups = [];
        this.state.selectedSubDomain.forEach((category) => {
          let data = _.groupBy(dataSubDomainGroup[category.value], groups[2]);
          let dataSet = _.groupBy(
            dataSubDomainGroup[category.value],
            "DataSubSetId"
          );
          dataCategoryGroup = { ...dataCategoryGroup, ...data };
          dataSetGroups = { ...dataSetGroups, ...dataSet };
        });
        let dataCategoryInfo = Object.keys(dataCategoryGroup).map((d) => ({
          key: dataCategoryGroup[d][0].DataSubSetCategoryId,
          value: dataCategoryGroup[d][0][groups[2]],
        }));
        if (_.isEmpty(this.state.selectedSubDomain)) {
          this.state.selectedDomain.forEach((category) => {
            let dataSet = _.groupBy(
              domainDataGroup[category.value],
              "DataSubSetId"
            );
            dataSetGroups = { ...dataSetGroups, ...dataSet };
          });
        }
        this.setState({
          categoriesData: dataCategoryInfo,
          dataCategoryGroup,
          filteredDataSetGroup: dataSetGroups,
          dataSetGroup: dataSetGroups,
        });
      }
    );
  };

  handleDataCategoryChange = (val) => {
    const { groups, dataCategoryGroup, dataSubDomainGroup } = this.state;
    this.setState(
      {
        selectedDataCategory: val,
        // selectedDataSet: undefined
      },
      () => {
        let dataSetGroups = [];
        this.state.selectedDataCategory.forEach((category) => {
          let dataSet = _.groupBy(
            dataCategoryGroup[category.value],
            "DataSubSetId"
          );
          dataSetGroups = { ...dataSetGroups, ...dataSet };
        });
        // let dataSetInfo = Object.keys(dataSetGroup).map((d) => (
        //   {
        //     'key': dataSetGroup[d][0].dataSetId,
        //     'value': dataSetGroup[d][0][groups[3]]
        //   }
        // ))
        if (_.isEmpty(this.state.selectedDataCategory)) {
          this.state.selectedSubDomain.forEach((category) => {
            let dataSet = _.groupBy(
              dataSubDomainGroup[category.value],
              "DataSubSetId"
            );
            dataSetGroups = { ...dataSetGroups, ...dataSet };
          });
        }
        this.setState({
          filteredDataSetGroup: dataSetGroups,
          dataSetGroup: dataSetGroups,
        });
      }
    );
  };

  // handleDataSetChange = (val) => {
  //   this.setState({
  //     selectedDataSet: val
  //   })
  // }

  handleChange = (fileData) => {
    console.log("<<<<<<< fileData >>>>>>>>", fileData);
    this.setState({
      files: fileData,
    });
  };

  handleSearch = (e) => {
    this.setState(
      {
        searchVal: e.target.value,
      },
      () => {
        let filteredDataSet = Object.values(this.state.dataSetGroup).filter(
          (e) => {
            let searchString = this.state.searchVal.toLowerCase();
            let dataSetString = e[0]["Data Sub Set"].toLowerCase();
            // console.log(searchString, '--------', dataSetString, dataSetString.indexOf(searchString) !== -1)
            return dataSetString.indexOf(searchString) !== -1;
          }
        );
        // console.log('----filteredDataSet-----', filteredDataSet)
        // if(_.isEmpty(filteredDataSet)){
        //   filteredDataSet = _.groupBy(this.state.filteredDataSetGroup, 'DataSubSetId')
        // }else {
        //   filteredDataSet = _.groupBy(filteredDataSet.flat(), 'DataSubSetId')
        // }
        this.setState({
          filteredDataSetGroup: filteredDataSet,
        });
      }
    );
  };

  handleSubmit = () => {
    const {
      datasetName,
      datasetDesc,
      datasetOwner,
      publishedBy,
      publishedDate,
      files,
      selectedDataSet,
    } = this.state;

    const formData = new FormData();
    formData.append("dataSetName", datasetName);
    formData.append("dataSetDescription", datasetDesc);
    formData.append("dataSetOwner", datasetOwner);
    formData.append("dataSetHierarchy", JSON.stringify(Object.values(selectedDataSet).flat()))
    formData.append("publishedBy", publishedBy);
    formData.append("publishedDate", publishedDate);
    files.forEach(file=>formData.append("datafile", file))

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }

    fetch("http://localhost:7898/upload-file", {
      method: "POST",
      body: formData,
    }).then(res=>{
      if (res.status >= 200 && res.status <= 299) {
        this.setState({
          successToast: true
        })
      } else {
        throw Error(res.message);
      }
    }).catch(err=>{
      this.setState({
        errorToast: true
      })
    })
  };

  render() {
    const { classes } = this.props;
    const {
      dataSetGroup,
      domainData,
      subDomainData,
      categoriesData,
      dataSet,
      selectedDomain,
      selectedSubDomain,
      selectedDataCategory,
      selectedDataSet,
      searchVal,
      filteredDataSetGroup,
      datasetName,
      datasetDesc,
      datasetOwner,
      publishedBy,
      publishedDate,
      successToast,
      errorToast
    } = this.state;
    return (
      <div>
        <Dialog
          fullScreen
          open={this.props.open}
          onClose={this.props.handleModal}
          TransitionComponent={Transition}
        >
          {/* <Dialog
          fullScreen
          fullWidth={true}
          classes={{ paper: classes.dialogPaper }}
          maxWidth={'lg'}
          onClose={this.props.handleModal}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
        > */}
          <DialogTitle
            id="customized-dialog-title"
            onClose={this.props.handleModal}
            classes={classes}
          >
            Add New API Data
          </DialogTitle>
          <DialogContent dividers>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%",
                  marginRight: -20,
                  // alignItems: "space-around",
                }}
              >
                <div style={{ width: "90%", margin: 10 }}>
                  <Typography
                    component="h1"
                    style={{ fontSize: 20, fontWeight: 500 }}
                  >
                    Dataset Details
                  </Typography>
                  <Divider
                    orientation="horizontal"
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div style={{ margin: 10 }}>
                  <TextField
                    size={"small"}
                    label="Profile Name"
                    value={datasetName}
                    onChange={(e) =>
                      this.setState({ datasetName: e.target.value })
                    }
                    variant="outlined"
                    style={{
                      width: "90%",
                    }}
                  />
                </div>
                <div style={{ margin: 10 }}>
                  <TextField
                    multiline
                    value={datasetDesc}
                    onChange={(e) =>
                      this.setState({ datasetDesc: e.target.value })
                    }
                    rows={4}
                    style={{
                      width: "90%",
                    }}
                    size={"small"}
                    label="Profile Description"
                    variant="outlined"
                  />
                </div>
                <div style={{ margin: 10 }}>
                  <TextField
                    value={datasetOwner}
                    onChange={(e) =>
                      this.setState({ datasetOwner: e.target.value })
                    }
                    style={{
                      width: "90%",
                    }}
                    size={"small"}
                    label="Owner"
                    variant="outlined"
                  />
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "90%",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                > */}
                <div style={{ margin: 10 }}>
                  <TextField
                    size={"small"}
                    value={publishedBy}
                    onChange={(e) =>
                      this.setState({ publishedBy: e.target.value })
                    }
                    style={{
                      width: "90%",
                    }}
                    label="Published By"
                    variant="outlined"
                  />
                </div>
                <div style={{ margin: 10 }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disabled={true}
                      size={"small"}
                      autoOk
                      style={{ width: "90%" }}
                      variant="inline"
                      inputVariant="outlined"
                      label="Published Date"
                      format="dd/MM/yyyy"
                      value={publishedDate}
                      InputAdornmentProps={{ position: "end" }}
                      onChange={(date) =>
                        this.setState({
                          publishedDate: date,
                        })
                      }
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div style={{ margin: 10 }}>
                  <DropzoneArea
                    classes={{
                      root: classes.dropzoneArea,
                    }}
                    filesLimit={5}
                    showPreviews={true}
                    onChange={this.handleChange}
                    showPreviewsInDropzone={false}
                    useChipsForPreview
                    previewGridProps={{
                      container: { direction: "row" },
                    }}
                    previewChipProps={{
                      classes: { root: classes.previewChip },
                    }}
                    previewText="Selected files"
                  />
                </div>
                {/* </div> */}
              </div>
              <Divider orientation="vertical" flexItem />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "70%",
                  marginLeft: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 20,
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ margin: 10, width: "30%", marginLeft: 0 }}>
                    <CustomAutoComplete
                      multiple={true}
                      width={"100%"}
                      label={"Select Dataset"}
                      data={domainData}
                      selectedValue={selectedDomain}
                      onDataSelect={this.handleDomainChange}
                    />
                  </div>
                  <div style={{ margin: 10, width: "30%" }}>
                    <CustomAutoComplete
                      multiple={true}
                      width={"100%"}
                      label={"Select Profile"}
                      data={subDomainData}
                      selectedValue={selectedSubDomain}
                      onDataSelect={this.handleSubDomainChange}
                    />
                  </div>
                  <div style={{ margin: 10, width: "30%" }}>
                    <CustomAutoComplete
                      multiple={true}
                      width={"100%"}
                      label={"Select Category"}
                      data={categoriesData}
                      selectedValue={selectedDataCategory}
                      onDataSelect={this.handleDataCategoryChange}
                    />
                  </div>
                  {/* <div style={{ margin: 10, marginLeft: 0 }}>
                <CustomAutoComplete 
                  multiple={true}
                  label={'Select Business Entity'} 
                  data={dataSet} 
                  selectedValue={selectedDataSet}
                  onDataSelect={this.handleDataSetChange}
                />
              </div> */}
                </div>
                <Typography
                  component="h1"
                  style={{ fontSize: 20, fontWeight: 500 }}
                >
                  Associated Profiles
                </Typography>
                <Divider
                  orientation="horizontal"
                  style={{ marginBottom: 20 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ width: "48%" }}>
                    <Paper elevation={3} className={classes.paperRoot}>
                      <Paper
                        elevation={5}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          height: 50,
                        }}
                      >
                        <InputBase
                          className={classes.input}
                          value={searchVal}
                          onChange={this.handleSearch}
                          placeholder="Search Profile"
                          inputProps={{ "aria-label": "search google maps" }}
                        />
                        <IconButton
                          className={classes.iconButton}
                          aria-label="search"
                        >
                          <SearchIcon />
                        </IconButton>
                      </Paper>
                      <ScrollableList
                        data={filteredDataSetGroup}
                        hasChecked={true}
                        handleDataSetSelect={this.handleDataSetSelect}
                        checkedData={selectedDataSet}
                        height={300}
                      />
                    </Paper>
                  </div>
                  <div style={{ width: "48%" }}>
                    <Paper elevation={3} className={classes.paperRoot}>
                      <Paper
                        elevation={5}
                        style={{
                          display: "flex",
                          height: 50,
                          alignItems: "center",
                          paddingLeft: 10,
                        }}
                      >
                        <Typography component="h1" style={{ fontSize: 16 }}>
                          Added Profiles
                        </Typography>
                      </Paper>
                      <ScrollableList
                        data={selectedDataSet}
                        handleDataSetSelect={this.handleDataSetSelect}
                        height={300}
                      />
                    </Paper>
                  </div>
                </div>
                <div style={{ marginTop: 20 }}>
                  <Typography
                    component="h1"
                    style={{ fontSize: 20, fontWeight: 500 }}
                  >
                    Related Datasets
                  </Typography>
                  <Divider
                    orientation="horizontal"
                    style={{ marginBottom: 20 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "30%",
                      }}
                    >
                      <div style={{ margin: "0px 0px 10px 0px" }}>
                        {/* <TextField
                      size={"small"}
                      label="Related Dataset"
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                    /> */}
                        <Autocomplete
                          id="related-dataset"
                          options={relatedDatasets}
                          size={"small"}
                          disableClearable
                          // disableCloseOnSelect
                          getOptionLabel={(option) => option.title}
                          style={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Related Dataset"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div style={{ margin: "10px 0px" }}>
                        <TextField
                          multiline
                          rows={5}
                          style={{
                            width: "100%",
                          }}
                          size={"small"}
                          label="How is it related?"
                          variant="outlined"
                        />
                      </div>
                      <div style={{ margin: "10px 0px" }}>
                        <Button
                          variant="contained"
                          style={{ width: "100%" }}
                          className={classes.buttonContainer}
                        >
                          Add Related Dataset
                        </Button>
                      </div>
                    </div>
                    <div style={{ height: 300, width: "65%" }}>
                      <DataSetTable />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.buttonContainer}
              variant="contained"
              autoFocus
              onClick={this.handleSubmit}
            >
              SUBMIT
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          id='successToast'
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          // style={{backgroundColor: 'green', color: 'white'}}
          open={successToast}
          autoHideDuration={3000}
          onClose={()=>this.setState({successToast: false})}
        >
          <Alert onClose={()=>this.setState({successToast: false})} severity="success">
            Dataset uplaoded successfully
          </Alert>
        </Snackbar>

        <Snackbar
          id='errorToast'
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          // style={{backgroundColor: 'red', color: 'white'}}
          open={errorToast}
          autoHideDuration={3000}
          onClose={()=>this.setState({errorToast: false})}
        >
          <Alert onClose={()=>this.setState({errorToast: false})} severity="error">
          Error uploading dataset. Please try again
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(useStyles)(CustomModal);
