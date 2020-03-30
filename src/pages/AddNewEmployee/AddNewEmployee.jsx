import React from 'react';
import Section from '../../hoc/Section/Section';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Form from '../../components/Form/Form';
import InformationBlock from '../../components/InformationBlock/InformationBlock';
import http from '../../services/httpService';
import httpService from '../../services/httpService';
import nameMapper from './../../helpers/nameMapper';
import PageNotice from '../../components/PageNotice/PageNotice';
import EmployeeVerifier from '../../components/EmployeeVerifier/EmployeeVerifier';
import Loader from '../../components/Loader/Loader';

export default class AddNewEmployee extends Form {
  constructor(props) {
    super(props);

    this.handleEmployeeSelection = this.handleEmployeeSelection.bind(this);
    this.handleEmployeeInputChange = this.handleEmployeeInputChange.bind(this);
    this.handleIppisResponseRecieved = this.handleIppisResponseRecieved.bind(
      this
    );
    this.handleNrcNoResponseRecieved = this.handleNrcNoResponseRecieved.bind(
      this
    );
  }

  state = {
    formData: {
      // BASIC INFORMATION FORM DATA
      ippisNo: '',
      firstName: '',
      lastName: '',
      middleNames: '',
      initials: '',
      dateOfBirth: '',
      phoneNumber: '',
      countryOfBirthId: '',
      nationalityId: '',
      email: '',
      pfaNumber: '',
      pfaId: '',
      genderId: '',
      bloodGroupId: '',
      gpzId: '',
      lgaId: '',
      maritalStatusId: '',
      senatorialDistrictId: '',
      professional: '',
      stateId: '',
      address: '',

      // JOB INFORMATION FORM DATA
      departmentId: '',
      sectionId: '',
      districtId: '',
      // location: '',
      reportTo: '',
      employeeStatusId: '',
      pensionable: '',

      // APPOINTMENT INFORMATION FORM DATA
      firstAppointmentDate: '',
      resumptionDate: '',
      confirmationDate: '',
      presentAppointmentDate: '',
      firstAppointmentJobTypeId: '',
      firstAppointmentJobTitleId: '',
      firstAppointmentGradeId: '',
      firstAppointmentStepId: '',
      presentPositionJobTypeId: '',
      presentPositionJobTitleId: '',
      presentPositionGradeId: '',
      presentPositionStepId: ''
    },

    errors: {},

    optionsFetched: false,

    departmentOptions: [],
    districtOptions: [],
    genderOptions: [],
    bloodGroupOptions: [],
    jobTypeOptions: [],
    jobTitleOptions: [],
    jobGradeOptions: [],
    jobStepOptions: [],
    pfaOptions: [],
    gpzOptions: [],
    maritalStatusOptions: [],
    senatorialDistrictOptions: [],
    stateOptions: [],
    lgaOptions: [],
    countryOptions: [],
    sectionOptions: [],
    stepOptions: [],
    salaryStructureOptions: [],
    employeeStatusOptions: [],

    ippisNoVerified: false,
    nrcNoVerified: false
  };

  async componentDidMount() {
    const [
      departments,
      districts,
      bloodGroups,
      jobTypes,
      jobTitles,
      jobGrades,
      pfa,
      gpz,
      maritalStatuses,
      senatorialDistricts,
      states,
      lga,
      countries,
      sections,
      steps,
      genders,
      salaryStructures,
      employeeStatuses
    ] = await httpService.all([
      httpService.get('/departments?statusId=1'),
      httpService.get('/districts?statusId=1'),
      httpService.get('/blood-groups'),
      httpService.get('/job-types?statusId=1'),
      httpService.get('/job-titles?statusId=1'),
      httpService.get('/job-grades'),
      httpService.get('/pfa?statusId=1'),
      httpService.get('/gpz'),
      httpService.get('/marital-statuses'),
      httpService.get('/senatorial-districts'),
      httpService.get('/states'),
      httpService.get('/lga'),
      httpService.get('/countries'),
      httpService.get('/sections?statusId=1'),
      httpService.get('/steps'),
      httpService.get('/genders'),
      httpService.get('/salary-structures'),
      httpService.get('/employee-statuses')
    ]);

    if (departments) {
      this.setState({
        departmentOptions: nameMapper(departments.data.data, 'description'),
        districtOptions: nameMapper(districts.data.data, 'siteName'),
        bloodGroupOptions: nameMapper(bloodGroups.data.data, 'type'),
        jobTypeOptions: nameMapper(jobTypes.data.data, 'type'),
        jobTitleOptions: nameMapper(jobTitles.data.data, 'description'),
        jobGradeOptions: nameMapper(jobGrades.data.data, 'con'),
        pfaOptions: nameMapper(pfa.data.data, 'name'),
        gpzOptions: nameMapper(gpz.data.data, 'description'),
        lgaOptions: nameMapper(lga.data.data, 'lga'),
        maritalStatusOptions: nameMapper(maritalStatuses.data.data, 'status'),
        senatorialDistrictOptions: nameMapper(
          senatorialDistricts.data.data,
          'name'
        ),
        stateOptions: nameMapper(states.data.data, 'state'),
        countryOptions: nameMapper(countries.data.data, 'country'),
        sectionOptions: nameMapper(sections.data.data, 'description'),
        jobStepOptions: nameMapper(steps.data.data, 'step'),
        genderOptions: nameMapper(genders.data.data, 'type'),
        salaryStructureOptions: nameMapper(
          salaryStructures.data.data,
          'description'
        ),
        employeeStatusOptions: nameMapper(
          employeeStatuses.data.data,
          'description'
        ),
        optionsFetched: true
      });
    }
  }

