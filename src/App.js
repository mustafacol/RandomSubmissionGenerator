import React, { Component } from 'react';
//import logo, { ReactComponent } from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import { Row, Modal } from 'react-bootstrap';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'






class RandomSub extends Component {
  constructor(props) {
    super(props)

    this.state = {
      apiKey: null,
      formId: null,
      data: null,
      displayForm: true,
      displayQuestions: false,
      displayThankYou: false,
      selectedQuestions: [],
      selectedLanguage: null,
      submissionCount: null,
      showModal: false,
      buttonId: null,
      buttonIndex: null,
      languages: null,
      settingsButtonShow: []

    }

  }


  open = (buttonInfo, index) => {
    this.setState({
      showModal: true,
      buttonId: buttonInfo,
      buttonIndex: index
    });
  };

  close = () => {
    this.setState({ showModal: false });
  };


  handleSubmit = (event) => {
    event.preventDefault();
    Axios.get("https://api.jotform.com/form/" + this.state.formId + "/questions?apiKey=" + this.state.apiKey + "").then(res => {
      this.setState({ data: res.data.content, displayForm: false, displayQuestions: true });
      this.dataManupulation();
      this.getLanguages();

    })
  }

  dataManupulation = () => {
    const elements = ["control_pagebreak", "control_divider", "control_head", "control_collapse", "control_button", "control_widget"];
    const data = []

    Object.keys(this.state.data).map(i => {
      if (!elements.includes(this.state.data[i].type))
        data[i] = this.state.data[i];
    })

    this.setState({ data: data });
    console.log(this.state.data);
  }
  confirmQuestionDetails = (event, type) => {
    const data = [...this.state.selectedQuestions];
    const index = this.state.buttonIndex;
    switch (type) {
      case "control_number":
        data[index]['maxValue'] = this.refs.maximum.value;
        data[index]['minValue'] = this.refs.minimum.value;
        this.close();
        break;

      case "control_textbox":
        data[index]['maxsize'] = this.refs.maxCharacter.value;
        this.close();
        break;

      case "control_textarea":
        if (this.refs.letter.checked) {
          const limitMax = "Letters-" + this.refs.max.value;
          const limitMin = "Letters-" + this.refs.min.value;

          data[index]["entryLimit"] = limitMax;
          data[index]["entryLimitMin"] = limitMin;
        }
        else if (this.refs.word.checked) {
          const limitMax = "Words-" + this.refs.max.value;
          const limitMin = "Words-" + this.refs.min.value;

          data[index]["entryLimit"] = limitMax;
          data[index]["entryLimitMin"] = limitMin;
        }
        else {
          data[index]["entryLimit"] = "None-0";
          data[index]["entryLimitMin"] = "None-0";
        }
        this.close();
        break;

      default:
        break;
    }
    this.setState({ selectedQuestions: data });
  }
  questionDetailsManupulation = (value, e, type) => {
    const data = [...this.state.selectedQuestions];
    const index = this.state.buttonIndex;
    switch (type) {
      case "control_fullname":
      case "control_datetime":
        if (e.target.checked) {
          data[index][value] = "Yes"
        }
        else {
          data[index][value] = "No"
        }

        break;
      case "control_time":

        if (value === "range") {
          if (e.target.checked) {
            data[index][value] = "Yes"
          }
          else {
            data[index][value] = "No"
          }
        }
        else {
          const timeFormat = value.split(":");
          if (e.target.checked) {
            data[index][timeFormat[0]] = timeFormat[1];
          }
          else {
            data[index][timeFormat[0]] = "";
          }

        }
        break;






      default:
        break;
    }

    this.setState({ selectedQuestions: data });
    console.log(this.state.selectedQuestions);

  }

