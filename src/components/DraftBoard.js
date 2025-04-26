import React, { useState } from "react";
import { useGolfersData } from "./GolfersData";

const DraftBoard = () => {
    const [numTeams, setNumTeams] = useState(2); // Number of teams
    const [teams, setTeams] = useState([]); // Array of team names and their picks (1 golfer per tier or from outside tiers)
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0); // Current team's turn
    const [draftComplete, setDraftComplete] = useState(false); // Draft completion state
    const [disabledGolferIds, setDisabledGolferIds] = useState([]); // Track golfers already picked
    const [outsideFilterQuery, setOutsideFilterQuery] = useState(""); // Filter for the outside golfers list
    const { golfers, tiers, loading, error } = useGolfersData(); // Import golfers and tiers from GolfersData.js

    // Initialize teams with empty picks (one per tier or from outside tiers)
    const initializeTeams = () => {
        const initialTeams = Array.from({ length: numTeams }, (_, index) => ({
            name: `Team ${index + 1}`,
            picks: [], // Store selected golfers
        }));
        setTeams(initialTeams);
        setCurrentTeamIndex(0);
        setDraftComplete(false);
        setDisabledGolferIds([]);
    };

    // Handle team name change
    const handleTeamNameChange = (index, newName) => {
        const updatedTeams = [...teams];
        updatedTeams[index].name = newName;
        setTeams(updatedTeams);
    };

    // Check if the team can add a golfer
    const canAddGolfer = (team, golfer, tierIndex = null) => {
        if (team.picks.length >= 4) {
            return false; // Team already has 4 golfers
        }

        if (tierIndex !== null) {
            // Ensure only one golfer from the same tier is allowed
            return !team.picks.some((pick) => pick.tierIndex === tierIndex);
        }

        // Outside golfers can be added freely if the team has fewer than 4 golfers
        return true;
    };

    // Handle golfer selection (from tiers or outside the tiers)
    const handleGolferClick = (golfer, tierIndex = null) => {
        const updatedTeams = [...teams];
        const currentTeam = updatedTeams[currentTeamIndex];

        if (!canAddGolfer(currentTeam, golfer, tierIndex)) {
            alert("This team cannot add another golfer from this tier or has reached the maximum team size.");
            return;
        }

        // Add golfer to the team with tierIndex metadata if applicable
        currentTeam.picks.push({ ...golfer, tierIndex });

        // Disable the selected golfer for future picks
        setDisabledGolferIds([...disabledGolferIds, golfer.id]);

        // Update state
        setTeams(updatedTeams);

        // Check if all teams have completed their picks
        if (updatedTeams.every((team) => team.picks.length === 4)) {
            setDraftComplete(true);
        } else {
            // Move to the next team's turn
            setCurrentTeamIndex((currentTeamIndex + 1) % numTeams);
        }
    };

    // Filter golfers outside the tiers based on the query
    const filteredOutsideGolfers = golfers.filter(
        (golfer) =>
            !disabledGolferIds.includes(golfer.id) &&
            !tiers.some((tier) => tier.some((tierGolfer) => tierGolfer.id === golfer.id)) &&
            golfer.fullName.toLowerCase().includes(outsideFilterQuery.toLowerCase())
    );

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
                <button onClick={initializeTeams} style={{ marginLeft: "10px" }}>
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
                            onChange={(e) =>
                                handleTeamNameChange(index, e.target.value)
                            }
                        />
                    </label>
                </div>
            ))}

            {/* Draft Process */}
            {!draftComplete && teams.length > 0 && (
                <div>
                    <h2>Drafting</h2>
                    <p>Current Turn: {teams[currentTeamIndex].name}</p>

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
                                                        onClick={() => handleGolferClick(tier[rowIndex], tierIndex)}
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
                            {filteredOutsideGolfers.map((golfer) => (
                                <li key={golfer.id}>
                                    {golfer.fullName}{" "}
                                    <button
                                        onClick={() => handleGolferClick(golfer)}
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

export default DraftBoard;