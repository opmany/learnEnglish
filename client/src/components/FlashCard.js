import React from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

const FlipCard = styled(Card)(({ theme, isflipped }) => ({
  perspective: "1000px",
  cursor: "pointer",
  minHeight: "180px",
  userSelect: "none",
  position: "relative",
  backgroundColor: "transparent",
  "& .card-inner": {
    position: "relative",
    width: "100%",
    height: "100%",
    textAlign: "center",
    transition: "transform 0.6s",
    transformStyle: "preserve-3d",
    transform: isflipped === "true" ? "rotateY(180deg)" : "rotateY(0deg)",
  },
  "& .card-face": {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  "& .card-back": {
    transform: "rotateY(180deg)",
    backgroundColor: theme.palette.mode === "dark" 
      ? theme.palette.grey[900]
      : theme.palette.grey[100],
  }
}));

const FlashCard = ({ wordData, isFlipped, onToggleFlip }) => {
  const theme = useTheme();
  
  return (
    <FlipCard onClick={onToggleFlip} isflipped={isFlipped.toString()}>
      <Box className="card-inner">
        <CardContent className="card-face">
          <Typography variant="h4" gutterBottom>
            {wordData.word}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click to flip
          </Typography>
        </CardContent>
        <CardContent className="card-face card-back">
          <Typography variant="h4" gutterBottom>
            {wordData.word}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Meaning:</strong> {wordData.meaning}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Translation:</strong> {wordData.translation}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click to flip back
          </Typography>
        </CardContent>
      </Box>
    </FlipCard>
  );
};

export default FlashCard;
