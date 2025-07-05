
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { FileText, Clock, CheckCircle, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const AdminStats: React.FC = () => {
  const { complaints } = useSelector((state: RootState) => state.adminComplaints);

  const stats = {
    totalComplaints: complaints.length,
    pendingComplaints: complaints.filter(c => c.status === 'PENDING').length,
    resolvedComplaints: complaints.filter(c => c.status === 'RESOLVED').length,
    inProgressComplaints: complaints.filter(c => c.status === 'IN_PROGRESS').length,
  };

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: FileText,
      color: 'primary.main'
    },
    {
      title: 'Pending',
      value: stats.pendingComplaints,
      icon: Clock,
      color: 'warning.main'
    },
    {
      title: 'In Progress',
      value: stats.inProgressComplaints,
      icon: Users,
      color: 'info.main'
    },
    {
      title: 'Resolved',
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      color: 'success.main'
    }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stat.title}
                  </Typography>
                </Box>
                <stat.icon style={{ color: stat.color, width: 40, height: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminStats;
