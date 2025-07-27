import React, { useEffect, useState } from "react";
import LogoutButton from '../../components/LogoutButton';
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";

const AdminPanel = () => {
  const theme = useTheme();

  const [sweets, setSweets] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: "",
    image: "",
    inStock: false,
    tags: "",
  });

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error("Failed to fetch sweets:", err);
    }
  };

  const handleOpen = (sweet = null) => {
    setEdit(sweet);
    setForm(
      sweet || {
        name: "",
        description: "",
        category: "",
        price: "",
        rating: "",
        image: "",
        inStock: false,
        tags: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(null);
    setForm({
      name: "",
      description: "",
      category: "",
      price: "",
      rating: "",
      image: "",
      inStock: false,
      tags: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const processedForm = {
        ...form,
        tags: Array.isArray(form.tags)
          ? form.tags
          : form.tags.split(",").map((tag) => tag.trim()),
      };

      if (edit) {
        await axios.put(
          `http://localhost:5000/api/sweets/${edit._id}`,
          processedForm,
          config
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/sweets",
          processedForm,
          config
        );
      }

      handleClose();
      fetchSweets();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/sweets/${id}`, config);
      fetchSweets();
    } catch (err) {
      console.error("Error deleting sweet:", err);
    }
  };

  return (
    
    <Box
      sx={{
        p: 4,
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
       <LogoutButton />
      <Typography variant="h4" gutterBottom sx={{ color: "#FFB300" }}>
        🍬 Admin Sweet Panel
      </Typography>

      <Button
        variant="contained"
        onClick={() => handleOpen()}
        sx={{
          mb: 3,
          backgroundColor: "#FFB300",
          color: "#000",
          "&:hover": { backgroundColor: "#ffa000" },
        }}
      >
        Add Sweet
      </Button>

      <Grid container spacing={3}>
        {sweets.map((sweet) => (
          <Grid item xs={12} sm={6} md={4} key={sweet._id}>
            <Box
              sx={{
                backgroundColor: "#1E1E1E",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" sx={{ color: "#FFEB3B" }}>
                {sweet.name} {sweet.image}
              </Typography>
              <Typography variant="body2" gutterBottom color="gray">
                {sweet.description}
              </Typography>
              <Typography>Name: {sweet.name}</Typography>
              <Typography>Price: ₹{sweet.price}</Typography>
              <Typography>Rating: ⭐ {sweet.rating}</Typography>
              <Typography>Category: {sweet.category}</Typography>
              <Typography>Tags: {sweet.tags?.join?.(", ")}</Typography>
              <Typography sx={{ mb: 1 }}>
                In Stock: {sweet.inStock ? "Yes" : "No"}
              </Typography>
              <Button
                onClick={() => handleOpen(sweet)}
                sx={{ mr: 1 }}
                variant="outlined"
                color="warning"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(sweet._id)}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ backgroundColor: "#1F1F1F", color: "#FFB300", pb: 1 }}
        >
          {edit ? "Edit Sweet" : "Add Sweet"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#121212", color: "#fff" }}>
          {[
            { label: "Name", key: "name" },
            { label: "Description", key: "description" },
            { label: "Category", key: "category", select: true },
            { label: "Price", key: "price", type: "number" },
            { label: "Rating", key: "rating", type: "number" },
            { label: "Emoji", key: "image", placeholder: "🍩" },
            {
              label: "Tags (comma separated)",
              key: "tags",
              placeholder: "chocolate, crunchy",
            },
          ].map((field, idx) =>
            field.select ? (
              <TextField
                key={field.key}
                fullWidth
                select
                label={field.label}
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                sx={{ mt: 2 }}
                SelectProps={{ native: true }}
              >
                <option value="">Select category</option>
                <option value="cake">Cake</option>
                <option value="chocolate">Chocolate</option>
                <option value="laddu">Laddu</option>
                <option value="barfi">Barfi</option>
              </TextField>
            ) : (
              <TextField
                key={field.key}
                fullWidth
                type={field.type || "text"}
                label={field.label}
                placeholder={field.placeholder || ""}
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                sx={{ mt: 2 }}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{
                  style: { color: "#fff", borderColor: "#666" },
                }}
              />
            )
          )}

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) =>
                setForm({ ...form, inStock: e.target.checked })
              }
              style={{ transform: "scale(1.3)" }}
            />
            <Typography sx={{ ml: 1, color: "#fff" }}>In Stock</Typography>
          </Box>

          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#FFB300",
              color: "#000",
              "&:hover": { backgroundColor: "#ffa000" },
            }}
          >
            {edit ? "Update Sweet" : "Add Sweet"}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