  schema = {
    // BASIC INFORMATION SCHEMA
    ippisNo: Joi.string()
      .min(5)
      .max(6)
      .required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    middleNames: Joi.string(),
    initials: Joi.string()
      .allow('')
      .optional(),
    dateOfBirth: Joi.string(),
    phoneNumber: Joi.number(),
    countryOfBirthId: Joi.number(),
    nationalityId: Joi.number(),
    email: Joi.string()
      .email()
      .allow('')
      .optional(),
    pfaNumber: Joi.number(),
    pfaId: Joi.number(),
    genderId: Joi.number(),
    bloodGroupId: Joi.number(),
    gpzId: Joi.number(),
    lgaId: Joi.number(),
    maritalStatusId: Joi.number(),
    senatorialDistrictId: Joi.number(),
    stateId: Joi.number(),
    professional: Joi.string(),
    address: Joi.string()
      .allow('')
      .optional(),

    // JOB INFORMATION SCHEMA

    departmentId: Joi.number(),
    districtId: Joi.number(),
    sectionId: Joi.number(),
    salaryStructureId: Joi.number(),
    // location: Joi.string(),
    reportTo: Joi.number()
      .allow('')
      .optional(),
    employeeStatusId: Joi.number(),
    pensionable: Joi.string(),

    // APPOINTMENT INFORMATION SCHEMA
    firstAppointmentDate: Joi.string(),
    resumptionDate: Joi.string(),
    confirmationDate: Joi.string(),
    presentAppointmentDate: Joi.string(),
    firstAppointmentJobTypeId: Joi.number(),
    firstAppointmentJobTitleId: Joi.number(),
    firstAppointmentGradeId: Joi.number(),
    firstAppointmentStepId: Joi.number(),
    presentPositionJobTypeId: Joi.number(),
    presentPositionJobTitleId: Joi.number(),
    presentPositionGradeId: Joi.number(),
    presentPositionStepId: Joi.number()
  };

  handleEmployeeSelection() {
    this.setState({ reportToVerified: true });
  }

  handleEmployeeInputChange(employee) {
    const condition =
      `${this.reportTo.value}`.length > 5 &&
      `${this.reportTo.value}`.length <= 6;
    if (!employee || !condition) {
      this.setState({ reportToVerified: false });
    }
  }

  handleIppisResponseRecieved(employees) {
    console.log('ippis character length', this.ippisNo);
    if (
      !employees.length &&
      `${this.ippisNo.value}`.length >= 5 &&
      `${this.ippisNo.value}`.length <= 6
    ) {
      this.setState({ ippisNoVerified: true });
    } else {
      this.setState({ ippisNoVerified: false });
    }
  }

  handleNrcNoResponseRecieved(employees) {
    if (!employees.length) {
      this.state.errors['nrcNo'] = 'NRC number already exists';
      this.setState({ nrcNoVerified: true });
    } else {
      this.setState({ nrcNoVerified: false });
    }
  }

  resetFormData() {
    this.setState({ formData: this.initialFormState });
  }

  async doSubmit(event, stopProcessing) {
    const res = await http.post('/employees', this.state.formData);
    stopProcessing();

    console.log(res);
    if (res) {
      toast.success('Employee successfully registered!');
      this.Form.reset();
      this.resetFormData();
      this.ippisNo.focus();
    }
  }