  popupContent = () => {
    switch (this.state.buttonId) {
      case "control_fullname":
        return (
          <div className="content mt-3">
            <Row>
              <div className="input-group mb-2" >
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input type="checkbox" value="prefix" onClick={(e) => this.questionDetailsManupulation(e.target.value, e, this.state.buttonId)}></input>
                  </div>
                </div>
                <div className="form-control">Prefix</div>
              </div>
            </Row>
            <Row>
              <div className="input-group mb-2" >
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input type="checkbox" value="middle" onClick={(e) => this.questionDetailsManupulation(e.target.value, e, this.state.buttonId)}></input>
                  </div>
                </div>
                <div className="form-control">Middle</div>
              </div>
            </Row>
            <Row>
              <div className="input-group mb-2" >
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input type="checkbox" value="suffix" onClick={(e) => this.questionDetailsManupulation(e.target.value, e, this.state.buttonId)}></input>
                  </div>
                </div>
                <div className="form-control">Suffix</div>
              </div>
            </Row>
          </div>
        )
        break;
      case "control_textbox":
        return (
          <div className="content">
            <Row>
              <label>Maximum Character:</label>
              <input ref="maxCharacter" className="form-control sm " type="text"></input>
              <input type="button" className="form-control btn-success" value="Confirm" onClick={(e) => this.confirmQuestionDetails(e, this.state.buttonId)}></input>
            </Row>
          </div>

        )
      case "control_textarea":
        return (
          <div className="content mt-3">
            <Row>
              <label>Limit Type:
              <input ref="word" type="radio" name="type" className="ml-2" value="Word"></input>
                <label>Word</label>
                <input ref="letter" type="radio" name="type" className="ml-2" value="Letter"></input>
                <label>Letter</label>
              </label>

            </Row>
            <Row>
              <label>Maximum:</label>
              <input ref="max" className="form-control sm " type="text"></input>
              <label>Minimum:</label>
              <input ref="min" className="form-control sm " type="text"></input>
              <input type="button" className="form-control btn-success" value="Confirm" onClick={(e) => this.confirmQuestionDetails(e, this.state.buttonId)}></input>
            </Row>

          </div>
        )

      case "control_number":
        return (
          <div className="content mt-3">
            <Row>

              <label>Maximum:</label>
              <input ref="maximum" className="form-control sm " type="text"></input>
              <label>Minimum:</label>
              <input ref="minimum" className="form-control sm " type="text"></input>
              <input type="button" className="form-control btn-success" value="Confirm" onClick={(e) => this.confirmQuestionDetails(e, this.state.buttonId)}></input>

            </Row>

          </div>




        )

      case "control_time":

        return (
          <div className="content mt-3">
            <Row>
              <label>Range:
              <input type="checkbox" className="ml-2" value="range" onClick={(e) => this.questionDetailsManupulation(e.target.value, e, this.state.buttonId)}></input>
                <label>Yes</label>
              </label>
            </Row>
            <Row>
              <label>Time Format:
              <input type="radio" name="timeFormat" value="timeFormat:24 Hour" className="ml-2" onClick={(e) => this.questionDetailsManupulation(e.target.value, e, this.state.buttonId)}></input>
                <label>24 Hour</label>
                <input type="radio" name="timeFormat" value="timeFormat:AM/PM" className="ml-2" onClick={(e) => this.questionDetailsManupulation(e.target.value, e, this.state.buttonId)}></input>
                <label>AM/PM</label>
              </label>
            </Row>

          </div>
        )

      case "control_datetime":
        return (
          <div className="content mt-3">
            <Row>
              <label>Allow Time:
              <input type="checkbox" value="allowTime" className="ml-2" onClick={(e) => this.questionDetailsManupulation(e.target.value, e, this.state.buttonId)}></input>
                <label>Yes</label>
              </label>
            </Row>
          </div>
        )



      default:
        break;
    }
  }
  displayPopup = () => {


    return (

      <div className="modal-example">

        <Modal
          onHide={this.close}
          aria-labelledby="modal-label"
          show={this.state.showModal}
          className="popup"
        >
          <div className="popupContainer">
            <h4 id="modal-label" className="text-center mt-3">Question Details</h4>

            {this.popupContent()}

          </div>
        </Modal>
      </div>
    )
  }
  checkedQuestionOperations = (e, data, index) => {
    const buttonElement = ["control_fullname", "control_datetime", "control_time", "control_textbox", "control_textarea", "control_number"];

    const selected = [...this.state.selectedQuestions];
    const settings = [...this.state.settingsButtonShow];


    if (e.target.checked) {
      selected[index] = data;
      if (buttonElement.includes(data.type)) {
        settings[index] = true;
      }


    }
    else {
      delete selected[index];
      if (buttonElement.includes(data.type)) {
        settings[index] = false;
      }

    }
    this.setState({ selectedQuestions: selected });
    this.setState({ settingsButtonShow: settings });


  }
  questionButtons = (question, index) => {
    if (this.state.settingsButtonShow[index] === true) {
      return (

        <button className="settingsButton" type="button" onClick={(e) => this.open(question.type, index)}>
          <img className="setting" src={require('./settings1.png')}></img>
        </button>
      )
    }
    else {
      return (
        null
      )
    }
  }

