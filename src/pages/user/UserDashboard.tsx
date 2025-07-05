
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper
} from '@mui/material';
import { FileText, User, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchMyComplaints } from '../../store/slices/complaintSlice';
import UserComplaints from '../../components/user/UserComplaints';
import UserProfile from '../../components/user/UserProfile';
import UserCreateComplaint from '../../components/user/UserCreateComplaint';
import UserStats from '../../components/user/UserStats';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMyComplaints());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      
      <UserStats />

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<FileText className="w-4 h-4" />} label="My Complaints" />
          <Tab icon={<Plus className="w-4 h-4" />} label="Create Complaint" />
          <Tab icon={<User className="w-4 h-4" />} label="Profile" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <UserComplaints />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UserCreateComplaint />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UserProfile />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default UserDashboard;
