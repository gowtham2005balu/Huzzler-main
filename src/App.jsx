import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";

import { useEffect } from "react";
// Auth Pages
import RoleSelect from "./pages/RoleSelect";
import RegisterStep1 from "./pages/Registerform/RegisterStep1";
import ClientRegisterStep1 from "./pages/Registerform/ClientRegister/ClientRegisterStep1";
import OTPVerify from "./pages/OTPVerify";
import ClientOtpVerify from "./pages/Clientotpverifiy/ClientOtpVerify";
import LoginSelect from "./pages/LoginForm/LoginSelect";

// Profile Setup
import Details1 from "./pages/Details1";
import Details2 from "./pages/Details2";
import ClientDetails1 from "./pages/Freelancerpage/Freelancerdetaildashpage/ClientDetails1";

import BuildProfile from "./pages/BuildProfile";
import AfterSubmitBuildProfile from "./pages/AfterSmbmiteBuildProfile";

// Freelancer Dashboard
import Dashboard from "./pages/Dashboard";

// Client Dashboard (Layout Page)

import ClientDashboard2 from "./pages/ClientDashbroad2";

// Client Pages (Dynamic content)
import AccountDetails from "./pages/Accountpages/AccountDetails";
import Settings from "./pages/Settings";
import Dash from "./pages/Dash";
import ClientServiceListPage from "./pages/Clientpages/Clientservicepage/ClientServiceListPage";

// Services
import SkillHub from "./pages/Skillhub";
import Services from "./pages/Service";
import AddService from "./pages/AddService";
import EditService from "./pages/EditService";
import ViewMore from "./pages/ViewMore";

// Portfolio
import AddPortfolioPage from "./pages/AddPortfolioPage";

// Misc
import TestConnection from "./pages/TestConnection";
import ServiceDetailsModal from "./pages/ServiceDetailsModal";
import MyJobs from "./pages/MyJobs";
import CreateService from "./pages/Clientpages/CreateserviceClient/CreateService";
import BrowseProjects from "./pages/BrowseProjects";
import FreelancerProfile from "./pages/FreelancerProfile";
import Profile from "./pages/Freelancerpage/FreelancerProfile/Profile";
import ClientProfile from "./pages/Clientpages/ClientProfile/ClientProfile"
import Categories from "./pages/Categories";
import FreelanceHome from "./pages/Freelancerpage/FreelanceHome/FreelanceHome";
import NotificationsDetailsScreen from "./pages/Freelancerpage/FreelanceHome/NotificationsDetailsScreen";
import AIGenerator from "./pages/AIGenerator";

import FreelancerDashboard from "./pages/Freelancehomedash"

import Homeclient from "./pages/Clientpages/home/Home"
// import Clientslider from "./pages/Clientpages/slidebar/ClientSidebar"
import Sidebar from "./pages/Freelancerpage/components/Sidebar";
import ClientSidebar from "./pages/Clientpages/slidebar/ClientSidebar"
import ClientHome from "./pages/Clientpages/home/Home";
import ClientDetails2 from "./ClientRegister/ClientDetails2.jsx"


