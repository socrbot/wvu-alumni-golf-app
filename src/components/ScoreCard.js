import React from "react";
import { useTeams } from "./DraftLogic";

const ScoreCard = ({ numTeams, tiers }) => {
    const [teams] = useTeams(numTeams, tiers);

    return (
        <div>
            <h1>Score Card</h1>
            {teams.map((team, index) => (
                <div key={index}>
                    <h2>{team.name}</h2>
                    <ul>
                        {team.picks.map((golfer, pickIndex) => (
                            <li key={pickIndex}>{golfer.fullName}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ScoreCard;