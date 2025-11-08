import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import CircleIcon from "@mui/icons-material/Circle";
import Tooltip from "@mui/material/Tooltip";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import QuizIcon from '@mui/icons-material/Quiz';
import StyleIcon from '@mui/icons-material/Style';
import EditIcon from '@mui/icons-material/Edit';
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useExam } from "../ExamContext";

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Words Showcase', icon: <SchoolIcon />, path: '/WordsShowcase' },
  { text: 'Matching Game', icon: <SportsEsportsIcon />, path: '/MatchingGamePage' },
  { text: 'Multiple Choice', icon: <QuizIcon />, path: '/MultipleChoiceQuizPage' },
  { text: 'Flash Cards', icon: <StyleIcon />, path: '/FlashCardsPage' },
  { text: 'Exam Editor', icon: <EditIcon />, path: '/ExamEditor' },
];

const Layout = ({ children, toggleColorMode, mode }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { setSelectedExamId, connectionStatus, currentExamJson, exams } = useExam();
  const [openExamList, setOpenExamList] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Learn English
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {currentExamJson && (
          <>
            <ListItemButton onClick={() => setOpenExamList(!openExamList)}>
              <ListItemText
                primary={`Exam: ${currentExamJson.name}`}
                sx={{ pl: 1 }}
              />
              {openExamList ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openExamList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {exams.map((exam) => (
                  <ListItemButton
                    key={exam.id}
                    sx={{ pl: 4 }}
                    selected={exam.id === currentExamJson.name}
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setOpenExamList(false);
                    }}
                  >
                    <ListItemText primary={exam.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Tooltip title={connectionStatus ? "Connected" : "Offline"}>
            <CircleIcon
              sx={{
                fontSize: 14,
                color: connectionStatus ? "success.main" : "error.main",
                mr: 2,
              }}
            />
          </Tooltip>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Learn English'}
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* This is for spacing below the AppBar */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;