import Firelogin from "./Firebaselogin/Firebaselogin"
import Firebaseregister from "./Firebaseregister/Firebaseregister"
import FreelancerSignup from "./FreelancerRegister/FreelancerSignupScreen";
// import FreelancerOtp from "./FreelancerRegister/FreelancerOtpScreen";
import FreelancerDetails from "./FreelancerRegister/FreelancerDetailsScreen";
import SignUpClient from "./ClientRegister/signinClient";
import OtpScreen from "./ClientRegister/otp_service";
import ClientDetails from "./ClientRegister/ClientDetials";
import ProfessionalStatus from "../src/FreelancerRegister/ProfesionalStatusScreen";
import ProfileBuildPage from "./fireBaseUserProfile/BuildProfileScreen";
import ProfileMenuPage from "./fireBaseUserProfile/profile_menu_screen";
import UserProfilePage from "./fireBaseUserProfile/userProfileProvider";
import useUserProfile from "./fireBaseUserProfile/UseUserProfile";
import ClientProfileMenuScreen from "./firebaseClientScreen/CLientProfile.jsx/profile";
import JobDetail24hoursScreen from "./Firebasejobs/jobfulldetials";
import JobFullDetailJobScreen from "./Firebasejobs/JobfullDetailScreen";
import JobMetaInfo from "./Firebasejobs/job_details_screen";
import JobDetailScreen from "./Firebasejobs/FWJobDetailScreen";
import FhJobDetailScreen from "./Firebasejobs/FHjobDetials";
import ExploreJobs from "./Firebasejobs/ExploreJob";
import PostJob from "./firebaseClientScreen/Postjob/postjob";
import PausedJobs from "./firebaseClientScreen/Postjob/PausedJobs";
import CompanyProfileScreen from "./firebaseClientScreen/Postjob/CompanyProfileScreen";
import AddJobScreen from "./firebaseClientScreen/Postjob/AddJobScreen";
import ClientSideCategoryPage from "./firebaseClientScreen/Postjob/ClientSideCategoryPage";
// import ClientFilter from "./firebaseClientScreen/Postjob/ClientFiller";
import Add24HoursScreen from "./firebaseClientScreen/Postjob/Add24HoursScreen";
// import ExploreClientJobScreen from "./firebaseClientScreen/Postjob/ExploreclientJobScreen";
import ForgotPassword from "./Firebaselogin/Forgetpassword";
import SaveJobButton from "./save/savejob";
import ExploreJobsPage_FULL from "./firebaseClientScreen/Postjob/ExploreclientJobScreen";
import Clientsearchpage from "./Firebasejobs/Clientserachbarr"
import ClientnotificationDetails from "./Firebasejobs/ClientnotificationDetails"
import JobSearchScreen from "./Firebasejobs/JobSearchScreen"

import Service24hDetailScreen from "./Firebasejobs/Service24hDetailScreen"
import { ProfessionalLoginRedirect } from "./Firebaselogin/LoginOtp";
import RedirectHandler from "./Firebaselogin/RedirectHandler";
import ClientProfileMenuScreenPart1Placeholder from "./FreelanceHome/FreelancehomeScreen"
import ClientJobSearchPage from "./Firebasejobs/Clientserachbarr";
import JbfullDetailScreen from "./Firebasejobs/ServicefullDetailScreen";
import Clientloginotp from "./Firebaselogin/Clientloginotp"
import FreelancerOtpScreen from "./FreelancerRegister/FreelancerOtpScreen";

import FreelancerFullDetail from "./Firebasejobs/FreelancerFullDetail"


import ChatPage from "./Firebasejobs/Chat/ChatPage"
import WorkDetailsPage from "./Firebasejobs/Chat/WorkDetailsPage"
import FreelancerPage from "./Firebasejobs/FreelancerPage";
import ChatListScreen from "./Firebasejobs/Chat/Message_list";
import { auth, db, rtdb } from "./firbase/Firebase";
import RequestChatListScreen from "../src/Firebasejobs/Chat/RequestChatListScreen"
import Requestchatscreen from "./Firebasejobs/Chat/RequestChatListScreen"
import RequestChatScreen from "./Firebasejobs/Chat/RequestChatScreen"
import { useLocation } from "react-router-dom";

import AccountDetailsfreelancer from "./pages/Accountpages/Accountfreelancer";
import ClientJobFullDetailJobScreen from "./save/JobFullDetailScreenjob"
import MyWorksScreen from "./save/MyWorksScreen";

import FreelancerviewJobDetailScreen from "./save/FWJobDetailScreen"
import ExploreJobScreen from "./save/ExploreJobScreen";
import Sidebarsave from "./save/slidebarSaved"
import Freelancermyjob from "./Firebasejobs/Myjob/FreelancerMyjob"
import Freelanceaddservice from "./save/FreelanceAddservice"
import FreelanceAddservice24hour from "./save/FreelanceAddservice24hour"
import FreelancerOtpVerify from "./Firebaselogin/FreelancerOtpVerify";
import FreelanceCategoryPage from "./pages/Freelancerpage/FreelancerbrowesPage";
import FreelanceSideCategoryPage from "./pages/Freelancerpage/FreelanceSideCategoryPage";
import Clientsavedjob from "./pages/Clientpages/ClientSavedpage/Clientsavedjob"

