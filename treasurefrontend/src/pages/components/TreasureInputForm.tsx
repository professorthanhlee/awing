import React, { useState, useCallback, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
    InputAdornment,
    Tooltip,
    IconButton,
    Alert,
    Typography,
    Paper,
    Divider,
} from "@mui/material";
import GridOnIcon from '@mui/icons-material/GridOn';
import TableRowsIcon from '@mui/icons-material/TableRows';
import InventoryIcon from '@mui/icons-material/Inventory';
import SendIcon from '@mui/icons-material/Send';
import { FixedSizeGrid as VirtualGrid } from "react-window";
import axios from "axios";
import { HistoryItem } from "./HistoryList"; // cần import kiểu dữ liệu

interface Props {
    onResult: (val: string) => void;
    initialData?: HistoryItem | null; // ✅ thêm props mới
}

export default function TreasureInputForm({ onResult, initialData }: Props) {
    const [n, setN] = useState(3);
    const [m, setM] = useState(3);
    const [p, setP] = useState(3);
    const [matrix, setMatrix] = useState<string[][]>([]);
    const [matrixCreated, setMatrixCreated] = useState(false);
    const [errors, setErrors] = useState<{ n?: string; m?: string; p?: string; matrix?: string }>({});

    // ✅ update form nếu initialData thay đổi
    useEffect(() => {
        if (initialData) {
            setN(initialData.rows);
            setM(initialData.columns);
            setP(initialData.p);
            try {
                const parsedMatrix: number[][] = JSON.parse(initialData.matrixJson);
                const strMatrix = parsedMatrix.map(row => row.map(val => val.toString()));
                setMatrix(strMatrix);
                setMatrixCreated(true);
            } catch (e) {
                console.error("Lỗi parse matrixJson:", e);
                setErrors(prev => ({ ...prev, matrix: "Không thể đọc ma trận từ lịch sử" }));
            }
        }
    }, [initialData]);

    const updateMatrixSize = useCallback((newN: number, newM: number) => {
        const newMatrix = Array.from({ length: newN }, (_, i) =>
            Array.from({ length: newM }, (_, j) => matrix[i]?.[j] ?? "")
        );
        setMatrix(newMatrix);
    }, [matrix]);

    const validate = (checkMatrix = true) => {
        const newErrors: typeof errors = {};
        if (n <= 0 || n > 500) newErrors.n = "Số hàng phải từ 1 đến 500";
        if (m <= 0 || m > 500) newErrors.m = "Số cột phải từ 1 đến 500";
        if (p <= 0 || p > n * m) newErrors.p = `Số loại rương phải từ 1 đến ${n * m}`;

        if (checkMatrix && matrix.length) {
            let matrixInvalid = false;
            let pCount = 0;
            outer: for (let row of matrix) {
                for (let val of row) {
                    const num = parseInt(val);
                    if (isNaN(num) || num < 1 || num > p) {
                        matrixInvalid = true;
                        break outer;
                    }
                    if (num === p) pCount++;
                }
            }
            if (matrixInvalid) newErrors.matrix = `Tất cả các ô trong ma trận phải là số từ 1 đến ${p}`;
            else if (pCount !== 1) newErrors.matrix = `Phải có đúng 1 ô có giá trị là ${p} (hiện tại là ${pCount})`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateMatrix = () => {
        if (validate(false)) {
            updateMatrixSize(n, m);
            setMatrixCreated(true);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const intMatrix = matrix.map(row => row.map(val => parseInt(val)));
            const res = await axios.post("http://localhost:5209/api/treasure/solve", {
                n, m, p, matrix: intMatrix
            });
            onResult(res.data.toFixed(5));
        } catch (err) {
            setErrors({ ...errors, matrix: "Lỗi khi gửi dữ liệu đến server" });
        }
    };
    const handleResetMatrix = () => {
        setN(3);
        setM(3);
        setP(3);
        setMatrix([]);
        setMatrixCreated(true);
        setErrors({});
    };
    const cellSize = 55;
    const cellPadding = 10;
    const cellFullSize = cellSize + cellPadding;

    const gridWidth = m * cellFullSize;
    const gridHeight = n * cellFullSize;

    const Cell = ({ columnIndex, rowIndex, style }: any) => (
        <Box
            style={{ ...style, padding: 4, boxSizing: "border-box" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <input
                value={matrix[rowIndex]?.[columnIndex] ?? ""}
                onChange={(e) => {
                    const newMatrix = [...matrix];
                    newMatrix[rowIndex][columnIndex] = e.target.value;
                    setMatrix(newMatrix);
                }}
                style={{
                    width: 50,
                    height: 50,
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    fontSize: 25
                }}
            />
        </Box>
    );

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 5, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                🧩 Nhập thông tin ma trận kho báu
            </Typography>

            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Số hàng (n)"
                        type="number"
                        value={n}
                        error={!!errors.n}
                        helperText={errors.n}
                        onChange={(e) => {
                            setN(+e.target.value);
                            setMatrixCreated(false);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Số hàng">
                                        <IconButton size="small"><TableRowsIcon fontSize="small" /></IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Số cột (m)"
                        type="number"
                        value={m}
                        error={!!errors.m}
                        helperText={errors.m}
                        onChange={(e) => {
                            setM(+e.target.value);
                            setMatrixCreated(false);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Số cột">
                                        <IconButton size="small"><GridOnIcon fontSize="small" /></IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Số loại rương (p)"
                        type="number"
                        value={p}
                        error={!!errors.p}
                        helperText={errors.p}
                        onChange={(e) => setP(+e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Số loại rương">
                                        <IconButton size="small"><InventoryIcon fontSize="small" /></IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
            </Grid>

            <Box mb={2} textAlign="center">
                <Button
                    variant="outlined"
                    onClick={handleCreateMatrix}
                    disabled={matrixCreated}
                    sx={{ mr: 2 }}
                >
                    Tạo ma trận
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleResetMatrix}
                >
                    Reset
                </Button>
            </Box>

            {matrixCreated && (
                <Box
                    sx={{
                        overflow: "auto",
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        mb: 2,
                        bgcolor: "#fafafa",
                        display: "flex",
                    }}
                >
                    <Box sx={{ minWidth: gridWidth, minHeight: gridHeight }}>
                        <VirtualGrid
                            columnCount={m}
                            rowCount={n}
                            columnWidth={cellFullSize}
                            rowHeight={cellFullSize}
                            width={gridWidth}
                            height={gridHeight}
                        >
                            {Cell}
                        </VirtualGrid>
                    </Box>
                </Box>
            )}

            {errors.matrix && <Alert severity="error" sx={{ mb: 2 }}>{errors.matrix}</Alert>}

            <Divider sx={{ my: 2 }} />

            <Box textAlign="center">
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                    size="large"
                >
                    Giải ma trận
                </Button>
            </Box>
        </Paper>
    );
}