  render() {
    const { nrcNoVerified, ippisNoVerified, formData } = this.state;

    return this.state.optionsFetched ? (
      <Section title="add new employee">
        <PageNotice>
          Clicking the "save" button saves the data then clears the form to add
          another employee. Click "proceed to profile" button to save and
          redirect to the employee's profile
        </PageNotice>
        <form onSubmit={this.handleSubmit} ref={form => (this.Form = form)}>
          <InformationBlock title="">
            <EmployeeVerifier
              preventDefault
              checkOnResponseRecieved={employees => !employees.length}
              onResponseReceived={this.handleIppisResponseRecieved}
            >
              {this.renderInput(
                'IPPIS No.',
                'ippisNo',
                'Please enter a valid IPPIS number',
                null,
                'number'
              )}
            </EmployeeVerifier>
          </InformationBlock>

          {ippisNoVerified ? (
            <>
              <InformationBlock title="basic information">
                {this.renderInput('first Name', 'firstName')}
                {this.renderInput('last Name', 'lastName')}
                {this.renderInput('middle Names', 'middleNames')}
                {this.renderInput('initials', 'initials')}
                {this.renderInput(
                  'date of birth',
                  'dateOfBirth',
                  null,
                  null,
                  'date'
                )}
                {this.renderInput(
                  'phone number',
                  'phoneNumber',
                  null,
                  null,
                  'number'
                )}
                {this.renderInput('email', 'email', null, null, 'email')}

                {this.renderSelect(
                  'pension fund administrator',
                  'pfaId',
                  this.state.pfaOptions
                )}

                {this.renderInput(
                  'PFA number',
                  'pfaNumber',
                  null,
                  null,
                  'number'
                )}

                {this.renderSelect(
                  'gender',
                  'genderId',
                  this.state.genderOptions
                )}
                {this.renderSelect(
                  'blood group',
                  'bloodGroupId',
                  this.state.bloodGroupOptions
                )}
                {this.renderSelect(
                  'marital status',
                  'maritalStatusId',
                  this.state.maritalStatusOptions
                )}
                {this.renderSelect(
                  'country of birth',
                  'countryOfBirthId',
                  this.state.countryOptions
                )}
                {this.renderSelect(
                  'nationality',
                  'nationalityId',
                  this.state.countryOptions
                )}
                {this.renderSelect('GPZ', 'gpzId', this.state.gpzOptions)}
                {this.renderSelect('state', 'stateId', this.state.stateOptions)}
                {this.renderSelect(
                  'senatorial district',
                  'senatorialDistrictId',
                  this.state.senatorialDistrictOptions
                )}
                {this.renderSelect('LGA', 'lgaId', this.state.lgaOptions)}
                {this.renderSelect('professional', 'professional', [
                  { id: 'Y', name: 'Y' },
                  { id: 'N', name: 'N' }
                ])}
                {this.renderInput('address', 'address', null)}
              </InformationBlock>

              <InformationBlock title="job information">
                {this.renderInput(
                  `who ${this.state.formData.firstName ||
                    'this employee'} reports to`,
                  'reportTo',
                  'Please enter a valid IPPIS number',
                  null,
                  'number'
                )}
                {this.renderSelect(
                  'section',
                  'sectionId',
                  this.state.sectionOptions
                )}
                {this.renderSelect(
                  'salary structure',
                  'salaryStructureId',
                  this.state.salaryStructureOptions
                )}
                {this.renderSelect(
                  'employee status',
                  'employeeStatusId',
                  this.state.employeeStatusOptions
                )}
                {this.renderSelect('pensionable', 'pensionable', [
                  { id: 'Y', name: 'Y' },
                  { id: 'N', name: 'N' }
                ])}
                {this.renderSelect(
                  'department',
                  'departmentId',
                  this.state.departmentOptions
                )}
                {this.renderSelect(
                  'district',
                  'districtId',
                  this.state.districtOptions
                )}
              </InformationBlock>

              <InformationBlock title="appointment information">
                {this.renderInput(
                  'first appointment date',
                  'firstAppointmentDate',
                  null,
                  null,
                  'date'
                )}
                {this.renderInput(
                  'resumption date',
                  'resumptionDate',
                  null,
                  null,
                  'date'
                )}
                {this.renderInput(
                  'confirmation date',
                  'confirmationDate',
                  null,
                  null,
                  'date'
                )}
                {this.renderInput(
                  'present appointment date',
                  'presentAppointmentDate',
                  null,
                  null,
                  'date'
                )}

                {this.renderSelect(
                  'first appointment job type',
                  'firstAppointmentJobTypeId',
                  this.state.jobTypeOptions
                )}
                {this.renderSelect(
                  'first appointment job title',
                  'firstAppointmentJobTitleId',
                  this.state.jobTitleOptions
                )}
                {this.renderSelect(
                  'first appointment grade',
                  'firstAppointmentGradeId',
                  this.state.jobGradeOptions
                )}
                {this.renderSelect(
                  'first appointment step',
                  'firstAppointmentStepId',
                  this.state.jobStepOptions
                )}
                {this.renderSelect(
                  'present position job type',
                  'presentPositionJobTypeId',
                  this.state.jobTypeOptions
                )}
                {this.renderSelect(
                  'present position job title',
                  'presentPositionJobTitleId',
                  this.state.jobTitleOptions
                )}
                {this.renderSelect(
                  'present position grade',
                  'presentPositionGradeId',
                  this.state.jobGradeOptions
                )}
                {this.renderSelect(
                  'present position step',
                  'presentPositionStepId',
                  this.state.jobStepOptions
                )}
              </InformationBlock>
            </>
          ) : null}

          {this.renderButton('save')}
          {/* {this.renderButton('proceed to profile')} */}
        </form>
      </Section>
    ) : (
      <Loader message="please wait..." />
    );
  }
}
