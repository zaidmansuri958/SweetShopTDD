import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const SweetCard = ({ sweet, onPurchase, isAdmin, onEdit, onDelete }) => {
  return (
    <Card sx={{ m: 2, backgroundColor: "#222" }}>
      <CardContent>
        <Typography variant="h6">{sweet.name}</Typography>
        <Typography variant="body2">{sweet.description}</Typography>
        <Typography variant="body2">Price: ₹{sweet.price}</Typography>
        <Typography variant="body2">Qty: {sweet.quantity}</Typography>
        {!isAdmin ? (
          <Button
            variant="contained"
            disabled={sweet.quantity === 0}
            onClick={() => onPurchase(sweet._id)}
            sx={{ mt: 1 }}
          >
            {sweet.quantity === 0 ? "Sold Out" : "Purchase"}
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={() => onEdit(sweet)} sx={{ mt: 1, mr: 1 }}>Edit</Button>
            <Button variant="contained" color="error" onClick={() => onDelete(sweet._id)} sx={{ mt: 1 }}>Delete</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SweetCard;