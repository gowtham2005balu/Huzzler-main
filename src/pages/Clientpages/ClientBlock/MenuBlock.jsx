

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../../firbase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import backarrow from "../../../assets/backarrow.png";

const BlockedUsersScreen = () => {
  const navigate = useNavigate();

  /* ================= SIDEBAR STATE ================= */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  /* ================= LISTEN SIDEBAR TOGGLE ================= */
  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* ================= STATE ================= */
  const [currentUser, setCurrentUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, id: null, name: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      if (!u) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "blocked_users"),
      where("blockedBy", "==", currentUser.uid)
    );

const unsub = onSnapshot(q, (snap) => {
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  console.log("Blocked Users:", data); // 🔥 check name here
  setBlockedUsers(data);
  setLoading(false);
});

    return () => unsub();
  }, [currentUser]);

  /* ================= UNBLOCK ================= */
  const unblock = async () => {
    await deleteDoc(doc(db, "blocked_users", dialog.id));
    setSnackbar({ open: true, msg: "User unblocked", severity: "success" });
    setDialog({ open: false, id: null, name: "" });
  };

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  /* ================= WRAPPER WITH SIDEBAR ================= */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "0px" : "-10px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <Box
        sx={{
          marginRight: { xs: 0, sm: "220px" }, // 🔥 mobile-la remove
          minHeight: "100vh",
        }}
      >

        {/* ================= HEADER ================= */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "white",
            color: "#000",
          }}
        >
          <Toolbar>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                onClick={() => navigate(-1)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 14,
                  border: "0.8px solid #E0E0E0",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  marginRight: "10px",
                }}
              >
                <img
                  src={backarrow}
                  alt="Back"
                  style={{ width: 16, height: 18 }}
                />
              </div>
            </div>

            <Typography fontWeight={600} fontSize={18}>
              Blocked accounts
            </Typography>
          </Toolbar>
        </AppBar>

        {/* ================= LIST ================= */}
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {blockedUsers.map((u) => (
              <ListItem
              key={u.id}
                sx={{
                  bgcolor: "#fffdf8",
                  borderRadius: 999,
                  px: { xs: 2, sm: 62 },          // 🔥 mobile padding
                  marginLeft: { xs: 0, sm: "-230px" }, // 🔥 mobile reset
                  py: 1.0,
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #eee",
                }}
              >

                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    marginLeft: { xs: 0, sm: "-490px" }, // 🔥 mobile normal
                    mr: 2,
                  }}
                >

                  <PersonIcon />
                </Avatar>

                <Typography sx={{ flexGrow: 1, fontSize: 15, fontWeight: 500 }}>
                  {u.blockedUserName ? u.blockedUserName : "Unknown"}
                </Typography>

                <Button
                  onClick={() =>
                    setDialog({ open: true, id: u.id, name: u.blockedUserName })
                  }
                  sx={{
                    bgcolor: "#fff36d",
                    color: "#000",
                    borderRadius: 999,
                    px: 3,
                    height: 36,
                    fontSize: 14,
                    marginRight: { xs: 0, sm: "-480px" }, // 🔥 mobile reset
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#ffef4d" },
                  }}
                >
                  Unblock
                </Button>
              </ListItem>
            ))}
          </List>
        </Container>

        <Dialog
          open={dialog.open}
          onClose={() => setDialog({ open: false })}
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "26px",
              px: 5,
              py: 4,
            },
          }}
        >
          <DialogContent sx={{ textAlign: "center", p: 0 }}>
            {/* TITLE */}
            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 700,
                mb: 1.5,
                textTransform: "none",
              }}
            >
              Unblock {dialog.name?.toLowerCase()}?
            </Typography>


            {/* SUB TITLE */}
            <Typography
              sx={{
                fontSize: "16px",
                color: "#000",
                opacity: 0.75,
                mb: 4,
                lineHeight: 1.5,
              }}
            >
              Unblocking will allow this profile to reach out to you again.
            </Typography>

            {/* BUTTONS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // gap: 4,
              }}
            >
              {/* CANCEL */}
              <Button
                onClick={() => setDialog({ open: false })}
                sx={{
                  flex: 1,
                  height: 45,
                  borderRadius: 3,
                  border: "1.8px solid #9b5cff",
                  color: "#9b5cff",
                  fontSize: 16,
                  marginLeft: "10px",
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "0 6px 14px rgba(155,92,255,0.15)",
                }}
              >
                Cancel
              </Button>

              {/* UNBLOCK */}
              <Button
                onClick={unblock}
                sx={{
                  flex: 1,
                  height: 45,
                  borderRadius: 3,
                  bgcolor: "#9b3cff",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 500,
                  marginLeft: '70px',
                  textTransform: "none",
                  // boxShadow: "0 10px 18px rgba(155,60,255,0.35)",
                  "&:hover": {
                    bgcolor: "#8a2be2",
                  },
                }}
              >
                Unblock
              </Button>
            </Box>
          </DialogContent>
        </Dialog>


        {/* ================= SNACKBAR ================= */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.msg}</Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default BlockedUsersScreen;
