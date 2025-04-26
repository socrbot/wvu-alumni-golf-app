import React, { useState, useEffect } from "react";

const GolfersTable = () => {
    const [golfers, setGolfers] = useState([]);
    const [tiers, setTiers] = useState([[], [], [], []]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGolfers = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'ed588908c5mshd39b6ec2c9168a5p142e26jsnd2c9925b5e53', // Replace with your API key
                    'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com',
                },
            };

            try {
                const response = await fetch(
                    "https://live-golf-data.p.rapidapi.com/stats?year=2025&statId=186",
                    options
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch golfers.");
                }

                const textData = await response.text();
                const data = JSON.parse(textData);

                // Process the "rankings" field from the API response
                const golfersArray = data.rankings.map((golfer) => ({
                    id: golfer.playerId,
                    fullName: golfer.fullName,
                    rank: parseInt(golfer.rank.$numberInt, 10),
                    previousRank: parseInt(golfer.previousRank.$numberInt, 10),
                    totalPoints: parseFloat(golfer.totalPoints.$numberDouble),
                    avgPoints: parseFloat(golfer.avgPoints.$numberDouble),
                    pointsLost: parseFloat(golfer.pointsLost.$numberDouble),
                    pointsGained: parseFloat(golfer.pointsGained.$numberDouble),
                }));

                setGolfers(golfersArray);

                // Divide golfers into 4 tiers of 10 golfers each
                const tierSize = 10;
                const newTiers = [
                    golfersArray.slice(0, tierSize),
                    golfersArray.slice(tierSize, tierSize * 2),
                    golfersArray.slice(tierSize * 2, tierSize * 3),
                    golfersArray.slice(tierSize * 3, tierSize * 4),
                ];
                setTiers(newTiers);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchGolfers();
    }, []);

    if (loading) {
        return <div>Loading golfers...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

      return (
        <div>
            
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Tier 1</th>
                        <th>Tier 2</th>
                        <th>Tier 3</th>
                        <th>Tier 4</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Dynamically generate rows based on the maximum tier size */}
                    {Array.from({ length: Math.max(...tiers.map((tier) => tier.length)) }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {/* Render a cell for each tier */}
                            {tiers.map((tier, columnIndex) => (
                                <td key={columnIndex}>
                                    {tier[rowIndex] ? tier[rowIndex].fullName : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GolfersTable;