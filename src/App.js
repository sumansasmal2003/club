import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Events from './components/Events';
import Members from './components/Members';
import Footer from './components/Footer';
import UserLogin from './components/UserLogin';
import MemberLogin from './components/MemberLogin';
import MemberDashboard from './components/MemberDashboard';
import PhotoUpload from './components/PhotoUpload';
import EventUploadForm from './components/EventUploadForm';
import SimpleEvents from './components/SimpleEvents';
import ManageEvent from './components/ManageEvent';
import ManageParticipatingEvent from './components/ManageParticipatingEvent';
import RegisteredUser from './components/RegisteredUser';
import ProfileChange from './components/ProfileChange';
import UserDashboard from './components/UserDashboard';
import ParticipateEvent from './components/ParticipateEvent';
import DeleteParticipant from './components/DeleteParticipant';
import UserProfileChange from './components/UserProfileChange';
import UserRecord from './components/UserRecord';
import AllRecords from './components/AllRecords';
import UserRegister from './components/UserRegister';
import MemberRegister from './components/MemberRegister';
import DeveloperLogin from './components/DeveloperLogin';
import DeveloperDashboard from './components/DeveloperDashboard';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container mx-auto mt-5 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/members" element={<Members />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path='/member-login' element={<MemberLogin />} />
            <Route path='/member-dashboard' element={<MemberDashboard />} />
            <Route path='/photo-upload' element={<PhotoUpload />} />
            <Route path='/upload-participating-event' element={<EventUploadForm />} />
            <Route path='/upload-simple-event' element={<SimpleEvents />} />
            <Route path='/manage-simple-event' element={<ManageEvent />} />
            <Route path='/manage-participating-event' element={<ManageParticipatingEvent />} />
            <Route path='/registered-users' element={<RegisteredUser />} />
            <Route path='/profile-change' element={<ProfileChange />} />
            <Route path='/user-dashboard' element={<UserDashboard />} />
            <Route path='/participate-events' element={<ParticipateEvent />} />
            <Route path='/delete-participant' element={<DeleteParticipant />} />
            <Route path='/chnge-prfle' element={<UserProfileChange />} />
            <Route path='/user-records' element={<UserRecord />} />
            <Route path='/all-records' element={<AllRecords />} />
            <Route path='/signup' element={<UserRegister />} />
            <Route path='/Membersignup' element={<MemberRegister />} />
            <Route path='/developer-login' element={<DeveloperLogin />} />
            <Route path='/developer-dashboard' element={<DeveloperDashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
