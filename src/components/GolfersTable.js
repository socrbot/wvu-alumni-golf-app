import React from "react";
import { useGolfersData } from "./GolfersData";

const GolfersTable = () => {
    const { golfers, tiers, loading, error } = useGolfersData();

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