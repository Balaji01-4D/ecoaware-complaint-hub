
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import { Users, FileText, UserPlus, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAllComplaints } from '../../store/slices/adminComplaintSlice';
import AdminUsersManagement from '../../components/admin/AdminUsersManagement';
import AdminComplaintsManagement from '../../components/admin/AdminComplaintsManagement';
import AdminCreateUser from '../../components/admin/AdminCreateUser';
import AdminStats from '../../components/admin/AdminStats';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { complaints } = useSelector((state: RootState) => state.adminComplaints);

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <AdminStats />

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Users className="w-4 h-4" />} label="Users Management" />
          <Tab icon={<FileText className="w-4 h-4" />} label="Complaints Management" />
          <Tab icon={<UserPlus className="w-4 h-4" />} label="Create Admin" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AdminUsersManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AdminComplaintsManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <AdminCreateUser />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
