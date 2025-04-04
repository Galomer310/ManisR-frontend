import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LaunchScreen from "./screens/LaunchScreen";
import LoginRegister from "./screens/LoginRegister";
import Register from "./screens/Register";
import Login from "./screens/Login";
import VerifyEmail from "./screens/VerifyEmail";
import Menu from "./screens/Menu";
import PreferencesLocation from "./screens/PreferencesLocation";
import PreferencesFood from "./screens/PreferencesFood";
import FoodUpload from "./screens/FoodUpload";
import GiverMealScreen from "./screens/GiverMealScreen";
import GiverMealCardApproval from "./screens/GiverMealCardApproval";
import TakerMealCardApproval from "./screens/TakerMealCardApproval";
import CollectFood from "./screens/CollectFood";
import Messages from "./screens/Messages";
import RegisterIntro from "./screens/RegisterIntro";
import TalkToUs from "./screens/TalkToUs";
import Settings from "./screens/Settings";
import Profile from "./screens/Profile";
import TakerTracker from "./screens/TakerTracker";
import GiverTracker from "./screens/GiverTracker";
import UserRateReview from "./screens/UserRateReview";
import UsageHistory from "./screens/UsageHistory";
import AccountDetails from "./screens/AccountDetails";
import UnderConstruction from "./screens/UnderConstruction";
import TermsOfUseAndPrivacy from "./screens/TermsOfUseAndPrivacy";
import ReviewSuccess from "./screens/ReviewSuccess";
import GiverProgressPage from "./components/GiverProgressPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/menu" element={<Menu />} />

        <Route path="/food/upload" element={<FoodUpload />} />
        <Route path="/giver-meal-screen" element={<GiverMealScreen />} />
        <Route
          path="/giver-meal-card-approval"
          element={<GiverMealCardApproval />}
        />
        <Route
          path="/taker-meal-card-approval"
          element={<TakerMealCardApproval />}
        />
        <Route path="/collect-food" element={<CollectFood />} />
        <Route path="/preferences-location" element={<PreferencesLocation />} />
        <Route path="/preferences-food" element={<PreferencesFood />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/register-intro" element={<RegisterIntro />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/TalkToUS" element={<TalkToUs />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="TakerTracker" element={<TakerTracker />} />
        <Route path="GiverTracker" element={<GiverTracker />} />
        <Route path="/rate-review" element={<UserRateReview />} />
        <Route path="/usageHistory" element={<UsageHistory />} />
        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/Terms-Privacy" element={<TermsOfUseAndPrivacy />} />
        <Route path="/review-success" element={<ReviewSuccess />} />
        <Route path="/giver-prograss" element={<GiverProgressPage />} />
      </Routes>
    </Router>
  );
};

export default App;
