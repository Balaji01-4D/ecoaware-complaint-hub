
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { complaintService } from '../../services/complaintService';

export interface Complaint {
  id: number;
  title: string;
  description: string;
  imagePath?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
}

interface ComplaintState {
  complaints: Complaint[];
  currentComplaint: Complaint | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaints: [],
  currentComplaint: null,
  isLoading: false,
  error: null,
};

export const fetchMyComplaints = createAsyncThunk(
  'complaints/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await complaintService.getMyComplaints();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const fetchComplaint = createAsyncThunk(
  'complaints/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      return await complaintService.getComplaint(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaint');
    }
  }
);

export const createComplaint = createAsyncThunk(
  'complaints/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await complaintService.createComplaint(formData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create complaint');
    }
  }
);

export const updateComplaint = createAsyncThunk(
  'complaints/update',
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      return await complaintService.updateComplaint(id, formData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update complaint');
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  'complaints/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await complaintService.deleteComplaint(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete complaint');
    }
  }
);

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentComplaint: (state) => {
      state.currentComplaint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyComplaints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyComplaints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchMyComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchComplaint.fulfilled, (state, action) => {
        state.currentComplaint = action.payload;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.complaints.unshift(action.payload);
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        state.currentComplaint = action.payload;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.complaints = state.complaints.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;
