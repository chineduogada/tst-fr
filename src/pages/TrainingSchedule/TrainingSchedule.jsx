import React from 'react';
import { withRouter } from 'react-router-dom';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import httpService from '../../services/httpService';
import currency from '../../helpers/currency';
import Section from '../../hoc/Section/Section';
import InformationBlock from '../../components/InformationBlock/InformationBlock';
import SideDraw from '../../components/SideDraw/SideDraw';
import Modal from '../../components/Modal/Modal';
import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import classes from './TrainingSchedule.module.scss';

class TrainingSchedule extends Form {
  constructor(props) {
    super(props);

    this.id = this.props.match.params.id;

    this.state = {
      actualData: null,
      dataForView: null,
      authorisors: null,

      showForm: false,
      showModal: false,

      formData: {
        lYear: '',
        trainingTypeId: '',
        ippisNo: '',
        objective: '',
        expectedStartDate: '',
        expectedEndDate: '',
        expectedCost: '',
        expectedAttendeeNo: '',
        actualStartDate: '',
        actualEndDate: '',
        actualCost: '',
        actualAttendeeNo: '',
        resourceOrg: '',
        email: '',
        mainResourcePerson: '',
        residential: '',
        approved: '',
        authorisor1Id: '',
        authorisor2Id: '',
        reportSubmitted: '',
        objectiveMet: ''
      },

      rowToPreview: null,

      isDeleteting: false,

      errors: {}
    };

    this.initialFormState = { ...this.state.formData };

    this.closeSideDraw = this.closeSideDraw.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
    this.handleUpdateBtnClick = this.handleUpdateBtnClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleProceedDelete = this.handleProceedDelete.bind(this);
    this.deleteObject = this.deleteObject.bind(this);
    this.approveSchedule = this.approveSchedule.bind(this);
    this.handleViewEmployee = this.handleViewEmployee.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  schema = {
    lYear: Joi.string(),
    trainingTypeId: Joi.number(),
    ippisNo: Joi.number(),
    objective: Joi.string(),
    expectedStartDate: Joi.string(),
    expectedEndDate: Joi.string(),
    expectedCost: Joi.number(),
    expectedAttendeeNo: Joi.number(),
    actualStartDate: Joi.string(),
    actualEndDate: Joi.string(),
    actualCost: Joi.number(),
    actualAttendeeNo: Joi.number(),
    resourceOrg: Joi.string(),
    email: Joi.string(),
    mainResourcePerson: Joi.string(),
    residential: Joi.string(),
    approved: Joi.string(),
    authorisor1Id: Joi.number(),
    authorisor2Id: Joi.number(),
    reportSubmitted: Joi.string(),
    objectiveMet: Joi.string()
  };

  async fetchTraining() {
    const res = await httpService.get(`/training-schedules/${this.id}`);

    if (res) {
      this.setState({
        actualData: this.filterReturnedData(res.data.data),
        dataForView: this.mapDataForView(res.data.data),
        authorisors: this.mapAuthorisors(res.data.data)
      });
    }
  }

  async componentDidMount() {
    await this.fetchTraining();
  }

  closeSideDraw(e) {
    this.setState({ showForm: false, rowToPreview: null });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  mapAuthorisors(data) {
    return [
      {
        name: 'authorisor 1',
        value: `${data.employee.firstName} ${data.authorisor1.lastName}`
      },
      {
        name: 'authorisor 2',
        value: `${data.employee.firstName} ${data.authorisor2.lastName}`
      }
    ];
  }

  mapDataForView(data) {
    return [
      { name: 'l year', value: data.lYear },
      { name: 'ippisNo', value: data.ippisNo },
      {
        name: 'full name',
        value: `${data.employee.firstName} ${data.employee.lastName}`
      },
      { name: 'training type', value: data.trainingType.type },
      { name: 'resource organisation', value: data.resourceOrg },
      {
        name: 'expected start date',
        value: data.expectedStartDate
      },
      {
        name: 'expected end date',
        value: data.expectedEndDate
      },
      { name: 'expected cost', value: currency(data.expectedCost) },
      {
        name: 'expected attendee no',
        value: data.expectedAttendeeNo
      },
      {
        name: 'actual start date',
        value: data.actualStartDate || null
      },
      {
        name: 'actual start date',
        value: data.actualEndDate || null
      },
      { name: 'actual cost', value: currency(data.actualCost) || null },
      {
        name: 'actual attendee no',
        value: data.actualAttendeeNo || null
      },
      { name: 'email', value: data.email },
      {
        name: 'main resource person',
        value: data.mainResourcePerson
      },
      {
        name: 'report submitted',
        value: data.reportSubmitted
      },
      { name: 'residential', value: data.residential },
      { name: 'approved', value: data.approved },
      { name: 'objective met', value: data.objectiveMet }
    ];
  }

  filterReturnedData(data) {
    return {
      lYear: data.lYear,
      ippisNo: data.ippisNo,
      resourceOrg: data.resourceOrg,
      trainingTypeId: data.trainingType.id,
      objective: data.objective,
      expectedStartDate: data.expectedStartDate,
      expectedEndDate: data.expectedEndDate,
      expectedCost: data.expectedCost,
      expectedAttendeeNo: data.expectedAttendeeNo,
      actualStartDate: data.actualStartDate,
      actualEndDate: data.actualEndDate,
      actualCost: data.actualCost,
      actualAttendeeNo: data.actualAttendeeNo,
      email: data.email,
      mainResourcePerson: data.mainResourcePerson,
      authorisor1Id: data.authorisor1.ippisNo,
      authorisor2Id: data.authorisor2.ippisNo,
      reportSubmitted: data.reportSubmitted,
      residential: data.residential,
      approved: data.approved,
      objectiveMet: data.objectiveMet
    };
  }

  handlePageChange = page => {
    if (page) {
      this.setState({ currentPage: page });
    }
  };

  resetFormData() {
    this.setState({ formData: this.initialFormState });
  }

  handleUpdateBtnClick(event) {
    this.setState({ showForm: true, formData: this.state.actualData });
  }

  async updateDatabase(stopProcessing) {
    const res = await httpService.put(
      `/training-schedules/${this.id}`,
      this.state.formData
    );

    if (res) {
      await this.fetchTraining();
      toast.success('TrainingSchedule successfully updated!');
      this.stopProcessing();
      this.closeSideDraw();
      this.resetFormData();
    }
  }

  async deleteObject() {
    this.setState({ isDeleteting: true });
    const res = await httpService.delete(`/training-schedules/${this.id}`);

    if (res) {
      toast.success('Training schedule successfully deleted!');
      this.props.history.push('/training-schedules');
      this.closeSideDraw();
    }
  }

  handleProceedDelete() {
    this.deleteObject();
  }

  async handleDelete(event) {
    this.setState({ showModal: true });
  }

  async approveSchedule() {
    if (!this.isApproved()) {
      await this.setState({
        formData: { ...this.state.actualData, approved: 'Y' }
      });

      console.log(this.state.formData);
      await this.updateDatabase();
    }
  }

  handleViewEmployee({ currentTarget }) {
    this.props.history.push(`/employee/${currentTarget.id}`);
  }

  async doSubmit(event, stopProcessing) {
    return this.updateDatabase(stopProcessing);
  }

  renderUpdateForm() {
    const { actualData } = this.state;

    return (
      <div className={classes.Preview}>
        <form
          ref={form => (this.updateForm = form)}
          onSubmit={this.handleSubmit}
        >
          {this.renderInput('l year', 'lYear', null, actualData.lYear, 'date')}
          {this.renderSelect('training type', 'trainingTypeId', [
            { id: 1, name: 'corporate' },
            { id: 2, name: 'community' }
          ])}
          {this.renderTextArea(
            'objective',
            'objective',
            null,
            actualData.objective
          )}
          {this.renderInput(
            'expected start date',
            'expectedStartDate',
            null,
            actualData.expectedStartDate,
            'date'
          )}
          {this.renderInput(
            'expected end date',
            'expectedEndDate',
            null,
            actualData.expectedEndDate,
            'date'
          )}
          {this.renderInput(
            'expected cost',
            'expectedCost',
            null,
            actualData.expectedCost,
            'number'
          )}
          {this.renderInput(
            'expected attendee no',
            'expectedAttendeeNo',
            null,
            actualData.expectedAttendeeNo,
            'number'
          )}
          {this.renderInput(
            'actual start date',
            'actualStartDate',
            null,
            actualData.actualStartDate,
            'date'
          )}
          {this.renderInput(
            'actual end date',
            'actualEndDate',
            null,
            actualData.actualEndDate,
            'date'
          )}
          {this.renderInput(
            'actual cost',
            'actualCost',
            null,
            actualData.actualCost,
            'number'
          )}
          {this.renderInput(
            'actual attendee no',
            'actualAttendeeNo',
            null,
            actualData.actualAttendeeNo,
            'number'
          )}
          {this.renderInput(
            'resource organisation',
            'resourceOrg',
            null,
            actualData.resourceOrg
          )}
          {this.renderInput('email', 'email', null, actualData.email, 'email')}
          {this.renderInput(
            'main resource person',
            'mainResourcePerson',
            null,
            actualData.mainResourcePerson
          )}
          {this.renderInput(
            'authorisor 1',
            'authorisorId1',
            'enter ippis..',
            actualData.authorisor1Id,
            'number'
          )}
          {this.renderInput(
            'authorisor 2',
            'authorisorId2',
            'enter ippis..',
            actualData.authorisor2Id,
            'number'
          )}
          {this.renderSelect('residential', 'residential', [
            { id: 'Y', name: 'Y' },
            { id: 'N', name: 'N' }
          ])}
          {this.renderSelect('report submitted', 'reportSubmitted', [
            { id: 'Y', name: 'Y' },
            { id: 'N', name: 'N' }
          ])}
          {this.renderSelect('objective met', 'objectiveMet', [
            { id: 'Y', name: 'Y' },
            { id: 'N', name: 'N' }
          ])}
          {this.renderButton('update')}
        </form>
      </div>
    );
  }

  isApproved() {
    return this.state.actualData.approved.toLowerCase() === 'y';
  }

  displayInfo(data) {
    return data.map((d, i) => {
      return (
        <div className={classes.DisplayInfo} key={i}>
          <p>{d.name}:</p>
          <span>{d.value}</span>
        </div>
      );
    });
  }

  render() {
    const {
      showForm,
      showModal,
      actualData,
      dataForView,
      authorisors
    } = this.state;

    return (
      <React.Fragment>
        {actualData ? (
          <Section title='training schedule'>
            <div className={`${classes.Actions} ${classes.Right}`}>
              <Button
                label={this.isApproved() ? 'approved' : 'approve'}
                highlight
                disabled={this.isApproved()}
                onClick={this.approveSchedule}
              />
              <Button label='update' fill onClick={this.handleUpdateBtnClick} />
              <Button label='delete' danger onClick={this.handleDelete} />
              <Button
                label='view employee'
                plain
                onClick={this.handleViewEmployee}
                id={actualData.ippisNo}
              />
            </div>

            <InformationBlock title='basic'>
              {this.displayInfo(dataForView)}
            </InformationBlock>

            <div className={`${classes.Actions} ${classes.Right}`}>
              <Button
                label='view authorisor 1'
                plain
                onClick={this.handleViewEmployee}
                id={actualData.authorisor1Id}
              />
              <Button
                label='view authorisor 2'
                plain
                onClick={this.handleViewEmployee}
                id={actualData.authorisor2Id}
              />
            </div>

            <InformationBlock title='authorisors'>
              {this.displayInfo(authorisors)}
            </InformationBlock>

            <InformationBlock title='objective'>
              {actualData.objective}
            </InformationBlock>

            <SideDraw
              title='schedule'
              openDraw={showForm}
              onClose={this.closeSideDraw}
            >
              {this.renderUpdateForm()}
            </SideDraw>

            <Modal
              title='delete schedule'
              openModal={showModal}
              onClose={this.closeModal}
            >
              <p>This operation can not be reversed. Proceed?</p>
              <div className={`${classes.Actions} ${classes.Right}`}>
                <Button
                  label='proceed'
                  danger
                  onClick={this.handleProceedDelete}
                  disabled={this.state.isDeleteting}
                />
              </div>
            </Modal>
          </Section>
        ) : (
          <Loader message='please wait' />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(TrainingSchedule);
