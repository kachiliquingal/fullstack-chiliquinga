import React from "react";

export default function CharacterCard({
  character,
  actionLabel,
  onAction,
  actionColor,
  disabled,
}) {
  return (
    <div
      style={{
        border: "1px solid #d9e2ec",
        borderRadius: "8px",
        padding: "15px",
        textAlign: "center",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <img
        src={character.image}
        alt={character.name}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
      />
      <h4 style={{ margin: "0 0 5px 0", color: "#334e68" }}>
        {character.name}
      </h4>
      <p style={{ fontSize: "0.9rem", color: "#627d98", marginBottom: "15px" }}>
        {character.species}
      </p>
      <button
        onClick={() => !disabled && onAction(character)}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "8px",
          background: disabled ? "#9fb3c8" : actionColor || "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: disabled ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
