import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { getToken } from '../../services/Credentials';
import { Switch, Route } from 'react-router-dom';
import Nav from '../Nav/Nav';
import Aside from './Aside/Aside';
import MainArea from './MainArea/MainArea';
import classes from './Layout.module.scss';
import AllEmployees from '../../pages/AllEmployees/AllEmployees';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Department from '../../pages/Department/Department';
import Employee from '../../pages/Employee/Employee';
import AddNewEmployee from '../../pages/AddNewEmployee/AddNewEmployee';
import AllTrainingSchedules from '../../pages/AllTrainingSchedules/AllTrainingSchedules';
import TrainingSchedule from '../../pages/TrainingSchedule/TrainingSchedule';
import AllTrainingRecords from '../../pages/AllTrainingRecords/AllTrainingRecords';
import TrainingRecord from '../../pages/TrainingRecord/TrainingRecord';
import AllCareers from '../../pages/AllCareers/AllCareers';
import Career from '../../pages/Career/Career';
import AllSuccessions from '../../pages/AllSuccessions/AllSuccessions';
import Succession from '../../pages/Succession/Succession';
import AllJobIncidence from '../../pages/AllJobIncidence/AllJobIncidence';
import JobIncidence from '../../pages/JobIncidence/JobIncidence';
import Import from '../../pages/Import/Import';
import Users from '../../pages/Users/Users';
import UserProfile from '../../pages/UserProfile/UserProfile';
import Settings from '../../pages/Settings/Settings';
import Districts from '../../pages/Districts/Districts';
import StaticModels from '../../pages/StaticModels/StaticModels';
import PFA from '../../pages/PFA/PFA';
import JobTitles from '../../pages/JobTitles/JobTitles';
import JobTypes from '../../pages/JobTypes/JobTypes';
import TrainingTypes from '../../pages/TrainingTypes/TrainingTypes';
import Sections from '../../pages/Sections/Sections';
import CareerReasonCodes from '../../pages/CareerReasonCodes/CareerReasonCodes';
import IncidenceReasonCodes from '../../pages/IncidenceReasonCodes/IncidenceReasonCodes';
import Skills from '../../pages/Skills/Skills';
import Qualifications from '../../pages/Qualifications/Qualifications';

const Layout = ({ userLoggedIn, signOutHandler }) => {
  // set token
  const token = getToken();
  if (token) {
    axios.defaults.headers = {
      token
    };
  }

  const renderLayout = () => (
    <div className={classes.Layout}>
      {/* Aside */}
      <Aside />
      {/* Main Section */}
      <div className='d-flex flex-column' style={{ position: 'relative' }}>
        {/* Navigation */}
        <Nav triggerSignOut={signOutHandler} />
        <MainArea>
          {/* <AllEmployees /> */}
          <Switch>
            <Route path='/' exact component={Dashboard} />
            <Route
              path='/training-schedules'
              exact
              component={AllTrainingSchedules}
            />
            <Route
              path='/training-schedules/:id'
              exact
              component={TrainingSchedule}
            />
            <Route
              path='/training-records'
              exact
              component={AllTrainingRecords}
            />
            <Route
              path='/training-records/:id'
              exact
              component={TrainingRecord}
            />
            <Route path='/employees/' exact component={AllEmployees} />
            <Route path='/employees/new' exact component={AddNewEmployee} />
            <Route path='/employees/:ippisNo' exact component={Employee} />
            <Route path='/departments' component={Department} />
            <Route path='/careers' exact component={AllCareers} />
            <Route path='/careers/:id' exact component={Career} />
            <Route path='/job-incidence' exact component={AllJobIncidence} />
            <Route path='/job-incidence/:id' exact component={JobIncidence} />
            <Route path='/successions' exact component={AllSuccessions} />
            <Route path='/successions/:id' exact component={Succession} />
            <Route path='/import' exact component={Import} />
            <Route path='/users' exact component={Users} />
            <Route path='/profile' exact component={UserProfile} />
            <Route path='/settings' exact component={Settings} />
            <Route
              path='/settings/static-models'
              exact
              component={StaticModels}
            />
            <Route
              path='/settings/static-models/districts'
              exact
              component={Districts}
            />
            <Route path='/settings/static-models/pfa' exact component={PFA} />
            <Route
              path='/settings/static-models/job-titles'
              exact
              component={JobTitles}
            />
            <Route
              path='/settings/static-models/job-types'
              exact
              component={JobTypes}
            />
            <Route
              path='/settings/static-models/training-types'
              exact
              component={TrainingTypes}
            />
            <Route
              path='/settings/static-models/sections'
              exact
              component={Sections}
            />
            <Route
              path='/settings/static-models/career-reason-codes'
              exact
              component={CareerReasonCodes}
            />
            <Route
              path='/settings/static-models/incidence-reason-codes'
              exact
              component={IncidenceReasonCodes}
            />
            <Route
              path='/settings/static-models/skills'
              exact
              component={Skills}
            />
            <Route
              path='/settings/static-models/qualifications'
              exact
              component={Qualifications}
            />
          </Switch>
        </MainArea>
      </div>
    </div>
  );
  return userLoggedIn ? renderLayout() : <Redirect to='/' />;
};

export default Layout;