import Clientdslidesave from "./save/ClientSavedsilde"
import Clientbrowerpage from "./pages/Clientpages/Clientbrowerpage/Clientbrowercategory"
import ClientSideCategories from "./pages/Clientpages/Clientbrowerpage/ClientSideCategories"
import Clientbrowers from "./pages/Clientpages/Clientbrowerpage/Clientbrowers"
import CompanyProfileEdit from "./firebaseClientScreen/clientSetting/CompanyProfileEdit.jsx"
import EditServiceForm from "./save/EditServiceForm"
import EditService24h from "./save/EditService24h";

import Clienteditjob from "./pages/Clientpages/Clienreditpage/Clienteditpage"
import Clientedit24job from "./pages/Clientpages/Clienreditpage/CLient24houredit"


import ClientNotification from "./save/ClientNotification"

import ChatScreenWrapper from "../src/Firebasejobs/Chat/ChatScreenWrapper"


import FreelancerPausedpage from "./save/PausesServicepage"

import Message from "../src/Firebasejobs/Chat/Message_list"
import ClientPausedJobsPage from "./save/ClientPausedJobsPage";
import FreelancerAcceptedChats from "./Firebasejobs/Chat/Freelancermessagelist";
import MyHiresScreen from "./pages/Clientpages/CLientmyhires/MyHiresScreen";
import CompanyProfileView from "./firebaseClientScreen/clientSetting/CompanyProfileView";
import HelpCenter from "./pages/Helpcenter/Helpcenter";
import TermsOfService from "./pages/Helpcenter/TermsOfService";
import PrivacyPolicy from "./pages/Helpcenter/PrivacyPolicy";

import ClientHelpCenter from "./pages/Helpcenter/ClientHelpCenter";
import ClientHelpCenter1 from "./pages/ClientHelpCenter1";
import Job_24DetailJobScreen from "./save/Job24FullDetailScreenjob";
import Blocked from "./Firebasejobs/Blocked";
import Profile_menu_screen from "./pages/Profile_menu_screen";
import ClientFullDetailScreen from "./pages/Clientpages/ClientProfile/ClientFullDetailsScreen";
import MenuBlock from "./pages/Clientpages/ClientBlock/MenuBlock.jsx";
import ServiceFullDetailScreen from "./save/Servicedetailfullscreen.jsx";
import ServiceViewDetails from "./Firebasejobs/Chat/ServiceViewDetails";
import Service24hFullDetailScreen from "./save/Service24hFullDetailScreen.jsx";
import FreelancerBlockSreen from "./pages/FreelancerBlockSreen.jsx";
import ForgotOtp from "./Firebaselogin/Forget-otp.jsx";
import ChangePassword from "./Firebaselogin/Changepassword.jsx";

