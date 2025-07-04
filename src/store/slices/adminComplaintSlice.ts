
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';
import { Complaint } from './complaintSlice';

interface AdminComplaintState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminComplaintState = {
  complaints: [],
  isLoading: false,
  error: null,
};

export const fetchAllComplaints = createAsyncThunk(
  'adminComplaints/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllComplaints();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'adminComplaints/updateStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      return await adminService.updateComplaintStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const adminComplaintSlice = createSlice({
  name: 'adminComplaints',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllComplaints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      });
  },
});

export const { clearError } = adminComplaintSlice.actions;
export default adminComplaintSlice.reducer;
