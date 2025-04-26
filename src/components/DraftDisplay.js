import React, { useState } from "react";
import { useGolfersData } from "./GolfersData";
import {
    initializeTeams,
    canAddGolfer,
    handleGolferClick,
    filterOutsideGolfers,
} from "./DraftLogic";

const DraftDisplay = () => {
    const [numTeams, setNumTeams] = useState(2); // Number of teams
    const [teams, setTeams] = useState([]); // Array of team names and their picks (1 golfer per tier or from outside tiers)
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0); // Current team's turn
    const [draftComplete, setDraftComplete] = useState(false); // Draft completion state
    const [disabledGolferIds, setDisabledGolferIds] = useState([]); // Track golfers already picked
    const [outsideFilterQuery, setOutsideFilterQuery] = useState(""); // Filter for the outside golfers list
    const { golfers, tiers, loading, error } = useGolfersData(); // Import golfers and tiers from GolfersData.js

    const initializeDraft = () => {
        const initialTeams = initializeTeams(numTeams, tiers);
        setTeams(initialTeams);
        setCurrentTeamIndex(0);
        setDraftComplete(false);
        setDisabledGolferIds([]);
    };

    if (loading) {
        return <div>Loading golfers...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Draft Board</h1>

            {/* Number of Teams Input */}
            <div>
                <label>
                    Number of Teams:
                    <input
                        type="number"
                        min="2"
                        value={numTeams}
                        onChange={(e) => setNumTeams(parseInt(e.target.value) || 2)}
                    />
                </label>
                <button onClick={initializeDraft} style={{ marginLeft: "10px" }}>
                    Set Teams
                </button>
            </div>

            {/* Team Names Input */}
            {teams.map((team, index) => (
                <div key={index}>
                    <label>
                        Team {index + 1} Name:
                        <input
                            type="text"
                            value={team.name}
                            onChange={(e) => {
                                const updatedTeams = [...teams];
                                updatedTeams[index].name = e.target.value;
                                setTeams(updatedTeams);
                            }}
                        />
                    </label>
                </div>
            ))}

            {/* Draft Process */}
            {!draftComplete && teams.length > 0 && (
                <div>
                    <h2>Drafting</h2>
                    <h2>{teams[currentTeamIndex].name}</h2>

                    {/* Tier Selection */}
                    <div>
                        <h3>Select a Golfer from Tiers</h3>
                        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {tiers.map((_, tierIndex) => (
                                        <th key={tierIndex}>Tier {tierIndex + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Dynamically generate rows based on the max tier size */}
                                {Array.from({
                                    length: Math.max(...tiers.map((tier) => tier.length)),
                                }).map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {tiers.map((tier, tierIndex) => (
                                            <td key={tierIndex}>
                                                {tier[rowIndex] ? (
                                                    <button
                                                        onClick={() =>
                                                            handleGolferClick(
                                                                tier[rowIndex],
                                                                tierIndex,
                                                                teams,
                                                                currentTeamIndex,
                                                                disabledGolferIds,
                                                                setTeams,
                                                                setDisabledGolferIds,
                                                                setCurrentTeamIndex,
                                                                setDraftComplete,
                                                                numTeams
                                                            )
                                                        }
                                                        disabled={
                                                            disabledGolferIds.includes(tier[rowIndex].id) ||
                                                            !canAddGolfer(teams[currentTeamIndex], tier[rowIndex], tierIndex)
                                                        }
                                                    >
                                                        {tier[rowIndex].fullName}
                                                    </button>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Outside Golfers List */}
                    <div>
                        <h3>Golfers Outside the Tiers</h3>
                        <input
                            type="text"
                            placeholder="Filter golfers..."
                            value={outsideFilterQuery}
                            onChange={(e) => setOutsideFilterQuery(e.target.value)}
                        />
                        <ul>
                            {filterOutsideGolfers(
                                golfers,
                                tiers,
                                disabledGolferIds,
                                outsideFilterQuery
                            ).map((golfer) => (
                                <li key={golfer.id}>
                                    {golfer.fullName}{" "}
                                    <button
                                        onClick={() =>
                                            handleGolferClick(
                                                golfer,
                                                null,
                                                teams,
                                                currentTeamIndex,
                                                disabledGolferIds,
                                                setTeams,
                                                setDisabledGolferIds,
                                                setCurrentTeamIndex,
                                                setDraftComplete,
                                                numTeams
                                            )
                                        }
                                        disabled={disabledGolferIds.includes(golfer.id)}
                                    >
                                        Select
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Draft Completed */}
            {draftComplete && (
                <div>
                    <h2>Draft Complete!</h2>
                    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {teams.map((team, index) => (
                                    <th key={index}>{team.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 4 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {teams.map((team, teamIndex) => (
                                        <td key={teamIndex}>
                                            {team.picks[rowIndex]
                                                ? team.picks[rowIndex].fullName
                                                : "No Pick"}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DraftDisplay;