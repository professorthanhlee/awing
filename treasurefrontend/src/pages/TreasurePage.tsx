import React, { useState } from "react";
import { Container, Paper, Typography } from "@mui/material";
import TreasureInputForm from "./components/TreasureInputForm";
import HistoryList, { HistoryItem } from "./components/HistoryList"; // import type

export default function TreasurePage() {
    const [result, setResult] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null); // ✅ add

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    💎 Tìm kho báu
                </Typography>

                <TreasureInputForm
                    onResult={setResult}
                    initialData={selectedItem} 
                />

                {result && (
                    <Typography variant="h6" align="center" sx={{ mt: 3 }}>
                        <strong>Kết quả: {result}</strong>
                    </Typography>
                )}

                <HistoryList onSelect={(id, item) => setSelectedItem(item)} /> 
            </Paper>
        </Container>
    );
}