  displayQuestions = () => {
    const data = this.state.data;
    const questions = Object.keys(data).map(i => {
      return <Row >

        <div className="input-group mt-2 " >
          <div className="form-control" >{data[i].name}</div>
          <div className="form-control" >{data[i].type}</div>
          <div className="input-group-text">

            <input type="checkbox" aria-label="Checkbox for following text input" value={data[i]} onClick={(e) => this.checkedQuestionOperations(e, data[i], i)}></input>
          </div>
          {

            this.questionButtons(data[i], i)

          }
        </div>

      </Row>



    });
    return questions;
  }

  thankYouPape = () => {
    if (this.state.displayThankYou) {
      return (
        <div id="stage" className="form-all">
          <img src="https://cdn.jotfor.ms/img/check-icon.png"></img>
          <p></p>
          <div >
            <h1>Thank You!</h1>
            <p >Your submission has been received.</p>
            <p >You create {this.state.submissionCount} submissions.</p>
          </div>

          <a className="btn-success" href="http://localhost:3000" >Create New Submissions</a>
        </div>
      )




    }
  }

  displayLanguage = () => {
    const options = this.state.languages;
    return (
      <div>
        <Dropdown options={options} placeholder="Select a Language" value={this.state.selectedLanguage} onChange={(e) => this.setState({ selectedLanguage: e.value })}></Dropdown>

      </div>
    )

  }

  submitForm = () => {
    console.log(this.state.selectedQuestions);
    Axios({
      url: 'http://localhost/RandomSubGenerator/process.php',
      method: 'POST',
      data: {
        settings: this.state.selectedQuestions,
        submissionCount: this.state.submissionCount,
        apiKey: this.state.apiKey,
        formId: this.state.formId,
        language: this.state.selectedLanguage

      }
    }).then(res => {
      if (res.request.status === 200) {
        this.setState({ displayQuestions: false, displayThankYou: true });
      }

    })
  }

  getLanguages = () => {
    Axios.get("http://localhost/RandomSubGenerator/language.php").then(res => {
      this.setState({ languages: res.data.data });

    })

  }

  render() {

    return (

      <div className="App" >
        <header className="App-header">
          <h1 className="header">Random Submission Generator</h1>
          {this.state.displayQuestions === true ?
            <p>Please Select Question</p> : null}
          

        </header>
        <div className="container">
          <div className="form-group" id="information">
            {this.state.displayForm === true ?
              <div>
                <form onSubmit={this.handleSubmit}>
                  <Row>
                    <label>Api Key:</label>
                    <input className="form-control sm " name="apiKey" id="apiKey" type="text" required onChange={(e) => this.setState({ apiKey: e.target.value })}></input>
                  </Row>

                  <Row>
                    <label>Form Id:</label>
                    <input className="form-control" name="formId" id="formId " type="text" required onChange={(e) => this.setState({ formId: e.target.value })}></input>
                  </Row>
                  <Row>
                    <input type="submit" className="form-control btn-success" value="Get Questions"></input>
                  </Row>
                </form>



              </div> :
              null}

          </div>

        </div>

        <div className="questionContainer">


          {this.state.displayQuestions === true ?

            this.displayQuestions()
            : null

          }
          {this.state.displayQuestions === true ?

            <div>


              <label className="mt-3 ">
                Number of Submissions:
                <input type="text" name="subNumber" className="ml-3 sm" onChange={(e) => this.setState({ submissionCount: e.target.value })}></input>
              </label>
              {/* <Dropdown options={options}></Dropdown> */}

              <input type="button" className="form-control btn-success mt-3" value="Create Submissions" onClick={(e) => this.submitForm()}></input>

            </div> :
            null
          }

        </div>

        {this.displayPopup()}

        {this.thankYouPape()}




      </div>
    )
  }
}


export default RandomSub;
