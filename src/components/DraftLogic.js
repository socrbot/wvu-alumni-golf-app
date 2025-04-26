import { useState } from "react";

// Exportable teams array to track the draft selections
export const useTeams = (numTeams, tiers) => {
    const [teams, setTeams] = useState(initializeTeams(numTeams, tiers));
    return [teams, setTeams];
};

export const initializeTeams = (numTeams, tiers) => {
    return Array.from({ length: numTeams }, (_, index) => ({
        name: `Team ${index + 1}`,
        picks: [], // Store selected golfers
    }));
};

export const canAddGolfer = (team, golfer, tierIndex = null) => {
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

export const handleGolferClick = (
    golfer,
    tierIndex,
    teams,
    currentTeamIndex,
    disabledGolferIds,
    setTeams,
    setDisabledGolferIds,
    setCurrentTeamIndex,
    setDraftComplete,
    numTeams
) => {
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

export const filterOutsideGolfers = (golfers, tiers, disabledGolferIds, query) => {
    return golfers.filter(
        (golfer) =>
            !disabledGolferIds.includes(golfer.id) &&
            !tiers.some((tier) => tier.some((tierGolfer) => tierGolfer.id === golfer.id)) &&
            golfer.fullName.toLowerCase().includes(query.toLowerCase())
    );
};