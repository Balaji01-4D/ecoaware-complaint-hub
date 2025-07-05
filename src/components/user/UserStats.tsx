
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const UserStats: React.FC = () => {
  const { complaints } = useSelector((state: RootState) => state.complaints);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    rejected: complaints.filter(c => c.status === 'REJECTED').length,
  };

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats.total,
      icon: FileText,
      color: 'primary.main'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'warning.main'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'success.main'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'error.main'
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

export default UserStats;