import FreelancerFullDetailScreen from "./pages/FreelancerFullDetailScreen.jsx";
import Notifications from "./pages/Notification/Notifications.jsx";
import MessagesUI from "./pages/MessagesUI.jsx";
import FloatingAssistantButton from "./share/FloatingAssistantButton.jsx";
export default function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  // ✅ SCROLL TO TOP ON EVERY ROUTE CHANGE
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // change to "smooth" if you want
    });
  }, [location.pathname]);

  return (
    <>
    <Routes>

      {/* ========== Default Home Route ========== */}
      <Route path="/" element={<Navigate to="/freelance-dashboard" replace />} />
      <Route path="/fireregister" element={<Firebaseregister />} />

      <Route path="/roleselect" element={<RoleSelect />} />
      <Route path="/register" element={<RegisterStep1 />} />
      <Route path="/client-register" element={<ClientRegisterStep1 />} />
      <Route path="/verify-otp" element={<OTPVerify />} />
      <Route path="/client-verify" element={<ClientOtpVerify />} />

      {/* ========== Login & Profile Setup ========== */}
      <Route path="/details1" element={<Details1 />} />
      <Route path="/details2" element={<Details2 />} />
      <Route path="/client-details1" element={<ClientDetails1 />} />

      {/* ========== FREELANCER Dashboard ========== */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* ******************************************************************
         CLIENT DASHBOARD — THIS PAGE CONTAINS SIDEBAR + <Outlet />
         ****************************************************************** */}


      <Route path="/client-details2" element={<ClientDetails2 />} />

      {/* CLIENT DASHBOARD */}
      <Route path="/client-dashbroad2" element={<ClientDashboard2 />}>
        <Route index element={<Clientsearchpage />} />
        <Route path="clienthome" element={<Clientsearchpage />} />
<Route 
  path="clientnotificationdetails/:userId/:jobId" 
  element={<ClientnotificationDetails />} 
/>        <Route path="ClientProfile" element={<ClientProfileMenuScreen userType={"client"} />} />
        {/* <Route path="exploreclientjob" element={<ExploreClientJobScreen/>}/> */}
        <Route path="AddJobScreen" element={<AddJobScreen />} />
        <Route path="ClientSideCategoryPage" element={<ClientSideCategoryPage />} />
        {/* <Route path="ClientFilter" element={<ClientFilter />} /> */}
        <Route path="clientbrowesproject" element={<Clientbrowers />} />
        <Route path="clientcategories" element={<Clientbrowerpage />} />
        <Route path="ClientSideCategories" element={<ClientSideCategories />} />
        <Route path="clientservicelistpage" element={<ClientServiceListPage />} />
        <Route path="serviceDetailsModel/:id" element={<ServiceDetailsModal />} />
        <Route path="account-details" element={<AccountDetails />} />
        <Route path="PostJob" element={<PostJob />} />
        <Route path="add-24hours" element={<Add24HoursScreen />} />
        {/* 
        <Route path="saved" element={<SaveJobButton/>}/> */}
         <Route 
  path="freelancer-profile/:userId/:jobId" 
  element={<FreelancerFullDetailScreen />} 
/>

        <Route path="saved" element={<Clientsavedjob />} />

        <Route path="Profilemenuscreen" element={<Profile_menu_screen />} />

        <Route path="Clientsaved" element={<Clientdslidesave />} />

        <Route path="client-job-search" element={<ExploreJobs />} />
        <Route path="CompanyProfileScreen" element={<CompanyProfileScreen />} />

        <Route path="clientserachbar" element={<Clientsearchpage />} />

        <Route path="service/:id" element={<ServiceDetailsModal />} />
        <Route path="service-24h/:id" element={<Service24hDetailScreen />} />

        <Route path="edit-service/:id" element={<EditService />} />

        <Route path="job-full24/:id" element={<Job_24DetailJobScreen />} />
        <Route path="job-full/:id" element={<ClientJobFullDetailJobScreen />} />


        <Route path="/client-dashbroad2/clienteditjob" element={<Clienteditjob />} />
        <Route path="/client-dashbroad2/clientedit24jobs" element={<Clientedit24job />} />


        <Route path="my-hires" element={<MyHiresScreen />} />
        <Route path="my-hires/:jobId" element={<MyHiresScreen />} />
        <Route path="clientBlock" element={<MenuBlock />} />

        <Route path="clientNotification" element={<ClientNotification />} />
        <Route path="companyprofileview" element={<CompanyProfileView />} />
        <Route path="companyprofileedit" element={<CompanyProfileEdit />} />
        <Route path="settings" element={<Settings />} />
        {/* /client-dashbroad2/clientsetting */}

        <Route path="clientpausedjobs" element={<ClientPausedJobsPage />} />

        <Route path="messages" element={<MessagesUI />} />
        <Route path="helpcenter" element={<HelpCenter />} />
        <Route path="helpcenter1" element={<ClientHelpCenter1 />} />

        <Route
          path="freelancerblockSreen/:userId"
          element={<FreelancerBlockSreen />}
        />


      </Route>



      <Route path="/account" element={<ClientProfileMenuScreenPart1Placeholder />} />


      {/* FREELANCER DASHBOARD */}
      <Route path="/freelance-dashboard" element={<FreelancerDashboard />}>
        <Route index element={<FreelanceHome />} />
        <Route path="freelanceHome" element={<FreelanceHome />} />
        <Route path="notificationsdetailsscreen" element={<NotificationsDetailsScreen />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<MessagesUI />} />
        <Route path="browse-projects" element={<BrowseProjects />} />
        <Route path="freelancebrowesproject" element={<FreelanceCategoryPage />} />
        <Route path="freelancesidecategorypage" element={<FreelanceSideCategoryPage />} />
        <Route path="serviceDetailsModel/:id" element={<ServiceDetailsModal />} />
        <Route path="account-details" element={<AccountDetails />} />
        <Route path="settings" element={<Settings />} />
        <Route path="categories" element={<Categories />} />
        <Route path="createservice" element={<AddService />} />
        <Route path="aigenerator" element={<AIGenerator />} />

         <Route 
  path="client-profile/:userId/:jobId" 
  element={<FreelancerFullDetailScreen />} 
/>

        <Route path="Profilebuilder" element={<ProfileBuildPage userType={"freelancer"} />} />
        <Route path="accountfreelancer" element={<AccountDetailsfreelancer />} />
        <Route path="job-24/:id" element={<JobDetail24hoursScreen />} />
        <Route path="job-full/:id" element={<JobFullDetailJobScreen />} />
        <Route path="job-full/:id" element={<JobFullDetailJobScreen />} />
        <Route path="CompanyProfileScreen" element={<CompanyProfileScreen />} />
        <Route
          path="/freelance-dashboard/view-profile/:userId/job/:jobid"
          element={<ClientFullDetailScreen />}
        />
        <Route path="add-service-form-24-hour" element={<FreelanceAddservice24hour />} />

        <Route path="servicesdetails/:id" element={<ServiceFullDetailScreen />} />
   
        <Route path="serviceviewdetails/:id" element={<ServiceViewDetails />} /> 
        <Route path="services24details/:id" element={<Service24hFullDetailScreen />} />

        <Route path="myjobs" element={<Freelancermyjob />} />
        <Route path="AddJobScreen" element={<AddJobScreen />} />



        <Route path="freelance-dashboard/job-full/:id" element={<ClientJobFullDetailJobScreen />} />

        <Route path="freelancermyworks" element={<MyWorksScreen />} />
        <Route path="/freelance-dashboard/jobdetailsscreen/:id" element={<FreelancerviewJobDetailScreen />} />

        <Route path="/freelance-dashboard/saved" element={<ExploreJobScreen />} />
        <Route path="/freelance-dashboard/sidebarsaved" element={<Sidebarsave />} />
        <Route path="/freelance-dashboard/job-full/:id" element={<ClientJobFullDetailJobScreen />} />

        <Route path="add-service-form" element={<Freelanceaddservice />} />
        <Route path="add-24h-service" element={<Add24HoursScreen />} />
        <Route path="freelanceredit-service/:id" element={<EditServiceForm />} />
        <Route path="freelanceredit-service24h/:id" element={<EditService24h />} />

        <Route path="paused-services" element={<FreelancerPausedpage />} />
        <Route path="blocked" element={<Blocked />} />
        <Route path="freelancermessages" element={<FreelancerAcceptedChats />} />





        {/* <Route path="freelancermessages" element={<FreelancerAcceptedChats />} /> */}
        <Route path="helpcenter" element={<HelpCenter />} />

        <Route path="Requestmessagefreelancer" element={<RequestChatListScreen />}></Route>



      </Route>



      {/* ========== Services ========== */}
      <Route path="/service" element={<Services />} />
      <Route path="/add-service" element={<AddService />} />

      <Route path="/add-service-form" element={<Freelanceaddservice />} />

      <Route path="/edit-service/:id" element={<EditService />} />
      <Route path="/view-service/:id" element={<ViewMore />} />

      {/* ========== Skills / Portfolio ========== */}
      <Route path="/skill-hub" element={<SkillHub />} />
      <Route path="/add-portfolio" element={<AddPortfolioPage />} />

      {/* ========== Build Profile ========== */}
      <Route path="/buildprofile" element={<BuildProfile />} />
      <Route path="/aftersubmitbuildprofile" element={<AfterSubmitBuildProfile />} />

      {/* ========== Misc ========== */}
      <Route path="/test" element={<TestConnection />} />
      <Route path="/clientservicelistpage" element={<ClientServiceListPage />} />
      <Route path="/serviceDetailsModel/:id" element={<ServiceDetailsModal />} />




      <Route path="/myjobs" element={<MyJobs />} />
      <Route path="/createservice" element={<CreateService />} />
      <Route path="/create-service24" element={<CreateService />} />

      {/* ========== client home ========== */}

      <Route path="/clienthome" element={<Homeclient />} />
      <Route path="/slidebar" element={<Sidebar />} />

      <Route path="/ClientSidebar" element={<ClientSidebar />} />
      <Route path="/freelanceHome" element={<FreelanceHome />} />

      {/* ========== firebase auth ========== */}

      <Route path="/firelogin" element={<Navigate to="/freelance-dashboard" replace />} />
      <Route path="/fireregister" element={<Firebaseregister />} />


      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgetotp" element={<ForgotOtp/>} />
      <Route path="/changepassword" element={<ChangePassword />} />

      {/* ========== freelance reg ========== */}
      <Route path="/freelancer-signup" element={<FreelancerSignup />} />
      <Route path="/freelancer-otp" element={<FreelancerOtpVerify />} />
      <Route path="/freelancer-loginotp" element={<FreelancerOtpScreen />} />
      <Route path="/freelancer-details" element={<FreelancerDetails />} />
      <Route path="/professional-status" element={<ProfessionalStatus />} />

      {/* ========== client reg ========== */}
      <Route path="/client-signup" element={<SignUpClient />} />
      <Route path="/otp" element={<OtpScreen />} />
      <Route path="/clientloginotp" element={<Clientloginotp />} />
      <Route path="/client-details" element={<ClientDetails />} />

      {/* <Route path="/client-job-search" element={<ClientJobSearchPage/>} /> */}

      {/* ========== profile firebase ========== */}

      <Route path="/Profilebuilder" element={<ProfileBuildPage />} />
      <Route path="/Profilemenu" element={<ProfileMenuPage />} />
      <Route path="/Userprofile" element={<UserProfilePage />} />
      <Route path="/UseUserprofile" element={<useUserProfile />} />


      {/* ========== client profile firebase ========== */}
      <Route path="/ClientProfile" element={<ClientProfileMenuScreen />} />


      {/* ========== job firebase  ========== */}

      <Route path="/JobDetail24hoursScreen" element={<JobDetail24hoursScreen />} />
      <Route path="/JobFullDetailJobScreen" element={<JobFullDetailJobScreen />} />
      <Route path="/JobMetaInfo" element={<JobMetaInfo />} />
      <Route path="/JobDetailScreen" element={<JobDetailScreen />} />
      <Route path="/FhJobDetailScreen" element={<FhJobDetailScreen />} />
      <Route path="/ExploreJobs" element={<ExploreJobs />} />
      <Route path="/PostJob" element={<PostJob />} />
      <Route path="/PausedJobs" element={<PausedJobs />} />

      <Route path="/CompanyProfileScreen" element={<CompanyProfileScreen />} />


      <Route path="/AddJobScreen" element={<AddJobScreen />} />


      <Route path="/add-24hours" element={<Add24HoursScreen />} />


      <Route path="/client-job-search" element={<ExploreJobs />} />


      <Route path="/clientserachbar" element={<Clientsearchpage />} />


      <Route path="/service/:id" element={<JbfullDetailScreen />} />


      <Route path="/service-24h/:id" element={<Service24hDetailScreen />} />


      <Route path="/JobSearchScreen" element={<JobSearchScreen />} />

      {/* ========== freelancer job firebase  ========== */}
      <Route path="/redirect/:uid" element={<RedirectHandler />} />

      <Route path="/helpcenter" element={<HelpCenter />} />

      <Route path="/freelancer/:uid/job/:jobid" element={<FreelancerPage />} />

      <Route path="/clientNotification" element={<ClientNotification />} />



      <Route path="/connect/:uid" element={<FreelancerPage />} />

      <Route path="/chat" element={<ChatScreenWrapper />} />


      <Route path="/chat/:chatId" element={<ChatScreenWrapper />} />
      <Route path="/chat/:uid1/:uid2" element={<ChatPage />} />
      <Route path="/work-details/:id" element={<WorkDetailsPage />} />
      <Route path="/request-chat" element={<RequestChatScreen />} />


      <Route path="/messages" element={<Message />} />




      <Route path="/freelancermessages" element={<FreelancerAcceptedChats />} />




      <Route path="/termsofservice" element={<TermsOfService defaultTab="terms" />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy defaultTab="privacy" />} />


      <Route path="/job-full/:id" element={<ClientJobFullDetailJobScreen />} />

      <Route path="/Requestmessagefreelancer" element={<RequestChatListScreen />}></Route>



    </Routes>
    {!["/freelance-dashboard/freelancermyworks", "/freelance-dashboard/add-service-form"].includes(location.pathname) && <FloatingAssistantButton />}
    </>
  );
}
