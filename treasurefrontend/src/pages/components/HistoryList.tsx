import React, {useState, useEffect} from "react";
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Box,
    CircularProgress,
    Alert,
    Button
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";

export interface HistoryItem {
    id: number;
    rows: number;
    columns: number;
    p: number;
    matrixJson: string;
    result: number;
    createdAt: string;
}

interface Props {
    onSelect?: (id: number, item: HistoryItem) => void;
}

const HistoryList: React.FC<Props> = ({ onSelect }) => {
    const fetchRecords = async (): Promise<HistoryItem[]> => {
        const response = await fetch(`http://localhost:5209/api/treasure/history`);
        if (!response.ok) throw new Error("Có lỗi xảy ra khi tải dữ liệu");
        return response.json();
    };

    const {data: records = [], isLoading: loading, error} = useQuery<HistoryItem[]>({
        queryKey: ["historyRecords"],
        queryFn: fetchRecords,
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <CircularProgress size={24}/>
                <Typography variant="body2" color="textSecondary" ml={1}>
                    Đang tải lịch sử...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{mb: 2}}>
                {(error as Error).message}
            </Alert>
        );
    }

    if (records.length === 0) {
        return (
            <Typography variant="body2" color="textSecondary">
                Không có lịch sử nào.
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                🕘 Lịch sử gần đây
            </Typography>
            <List>
                {records.map((item) => (
                    <React.Fragment key={item.id}>
                        <ListItem
                            component="button"
                            onClick={() => onSelect?.(item.id, item)} 
                            alignItems="flex-start"
                        >
                            <ListItemText
                                primary={
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Ma trận: {item.rows} x {item.columns}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            P = {item.p} &nbsp;|&nbsp; Kết quả: <b>{item.result.toFixed(5)}</b>
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li"/>
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default HistoryList;
