import { useState, useEffect } from "react";

export const useGolfersData = () => {
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

    return { golfers, tiers, loading, error };
};