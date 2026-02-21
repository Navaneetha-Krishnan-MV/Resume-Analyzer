import { useLocation } from "react-router-dom";


const Analyze = () => {
    
    const location = useLocation();
    const {analyzeRes:data} = location.state || {};
    console.log(data);

    const { score, skills, missingSkills, suggestion } = data;

    return (
        <>
          <h1>Here is your Analyzed Data</h1>
          <div>
              <div>
                 <h3>Score Info</h3>
                 <p>Your ATS score is {score.score}</p>
              </div>

              <div>
                <h3>Missing Skills</h3>
                {missingSkills.forEach((cur) =>
                    <p>{cur}</p>
                )}
              </div>

              <div>
                 <h3>Suggestion</h3>
                 <p>{suggestion}</p>
              </div>
          </div>
        </>
    )
}

export default Analyze;