import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/MNSR_logo.svg";

const RegisterIntro: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="screen-container register-intro centered">
      <img
        src={logo}
        alt="Manisr Logo"
        style={{ width: 100, marginBottom: 100 }}
      />
      <h1> Rברוכים הבאים למניש </h1>
      <p>
        מנישר הוא מיזם חברתי-סביבתי שמטרתו לצמצם זריקת מזון. החזון שלנו הוא
        להציל כמ מנה או מוצר ת כל עוד הם במצב טוב וראויים לאכילה. באמצעות
        האליקציה ניתן הן למסור מזון והן לאסוף מזון בקרבתכם. מקווים שתמצאו את
        האפליקציה שימושית ונעימה. עם זאת, אנחנו תמיד שמחים לשמוע הצעות לשיפור,
        הערות 🤔 והארות🤗
      </p>
      <p>,שלכם</p>
      <p>Rצוות מניש </p>
      <button onClick={handleRegisterClick}>אישור</button>
    </div>
  );
};

export default RegisterIntro;
