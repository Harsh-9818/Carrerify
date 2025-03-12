import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const questions = [
  { text: "Which subject did you enjoy the most in school?", options: ["Computer Science", "Math", "Science", "Creativity", "Not Sure"] },
  { text: "What excites you the most?", options: ["Building apps & websites", "Artificial Intelligence", "Working with data", "Cybersecurity", "Cloud Computing", "Blockchain", "Game Development", "IoT", "AR/VR", "DevOps"] },
  { text: "What’s your preferred work style?", options: ["Corporate job", "Startup/Freelancing", "Remote Work", "Open to anything"] },
  { text: "Do you prefer working with hardware or software?", options: ["Software", "Hardware", "Both", "Not Sure"] },
  { text: "Would you like to work in an emerging tech field?", options: ["Yes", "No", "Maybe"] },
  { text: "Are you more interested in front-end or back-end development?", options: ["Front-end", "Back-end", "Full-stack", "Not Sure"] },
  { text: "Do you enjoy working with data and statistics?", options: ["Yes, a lot!", "Sometimes", "No, not really"] },
  { text: "Do you prefer working on creative tasks or logical problem-solving?", options: ["Creative work", "Problem-solving", "Both", "Not Sure"] },
  { text: "What kind of tech projects do you find interesting?", options: ["Web & Mobile Apps", "AI & Machine Learning", "Cybersecurity Solutions", "Cloud & DevOps", "Blockchain & Crypto", "IoT & Smart Devices"] },
  { text: "Would you rather work in a team or independently?", options: ["Teamwork", "Independently", "Flexible with both"] },
  { text: "Are you comfortable learning new programming languages regularly?", options: ["Yes, love learning!", "Maybe", "No, I prefer sticking to a few languages"] },
  { text: "Do you want a career that requires constant innovation and research?", options: ["Yes, I love innovation", "Maybe", "No, I prefer stable technologies"] },
  { text: "Would you be open to working in a startup or prefer a well-established company?", options: ["Startup", "Big Tech", "Either works"] }
];

const Chatbot = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [careerText, setCareerText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/api/career-recommendation", { userInput: newAnswers.join(", ") });
        setCareerText(response.data.career || "Try exploring AI, Cybersecurity, or Cloud!");
      } catch (error) {
        console.error("Error fetching career recommendation:", error);
        setCareerText("Error fetching career recommendation. Try again later.");
      }
      setLoading(false);
    }
  };

  const parseCareers = (text) => {
    const careers = [];
    const sections = text.split("## ").slice(1);

    sections.forEach((section) => {
      const lines = section.split("\n").filter((line) => line.trim() !== "");
      const title = lines[0]?.trim();
      const descriptionMatch = lines.find((line) => line.startsWith("**Description:**"));
      const timeMatch = lines.find((line) => line.startsWith("⏳ **Estimated Time to Learn:**"));

      const description = descriptionMatch ? descriptionMatch.replace("**Description:**", "").trim() : "";
      const time = timeMatch ? timeMatch.replace("⏳ **Estimated Time to Learn:**", "").trim() : "";

      const roadmap = lines
        .filter((line) => line.startsWith("- "))
        .map((step) => step.replace("- ", "").trim());

      careers.push({ title, description, roadmap, time });
    });

    return careers;
  };

  const careers = parseCareers(careerText);

  const handleReload = () => {
    setStep(0);
    setAnswers([]);
    setCareerText("");
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Careerify</h1>
        <button className="reload-button" onClick={handleReload}>Restart AI</button>
      </div>
      <h2>GET CAREER RECOMMENDATION USING AI</h2>
      <h3>Answer some Questions to get personalised career recommendations.</h3>

      {!careerText && !loading ? (
        <div>
          <p className="question-heading"><strong>{questions[step].text}</strong></p>
          {questions[step].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(option)} className="option-button">
              {option}
            </button>
          ))}
        </div>
      ) : loading ? (
        <div className="loading-text">🤖 AI is analyzing your responses... Please wait!</div>
      ) : (
        <div>
          <h3>Recommended Career Paths 🚀</h3>
          <div className="career-cards">
            {careers.map((career, index) => (
              <div key={index} className="career-card">
                <h4>{career.title}</h4>
                <p><strong>Description:</strong> {career.description}</p>
                {career.roadmap.length > 0 && (
                  <div>
                    <h5>📌 Roadmap:</h5>
                    <ul>
                      {career.roadmap.map((step, stepIndex) => (
                        <li key={stepIndex}>🔹 {step}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {career.time && <p><strong>⏳ Estimated Time to Learn:</strong> {career.time}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
