
import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

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
} from "@mui/material";

import { Person as PersonIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firbase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import backarrow from "../assets/backarrow.png";

const BlockedUsersScreen = () => {
  const navigate = useNavigate();

  /* ================= SIDEBAR ================= */
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  /* ================= MOBILE ================= */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ================= STATE ================= */
  const [currentUser, setCurrentUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialog, setDialog] = useState({
    open: false,
    id: null,
    name: "",
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
      setBlockedUsers(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  /* ================= UNBLOCK ================= */
  const handleUnblock = async () => {
    await deleteDoc(doc(db, "blocked_users", dialog.id));
    setDialog({ open: false, id: null, name: "" });
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  /* ================= MAIN ================= */
  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: isMobile ? "0px" : collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
        borderBottom: "2px solid #00000040",
        width: isMobile ? "100%" : "93%",
      }}
    >
      <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
        {/* ================= HEADER ================= */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ bgcolor: "#ffffff", color: "#000" }}
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
                  marginLeft:"10px" 
                }}
              >
                <img
                  src={backarrow}
                  alt="Back"
                  
                  style={{ width: 16, height: 18, }}
                />
              </div>
            </div>

            <Typography fontSize={18} fontWeight={600} sx={{ ml: "18px" }}>
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
                  px: isMobile ? 3 : 6,
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #eee",
                  width: isMobile ? "100%" : "770px",
                }}
              >
                <Avatar
                  src={u.blockedUserImage || ""}
                  sx={{
                    width: 49,
                    height: 46,
                    mr: 2,
                    ml: isMobile ? "-10px" : "-43px",
                  }}
                >
                  <PersonIcon />
                </Avatar>

                <Typography sx={{ flexGrow: 1, fontSize: 15, fontWeight: 500 }}>
                  {u.blockedUserName || "Unknown"}
                </Typography>

                <Button
                  onClick={() =>
                    setDialog({
                      open: true,
                      id: u.id,
                      name: u.blockedUserName,
                    })
                  }
                  sx={{
                    bgcolor: "#fff36d",
                    color: "#000",
                    borderRadius: 999,
                    px: 3,
                    mr: isMobile ? "-10px" : "-33px",
                    height: 36,
                    fontSize: 14,
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

        {/* ================= DIALOG ================= */}
        <Dialog
          open={dialog.open}
          onClose={() => setDialog({ open: false })}
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: "28px", px: 4, py: 3 },
          }}
        >
          <DialogContent sx={{ textAlign: "center", p: 0 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 1.5 }}>
              Unblock {dialog.name}?
            </Typography>

            <Typography
              sx={{ fontSize: 16, opacity: 0.75, mb: 4, lineHeight: 1.4 }}
            >
              Unblocking will allow this profile to reach out to you again
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button
                onClick={() => setDialog({ open: false })}
                sx={{
                  flex: 1,
                  height: 38,
                  borderRadius: 3,
                  border: "2px solid #9b5cff",
                  color: "#9b5cff",
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleUnblock}
                sx={{
                  flex: 1,
                  height: 38,
                  borderRadius: 3,
                  bgcolor: "#9b3cff",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#8a2be2" },
                }}
              >
                Unblock
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
};

export default BlockedUsersScreen;
