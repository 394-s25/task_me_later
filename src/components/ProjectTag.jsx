import { Chip } from "@mui/material";
export default function ProjectTag({ project }) {
  return (
    <Chip
      label={project}
      sx={{
        borderRadius: "0px 16px 16px 0px", // Semi-oval
        backgroundColor: "#1976d2",
        color: "white",
        height: "auto",
        marginTop: 1.5,
        width: "70%",
        paddingY: "4px",
        paddingX: "8px",
        fontSize: "0.8rem",
        lineHeight: 1.2,
        textAlign: "center",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        "& .MuiChip-label": {
          whiteSpace: "normal",
          overflowWrap: "break-word",
          textAlign: "center",
          padding: 0,
        },
      }}
    />
  );
}
