import React, { useState, useCallback } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Divider,
    Stack,
    InputAdornment,
    Tooltip,
    IconButton,
    Alert,
    useMediaQuery
} from "@mui/material";
import GridOnIcon from '@mui/icons-material/GridOn';
import TableRowsIcon from '@mui/icons-material/TableRows';
import InventoryIcon from '@mui/icons-material/Inventory';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { FixedSizeGrid as VirtualGrid } from "react-window";

export default function TreasurePage() {
    const [n, setN] = useState(3);
    const [m, setM] = useState(3);
    const [p, setP] = useState(3);
    const [matrix, setMatrix] = useState<string[][]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ n?: string; m?: string; p?: string; matrix?: string }>({});
    const [matrixCreated, setMatrixCreated] = useState(false);

    const isMobile = useMediaQuery('(max-width:600px)');

    const updateMatrixSize = useCallback((newN: number, newM: number) => {
        const newMatrix = Array.from({ length: newN }, (_, i) =>
            Array.from({ length: newM }, (_, j) => matrix[i]?.[j] ?? "")
        );
        setMatrix(newMatrix);
    }, [matrix]);

    const validate = (checkMatrix: boolean = true): boolean => {
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
        const isValid = validate(false);
        if (isValid) {
            updateMatrixSize(n, m);
            setMatrixCreated(true);
            setErrors({});
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const intMatrix = matrix.map(row => row.map(val => parseInt(val)));
            const res = await axios.post("http://localhost:5209/api/treasure/solve", {
                n, m, p, matrix: intMatrix
            });
            setResult(res.data.toFixed(5));
        } catch (err) {
            setResult(null);
            setErrors({ ...errors, matrix: "Có lỗi khi gửi dữ liệu đến máy chủ" });
        }
    };

    const Cell = ({ columnIndex, rowIndex, style }: any) => (
        <div style={{ ...style, padding: 4 }} className="matrix-cell">
            <TextField
                type="number"
                value={matrix[rowIndex]?.[columnIndex] ?? ""}
                onChange={(e) => {
                    const newMatrix = [...matrix];
                    newMatrix[rowIndex][columnIndex] = e.target.value;
                    setMatrix(newMatrix);
                }}
                inputProps={{ min: 1, max: p, style: { textAlign: "center" } }}
                variant="standard"
                sx={{ width: isMobile ? 32 : 40 }}
            />
        </div>
    );

    return (
        <Box sx={{ width: '100vw', height: '100vh', overflow: 'auto', bgcolor: '#f9fbfc', p: 2 }}>
            <Container maxWidth="xl">
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                        💎 Tìm kho báu
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }} alignItems="flex-end">
                        <TextField
                            label="Số hàng (n)"
                            type="number"
                            value={n}
                            error={!!errors.n}
                            helperText={errors.n}
                            onChange={(e) => {
                                setN(+e.target.value);
                                setMatrixCreated(false);
                            }}
                            fullWidth
                            inputProps={{ min: 1, max: 500 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Số hàng của bản đồ">
                                            <IconButton size="small">
                                                <TableRowsIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            label="Số cột (m)"
                            type="number"
                            value={m}
                            error={!!errors.m}
                            helperText={errors.m}
                            onChange={(e) => {
                                setM(+e.target.value);
                                setMatrixCreated(false);
                            }}
                            fullWidth
                            inputProps={{ min: 1, max: 500 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Số cột của bản đồ">
                                            <IconButton size="small">
                                                <GridOnIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            label="Số loại rương (p)"
                            type="number"
                            value={p}
                            error={!!errors.p}
                            helperText={errors.p}
                            onChange={(e) => setP(+e.target.value)}
                            fullWidth
                            inputProps={{ min: 1, max: n * m }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Tổng số loại rương cần tìm">
                                            <IconButton size="small">
                                                <InventoryIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleCreateMatrix}
                                disabled={matrixCreated}
                                sx={{ height: '100%' }}
                            >
                                Tạo ma trận
                            </Button>
                        </Box>
                    </Stack>

                    {matrixCreated && (
                        <Box sx={{ width: '100%', height: '60vh', mb: 2 }}>
                            <VirtualGrid
                                columnCount={m}
                                rowCount={n}
                                columnWidth={isMobile ? 36 : 48}
                                rowHeight={48}
                                width={Math.min(m * (isMobile ? 36 : 48), 1000)}
                                height={Math.min(n * 48, 500)}
                            >
                                {Cell}
                            </VirtualGrid>
                        </Box>
                    )}

                    {errors.matrix && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {errors.matrix}
                        </Alert>
                    )}

                    <Box textAlign="center" sx={{ mt: 2 }}>
                        <Button variant="contained" size="large" onClick={handleSubmit} endIcon={<SendIcon />}>
                            Giải
                        </Button>
                    </Box>

                    {result && (
                        <Typography variant="h6" align="center" sx={{ mt: 3 }}>
                            ✅ Nhiên liệu ít nhất: <strong>{result}</strong>
                        </Typography>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}